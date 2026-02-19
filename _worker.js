// _worker.js | Versão: 1.4.0 | Atualizado: 2026-02-19 | Descrição: fix loop redirect HTTP→HTTPS WordPress

const ORIGIN_HTTP = 'http://origin.moskogas.com.br';
const ORIGIN_HTTPS = 'https://sh-pro88.hostgator.com.br';
const DOMINIO = 'moskogas.com.br';

// ✅ Páginas com HTML pronto no repositório
const PAGINAS_ESTATICAS = [
  '/',
  // '/gas-de-cozinha/',
  // '/gas-p45/',
  // '/gas-industrial-campo-grande-ms/',
  // '/agua-mineral-em-campo-grande-ms/',
  // '/vendas-corporativas/',
  // '/sobre-a-mosko-gas/',
  // '/contato/',
];

// Headers padrão para o WordPress entender que vem de HTTPS
function wpHeaders(request) {
  const h = new Headers(request.headers);
  h.set('Host', DOMINIO);
  h.set('X-Forwarded-Proto', 'https');
  h.set('X-Forwarded-Host', DOMINIO);
  h.set('X-Real-IP', request.headers.get('CF-Connecting-IP') || '');
  return h;
}

async function fetchWordPress(pathname, search, request) {
  // Tenta primeiro via HTTPS (sh-pro88) — evita redirect HTTP→HTTPS
  const url = ORIGIN_HTTPS + pathname + (search || '');
  
  const req = new Request(url, {
    method: request.method,
    headers: wpHeaders(request),
    body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
    redirect: 'manual',
  });

  const response = await fetch(req);

  // Se redirect, reescreve location para o domínio correto
  if ([301, 302, 307, 308].includes(response.status)) {
    const location = response.headers.get('location') || '';
    // Se redireciona para o próprio site, segue internamente (evita loop)
    if (location.includes(DOMINIO) || location.startsWith('/')) {
      const newPath = location.replace('https://' + DOMINIO, '').replace('http://' + DOMINIO, '');
      return fetchWordPress(newPath, '', request);
    }
    // Redirect externo — devolve para o browser
    return new Response(null, {
      status: response.status,
      headers: { 'Location': location },
    });
  }

  const newHeaders = new Headers(response.headers);
  newHeaders.delete('x-frame-options');
  newHeaders.delete('content-security-policy');

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    let pathname = url.pathname;

    // Normaliza barra no final (exceto arquivos com extensão)
    if (!pathname.endsWith('/') && !pathname.includes('.')) {
      pathname = pathname + '/';
    }

    // Serve HTML estático do Cloudflare Pages
    if (PAGINAS_ESTATICAS.includes(pathname)) {
      const asset = await env.ASSETS.fetch(request);
      if (asset.status !== 404) return asset;
    }

    // Passa para o WordPress
    try {
      return await fetchWordPress(url.pathname, url.search, request);
    } catch (err) {
      return new Response('Erro ao conectar: ' + err.message, { status: 502 });
    }
  },
};
