// _worker.js | Versão: 2.9.4 | Atualizado: 2026-03-15 | Descrição: +rota /politica-de-troca/ para Google Merchant Center

const ORIGIN = 'http://origin.moskogas.com.br';

// 301 permanentes — páginas antigas para as novas (SEO: preserva link juice)
const REDIRECTS_301 = {
  // ── Páginas quebradas com backlinks (corrigidas 2026-02-28) ──────────────
  '/gas-de-cozinha-ou-gas-p45/':                       '/blog/gas-de-cozinha-ou-gas-p45/',   // 13 backlinks
  '/gas-industrial/':                                  '/gas-industrial-campo-grande-ms/',    // 5 backlinks
  '/gas-mais-proximo/':                                '/gas-mais-proximo-em-campo-grande-ms/', // 4 backlinks
  // slugs sem trailing slash
  '/gas-de-cozinha-ou-gas-p45':                        '/blog/gas-de-cozinha-ou-gas-p45/',
  '/gas-industrial':                                   '/gas-industrial-campo-grande-ms/',
  '/gas-mais-proximo':                                 '/gas-mais-proximo-em-campo-grande-ms/',
  // ── Glossário → páginas produto (consolidação de juice — 87 páginas thin) ─
  '/glossario/o-que-e-botijao-de-gas-glp-p13/':                    '/gas-de-cozinha/',
  '/glossario/o-que-e-botijao-de-gas-glp-para-uso-domestico/':     '/gas-de-cozinha/',
  '/glossario/o-que-e-cilindro-de-gas-glp-para-residencias/':      '/gas-de-cozinha/',
  '/glossario/o-que-e-botijao-de-gas-glp-de-13kg/':                '/gas-de-cozinha/',
  '/glossario/o-que-e-botijao-de-gas-glp-para-uso-residencial/':   '/gas-de-cozinha/',
  '/glossario/o-que-e-gas-glp-de-uso-domestico/':                  '/gas-de-cozinha/',
  '/glossario/o-que-e-botijao-de-gas-glp-p5/':                     '/gas-de-cozinha-ou-gas-p45/',
  '/glossario/o-que-e-botijao-de-gas-glp-de-5kg/':                 '/gas-de-cozinha-ou-gas-p45/',
  '/glossario/o-que-e-botijao-de-gas-glp-p45/':                    '/gas-p45/',
  '/glossario/o-que-e-botijao-de-gas-glp-para-uso-alimenticio/':   '/gas-industrial-campo-grande-ms/',
  '/glossario/o-que-e-botijao-de-gas-glp-para-uso-industrial/':    '/gas-industrial-campo-grande-ms/',
  '/glossario/o-que-e-cilindro-de-gas-glp-para-industrias/':       '/gas-industrial-campo-grande-ms/',
  '/glossario/o-que-e-cilindro-de-gas-glp-p45/':                   '/gas-industrial-campo-grande-ms/',
  '/glossario/o-que-e-botijao-de-gas-glp-de-45kg/':                '/gas-p45/',
  '/glossario/o-que-e-garrafa-de-gas-glp/':                        '/glossario/o-que-e-botijao-de-gas-glp/',
  '/glossario/o-que-e-recipiente-de-armazenamento-do-gas-glp/':    '/glossario/o-que-e-botijao-de-gas-glp/',
  '/glossario/o-que-e-gas-glp-em-vasilhame/':                      '/glossario/o-que-e-botijao-de-gas-glp/',
  '/glossario/o-que-e-limite-de-validade-do-gas-glp/':             '/gas-de-cozinha-ou-gas-p45/',
  '/glossario/o-que-e-procedimento-de-troca-do-gas-glp/':          '/como-saber-se-o-gas-esta-acabando/',
  '/glossario/o-que-e-gas-glp-liquido/':                           '/glossario/o-que-e-botijao-de-gas-glp/',
  '/glossario/o-que-e-gas-glp-de-baixa-pressao/':                  '/glossario/o-que-e-botijao-de-gas-glp/',
  '/agua-mineral-distribuidora-antigo/':               '/agua-mineral-em-campo-grande-ms/',
  '/agua-mineral-campo-grande-ms-antigo/':             '/agua-mineral-em-campo-grande-ms/',
  '/gas-p45-antigo/':                                  '/gas-p45/',
  '/gas-entrega-hoje-em-campo-grande-ms-antigo/':      '/gas-entrega-hoje-em-campo-grande-ms/',
  // slugs antigos sem trailing slash (segurança)
  '/agua-mineral-distribuidora-antigo':                '/agua-mineral-em-campo-grande-ms/',
  '/agua-mineral-campo-grande-ms-antigo':              '/agua-mineral-em-campo-grande-ms/',
  '/gas-p45-antigo':                                   '/gas-p45/',
  '/gas-entrega-hoje-em-campo-grande-ms-antigo':       '/gas-entrega-hoje-em-campo-grande-ms/',
};
const DOMINIO = 'moskogas.com.br';

// ✅ Páginas com HTML pronto no repositório
const PAGINAS_ESTATICAS = [
  '/blog/',
  '/blog/o-que-e-o-gas-de-cozinha-ou-glp/',
  '/blog/como-saber-se-o-gas-esta-acabando/',
  '/blog/onde-instalar-o-gas-de-cozinha/',
  '/blog/nao-e-so-no-fogao-conheca-3-utilidades-do-gas-de-cozinha/',
  '/blog/como-utilizar-o-gas-de-cozinha-de-maneira-correta-em-seu-comercio/',
  '/blog/5-receitas-para-voce-economizar-gas-de-cozinha/',
  '/blog/gas-de-cozinha-ou-gas-p45/',
  '/blog/vantagens-de-utilizar-o-gas-glp/',
  '/blog/gas-p45-saiba-como-armazenar-cilindro-de-gas/',
  '/blog/gas-p20-tudo-o-que-voce-precisa-saber-sobre-o-gas-para-empilhadeira/',
  '/blog/nem-diesel-nem-gasolina-conheca-as-vantagens-do-gas-para-empilhadeira/',
  '/blog/gas-liquefeito-de-petroleo-glp-a-vantagem-competitiva-para-hoteis-e-pousadas/',
  '/blog/agua-mineral-com-gas-por-que-servir-no-seu-restaurante/',
  '/blog/agua-mineral-de-onde-vem-a-agua-que-bebemos/',
  '/blog/agua-mineral-qual-a-melhor-forma-de-servir-no-meu-estabelecimento/',
  '/blog/por-que-voce-deve-beber-agua-mineral-e-quais-sao-seus-beneficios/',
  '/blog/o-consumo-de-agua-mineral-e-a-importancia-de-escolher-agua-mineral-de-qualidade-e-segura-para-consumo/',
  '/blog/gas-de-cozinha-preco-p13-campo-grande/',
  '/blog/botijao-vazio-como-pedir-entrega-campo-grande/',
  '/blog/p13-p20-p45-qual-botijao-escolher/',
  '/blog/como-identificar-botijao-ultragaz-original/',
  '/blog/gas-sem-nota-fiscal-riscos/',
  '/blog/quanto-dura-botijao-p13/',
  '/blog/gas-para-restaurante-p45-ou-p20/',
  '/blog/disk-gas-bairros-campo-grande/',
  '/blog/revenda-autorizada-gas-campo-grande/',
  '/blog/mosko-gas-vs-supermercado/',
  '/blog/como-identificar-vazamento-de-gas/',
  '/blog/botijao-de-gas-tem-validade/',
  '/blog/como-armazenar-botijao-de-gas-com-seguranca/',
  '/blog/gas-comercial-p13-p20-ou-p45/',
  '/blog/bebedouro-de-agua-mineral-para-empresa/',
  '/blog/como-funciona-entrega-de-gas-em-campo-grande/',
  '/blog/como-saber-se-revenda-de-gas-e-autorizada/',
  '/blog/galao-de-agua-retornavel-ou-descartavel/',
  '/blog/gas-glp-para-aquecedor-qual-botijao-usar/',
  '/blog/ph-da-agua-mineral-o-que-significa/',
  '/blog/gas-para-sauna-qual-botijao/',
  '/blog/o-que-e-botijao-p45/',
  '/blog/regulamentacao-anp-revenda-gas/',
  '/blog/gas-para-condominio-central-glp/',
  '/blog/quando-trocar-mangueira-regulador-gas/',
  '/blog/gas-para-pizzaria-campo-grande/',
  '/blog/como-calcular-consumo-gas-restaurante/',
  '/blog/gas-p20-empilhadeira-campo-grande/',
  '/blog/gas-entrega-urgente-campo-grande/',
  '/blog/beneficio-gas-do-povo-como-funciona/',
  '/',
  '/loja/',
  '/distribuidora-de-gas-campo-grande/',
  '/gas-aberto-agora-campo-grande/',
  '/gas-em-campo-grande-ms/',
  '/preco-gas-campo-grande-ms/',
  '/glossario/o-que-e-botijao-de-gas-glp/',
  '/como-saber-se-o-gas-esta-acabando/',
  '/botijao-de-gas/',
  '/gas-de-cozinha/',
  '/gas-de-cozinha-ou-gas-p45/',
  '/politica-de-privacidade/',
  '/termos-de-uso-mosko-gas/',
  '/politica-de-cookies/',
  '/politica-de-troca/',
  '/gas-p45/',
  '/gas-industrial-campo-grande-ms/',
  '/agua-mineral-em-campo-grande-ms/',
  '/vendas-corporativas/',
  '/gas-para-restaurantes/',
  '/gas-para-padarias/',
  '/gas-para-hoteis/',
  '/gas-para-bares/',
  '/gas-industrial-empresas/',
  '/gas-para-saloes-de-festas/',
  '/gas-para-escolas/',
  '/gas-para-construcao-civil/',
  '/gas-para-condominios/',
  '/gas-para-lavanderias/',
  '/gas-para-clinicas/',
  '/sobre-a-mosko-gas/',
  '/contato/',
  '/gas-do-povo-em-campo-grande-ms/',
  '/disk-gas-em-campo-grande-ms/',
  '/disk-gas-campo-grande-ms/',
  '/gas-entrega-hoje-em-campo-grande-ms/',
  '/gas-mais-proximo-em-campo-grande-ms/',
  '/gas-perto-de-mim-campo-grande/',
  '/entrega-de-gas-campo-grande-ms/',
  '/whatsappgas/',
  '/gas-de-empilhadeiras-p20/',
  '/gas-na-mata-do-jacinto/',
  '/gas-caranda-bosque/',
  '/gas-giocondo-orsi/',
  '/gas-autonomista/',
  '/gas-vila-rica/',
  '/gas-santa-fe/',
  '/gas-centro/',
  '/gas-jardim-dos-estados/',
  '/gas-vila-margarida/',
  '/gas-novos-estados/',
  '/gas-vila-nascente/',
  '/gas-no-futurista/',
  '/gas-no-damha/',
  '/gas-no-alphaville/',
  '/gas-vivendas-do-bosque/',
  '/gas-nova-lima/',
  '/gas-jardim-presidente/',
  '/gas-columbia/',
  '/gas-chacara-cachoeira/',
  '/gas-monte-castelo/',
  '/gas-sao-francisco/',
  '/gas-universitario/',
  '/gas-estrela-dalva/',
  '/gas-aero-rancho/',
  '/gas-aeroporto/',
  '/gas-alves-pereira/',
  '/gas-amambai/',
  '/gas-america/',
  '/gas-bandeirantes/',
  '/gas-batistao/',
  '/gas-bela-vista/',
  '/gas-cabreuva/',
  '/gas-caicara/',
  '/gas-carada/',
  '/gas-carlota/',
  '/gas-carvalho/',
  '/gas-centenario/',
  '/gas-centro-oeste/',
  '/gas-chacara-das-mansoes/',
  '/gas-conjunto-aero-rancho/',
  '/gas-conjunto-jose-abrao/',
  '/gas-conjunto-estrela-do-sul/',
  '/gas-coophafe/',
  '/gas-coophasul/',
  '/gas-coophatrabalho/',
  '/gas-coophavila-ii/',
  '/gas-coronel-antonino/',
  '/gas-cruzeiro/',
  '/gas-gloria/',
  '/gas-guanandi/',
  '/gas-guanandi-ii/',
  '/gas-itanhanga/',
  '/gas-itanhanga-park/',
  '/gas-jacy/',
  '/gas-jardim-aero-rancho/',
  '/gas-jardim-aeroporto/',
  '/gas-jardim-america/',
  '/gas-jardim-bela-vista/',
  '/gas-jardim-campo-alto/',
  '/gas-jardim-centenario/',
  '/gas-jardim-columbia/',
  '/gas-jardim-ima/',
  '/gas-jardim-itamaraca/',
  '/gas-jardim-jacy/',
  '/gas-jardim-joquei-club/',
  '/gas-jardim-leblon/',
  '/gas-jardim-monte-libano/',
  '/gas-jardim-monumento/',
  '/gas-jardim-nhanha/',
  '/gas-jardim-noroeste/',
  '/gas-jardim-parati/',
  '/gas-jardim-paulista/',
  '/gas-jardim-santa-emilia/',
  '/gas-jardim-sao-bento/',
  '/gas-jardim-sao-conrado/',
  '/gas-jardim-sao-lourenco/',
  '/gas-doutor-albuquerque/',
  '/gas-joquei-club/',
  '/gas-conjunto-mata-jacinto/',
];

// Extensões de arquivos estáticos do Cloudflare Pages (só imagens/fontes — CSS e JS do WP vão direto)
// .xml REMOVIDO — sitemaps e feeds XML devem sempre proxiar para o WordPress
const EXTENSOES_ESTATICAS = /\.(webp|jpg|jpeg|png|gif|svg|ico|woff|woff2|ttf|pdf|txt)$/i;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // ── Proxy /api/pub/pedido-site → backend Mosko App (resolve CORS) ─────
    if (pathname === '/api/pub/pedido-site' && request.method === 'POST') {
      try {
        const body = await request.text();
        const resp = await fetch('https://api.moskogas.com.br/api/pub/pedido-site', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Site-Key': 'sk_site_mosko_2026' },
          body: body,
        });
        const data = await resp.text();
        return new Response(data, {
          status: resp.status,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });
      } catch (e) {
        return new Response(JSON.stringify({ ok: false, error: e.message }), {
          status: 502,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });
      }
    }

    // 301 permanentes — redireciona páginas antigas antes de qualquer outra lógica
    if (REDIRECTS_301[pathname]) {
      return Response.redirect('https://moskogas.com.br' + REDIRECTS_301[pathname], 301);
    }

    // Serve sitemap.xml e robots.txt estáticos (prioridade sobre WordPress)
    if (pathname === '/sitemap.xml' || pathname === '/robots.txt') {
      const asset = await env.ASSETS.fetch(request);
      if (asset.status !== 404) {
        const h = new Headers(asset.headers);
        h.set('Cache-Control', 'no-cache, no-store, must-revalidate');
        h.set('Content-Type', pathname.endsWith('.xml') ? 'application/xml; charset=utf-8' : 'text/plain');
        return new Response(asset.body, { status: asset.status, headers: h });
      }
    }

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


    // Redirects: posts antigos com emoji no slug → páginas estáticas
    const REDIRECTS = {
      '/%f0%9f%94%a5-gas-de-cozinha-no-jardim-veraneio-em-campo-grande-ms-rapido-barato-e-perto-de-voce/': '/gas-jardim-veraneio/',
      '/%f0%9f%94%a5-gas-de-cozinha-nos-novos-estados-em-campo-grande-ms-rapido-barato-e-perto-de-voce/': '/gas-novos-estados/',
      '/%f0%9f%94%a5-gas-de-cozinha-no-estrela-dalva-em-campo-grande-ms-rapido-barato-e-perto-de-voce/': '/gas-estrela-dalva/',
      '/%f0%9f%94%a5-gas-de-cozinha-no-mata-do-jacinto-em-campo-grande-ms-rapido-barato-e-perto-de-voce/': '/gas-na-mata-do-jacinto/',
      '/%f0%9f%94%a5-entrega-de-gas-no-coronel-antonino-em-campo-grande-ms-rapido-barato-e-perto-de-voce/': '/gas-coronel-antonino/',
      '/%f0%9f%94%a5-gas-de-cozinha-no-danubio-azul-em-campo-grande-ms-rapido-barato-e-perto-de-voce/': '/gas-danubio-azul/',
    };
    const redirDest = REDIRECTS[pathname.toLowerCase()];
    if (redirDest) return Response.redirect('https://' + DOMINIO + redirDest, 301);

    // ── Intercepta padrões que geram 404 em massa ─────────────────────────
    // URLs WordPress antigas com query param de ID
    const searchParams = url.searchParams;
    if (searchParams.has('p') || searchParams.has('page_id') || searchParams.has('attachment_id')) {
      return Response.redirect('https://' + DOMINIO + '/', 301);
    }

    // Prefixos do glossário deletado e outros padrões antigos
    const PREFIXOS_404 = [
      '/glossario/',
      '/glp/',
      '/glossary/',
      '/termos/',
      '/dicionario/',
      '/term/',
      '/wp-json/',
      '/wp-admin/',
      '/.well-known/',
      '/feed/',
      '/comments/',
      '/trackback/',
      '/xmlrpc.php',
      '/wp-login.php',
      '/wp-cron.php',
      '/?author=',
    ];
    if (PREFIXOS_404.some(p => pathname.startsWith(p) || pathname === p.replace('/', ''))) {
      return Response.redirect('https://' + DOMINIO + '/', 301);
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
        h.delete('accept-encoding'); // força resposta sem gzip — evita conflito na reescrita
        h.delete('cf-connecting-ip');
        h.delete('cf-ipcountry');
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

      // Reescreve URLs no body HTML para trocar origin.moskogas.com.br → moskogas.com.br
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('text/html') || contentType.includes('text/css') || contentType.includes('javascript') || contentType.includes('text/xml') || contentType.includes('application/xml')) {
        let body = await response.text();
        body = body
          .replace(/http:\/\/origin\.moskogas\.com\.br/g, 'https://moskogas.com.br')
          .replace(/https:\/\/origin\.moskogas\.com\.br/g, 'https://moskogas.com.br')
          .replace(/http:\/\/moskogas\.com\.br/g, 'https://moskogas.com.br');
        newHeaders.delete('content-encoding'); // evita conflito com gzip após reescrita
        return new Response(body, {
          status: response.status,
          statusText: response.statusText,
          headers: newHeaders,
        });
      }

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
