const WORDPRESS_IP = 'http://origin.moskogas.com.br';

// ✅ Adicione aqui cada página que já tem HTML pronto no repositório
const PAGINAS_ESTATICAS = [
  '/',
  // '/gas-de-cozinha/',    ← descomente quando terminar o HTML
  // '/gas-p45/',
  // '/gas-industrial/',
  // '/agua-mineral/',
  // '/vendas-corporativas/',
];

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    let pathname = url.pathname;

    // Normaliza barra no final (exceto arquivos com extensão)
    if (!pathname.endsWith('/') && !pathname.includes('.')) {
      pathname = pathname + '/';
    }

    // Se a página tem HTML estático → serve do Cloudflare Pages
    if (PAGINAS_ESTATICAS.includes(pathname)) {
      const asset = await env.ASSETS.fetch(request);
      if (asset.status !== 404) {
        return asset;
      }
    }

    // Qualquer outra rota → passa para o WordPress via IP
    const wpUrl = WORDPRESS_IP + url.pathname + url.search;

    const wpRequest = new Request(wpUrl, {
      method: request.method,
      headers: (() => {
        const headers = new Headers(request.headers);
        headers.set('Host', 'moskogas.com.br');
        return headers;
      })(),
      body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
      redirect: 'follow',
    });

    try {
      const response = await fetch(wpRequest);
      const newHeaders = new Headers(response.headers);
      newHeaders.delete('x-frame-options');
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders,
      });
    } catch (err) {
      return new Response('Erro ao conectar com o servidor WordPress.', {
        status: 502,
      });
    }
  },
};
