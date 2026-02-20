// _worker.js | Versão: 1.9.0 | Atualizado: 2026-02-20 | Descrição: 5 novas páginas ativadas (p45, industrial, agua, corporativo, sobre)

const ORIGIN = 'http://origin.moskogas.com.br';
const DOMINIO = 'moskogas.com.br';

// ✅ Páginas com HTML pronto no repositório
const PAGINAS_ESTATICAS = [
  '/',
  '/gas-de-cozinha/',
  '/gas-p45/',
  '/gas-industrial-campo-grande-ms/',
  '/agua-mineral-em-campo-grande-ms/',
  '/vendas-corporativas/',
  // '/sobre-a-mosko-gas/',   ← temporariamente desativado para capturar conteúdo WP
  // '/contato/',   ← ainda não criada
];

// Extensões de arquivos estáticos — sempre servidos pelo Cloudflare Pages
const EXTENSOES_ESTATICAS = /\.(webp|jpg|jpeg|png|gif|svg|ico|css|js|woff|woff2|ttf|pdf|txt|xml|json)$/i;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // Serve arquivos estáticos (imagens, fontes, etc) direto pelo Cloudflare
    if (EXTENSOES_ESTATICAS.test(pathname)) {
      const asset = await env.ASSETS.fetch(request);
      if (asset.status !== 404) return asset;
    }

    // Normaliza barra APENAS para checar páginas estáticas
    let pathnameNorm = pathname;
    if (!pathnameNorm.endsWith('/') && !pathnameNorm.includes('.')) {
      pathnameNorm = pathnameNorm + '/';
    }

    // Serve HTML estático do Cloudflare Pages
    if (PAGINAS_ESTATICAS.includes(pathnameNorm)) {
      const asset = await env.ASSETS.fetch(request);
      if (asset.status !== 404) return asset;
    }

    // Passa para o WordPress com pathname ORIGINAL (sem modificar)
    const wpUrl = ORIGIN + pathname + url.search;

    const wpRequest = new Request(wpUrl, {
      method: request.method,
      headers: (() => {
        const h = new Headers(request.headers);
        h.set('Host', DOMINIO);
        h.set('X-Forwarded-Proto', 'https');
        h.set('X-Forwarded-Host', DOMINIO);
        return h;
      })(),
      body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
      redirect: 'manual',
    });

    try {
      const response = await fetch(wpRequest);

      // Reescreve redirects para o domínio correto
      if ([301, 302, 307, 308].includes(response.status)) {
        const location = response.headers.get('location') || '';
        const newLocation = location
          .replace(ORIGIN, 'https://' + DOMINIO)
          .replace('http://' + DOMINIO, 'https://' + DOMINIO);
        return new Response(null, {
          status: response.status,
          headers: { 'Location': newLocation },
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

    } catch (err) {
      return new Response('Erro: ' + err.message, { status: 502 });
    }
  },
};
