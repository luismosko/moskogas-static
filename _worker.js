const ORIGIN = 'http://origin.moskogas.com.br';
const DOMINIO = 'moskogas.com.br';

const PAGINAS_ESTATICAS = [
  '/',
  // '/gas-de-cozinha/',
  // '/gas-p45/',
];

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    let pathname = url.pathname;

    if (!pathname.endsWith('/') && !pathname.includes('.')) {
      pathname = pathname + '/';
    }

    // Serve HTML estático do Cloudflare Pages
    if (PAGINAS_ESTATICAS.includes(pathname)) {
      const asset = await env.ASSETS.fetch(request);
      if (asset.status !== 404) return asset;
    }

    // Passa para o WordPress — sem seguir redirects automaticamente
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
      redirect: 'manual', // não segue redirect automaticamente
    });

    try {
      const response = await fetch(wpRequest);

      // Se o WordPress redirecionar, reescreve a URL para o domínio correto
      if ([301, 302, 307, 308].includes(response.status)) {
        const location = response.headers.get('location');
        if (location) {
          // Troca a URL de origem pelo domínio correto
          const newLocation = location
            .replace(ORIGIN, 'https://' + DOMINIO)
            .replace('http://' + DOMINIO, 'https://' + DOMINIO);
          
          return new Response(null, {
            status: response.status,
            headers: { 'Location': newLocation },
          });
        }
      }

      const newHeaders = new Headers(response.headers);
      newHeaders.delete('x-frame-options');
      
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders,
      });

    } catch (err) {
      return new Response('Erro ao conectar com o servidor: ' + err.message, {
        status: 502,
      });
    }
  },
};
