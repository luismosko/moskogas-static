// _worker.js | Versão: 1.5.0 | Atualizado: 2026-02-19 | Descrição: origin.moskogas.com.br configurado e funcionando

const ORIGIN = 'http://origin.moskogas.com.br';
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

    // Passa para o WordPress via origin
    const wpUrl = ORIGIN + url.pathname + url.search;

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
