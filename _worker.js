/**
 * _worker.js | Versão: 3.1.3 | Atualizado: 2026-04-26
 * Descrição: WordPress REMOVIDO — site 100% estático no Cloudflare Pages
 * MUDANÇAS v3.1.3: ONDA 3 — Artigos pilares do blog
 *   + 5 rotas novas em PAGINAS_ESTATICAS:
 *     /blog/quanto-pesa-galao-de-agua-mineral/
 *     /blog/como-trocar-galao-de-agua-no-bebedouro/
 *     /blog/queimadura-por-gas-glp-primeiros-socorros/
 *     /blog/agua-alcalina-vs-agua-acida/
 *     /blog/quanto-pesa-botijao-de-gas-cheio/
 *   ~ 2 redirects glossário re-apontados para artigos dedicados (não mais para hubs):
 *     queimadura → /blog/queimadura-por-gas-glp-primeiros-socorros/ (era /blog/seguranca/)
 *     agua-alcalina → /blog/agua-alcalina-vs-agua-acida/ (era /agua-mineral/)
 * MUDANÇAS v3.1.2: noindex /whatsappgas/, title transacional /gas-de-cozinha-ou-gas-p45/, +redirects 301 água mineral
 * 
 * MUDANÇAS v3.0.2:
 * - Adicionadas 10 novas rotas de blog (total: 62 posts)
 * - Adicionado redirect /avaliar/ → Google Reviews
 * - Suporte a redirects externos (URLs absolutas com http/https)
 * 
 * MUDANÇAS v3.0.0:
 * - Removido proxy para WordPress (origin.moskogas.com.br)
 * - Todas as 181 páginas servidas direto pelo Cloudflare
 * - 404 customizado para URLs não mapeadas
 * - Mantidos todos os redirects 301 para SEO
 * - Mantidos 410 Gone para URLs WP de sistema
 */

const DOMINIO = 'moskogas.com.br';

// ══════════════════════════════════════════════════════════════════════════════
// 410 GONE — URLs WordPress de sistema (resposta instantânea, economiza crawl)
// ══════════════════════════════════════════════════════════════════════════════
const PREFIXOS_410_GONE = [
  '/wp-content/',
  '/wp-includes/',
  '/wp-admin/',
  '/wp-json/',
  '/.env',
  '/.git',
  '/.htaccess',
  '/readme.html',
  '/license.txt',
  '/wp-config',
  '/phpmyadmin',
  '/admin/',
  '/administrator/',
  '/backup/',
  '/cache/',
  '/cgi-bin/',
  // Glossário: top performers ficam mapeados em REDIRECTS_301 (executado antes).
  // Resto vira 410 Gone para limpar índice (era 301→home, causava soft 404)
  '/glossario/',
  '/glp/',
  '/glossary/',
  '/termos/',
  '/dicionario/',
  '/term/',
];

const ARQUIVOS_410_GONE = [
  '/xmlrpc.php',
  '/wp-login.php',
  '/wp-cron.php',
  '/wp-signup.php',
  '/wp-activate.php',
  '/wp-trackback.php',
  '/wp-comments-post.php',
  '/wp-mail.php',
  '/wp-links-opml.php',
  '/wp-blog-header.php',
  '/wp-load.php',
  '/wp-settings.php',
];

// ══════════════════════════════════════════════════════════════════════════════
// 301 PERMANENTES — páginas antigas → novas (preserva link juice)
// ══════════════════════════════════════════════════════════════════════════════
const REDIRECTS_301 = {
  // ── Links quebrados detectados no GSC ───────────────
  '/gas-no-giocondo-orsi/': '/gas-giocondo-orsi/',
  '/gas-no-giocondo-orsi': '/gas-giocondo-orsi/',
  '/gas-mata-do-jacinto/': '/gas-na-mata-do-jacinto/',
  '/gas-mata-do-jacinto': '/gas-na-mata-do-jacinto/',
  
  // ── Páginas quebradas com backlinks ──────────────
  '/disk-gas-campo-grande-ms/': '/disk-gas-em-campo-grande-ms/',
  '/disk-gas-campo-grande-ms': '/disk-gas-em-campo-grande-ms/',
  '/gas-industrial/': '/gas-industrial-campo-grande-ms/',
  '/gas-mais-proximo/': '/gas-mais-proximo-em-campo-grande-ms/',
  '/gas-de-cozinha-ou-gas-p45': '/gas-de-cozinha-ou-gas-p45/',
  '/gas-industrial': '/gas-industrial-campo-grande-ms/',
  '/gas-mais-proximo': '/gas-mais-proximo-em-campo-grande-ms/',
  
  // ── Glossário → páginas produto (consolidação de juice) ─
  '/glossario/o-que-e-botijao-de-gas-glp-p13/': '/gas-de-cozinha/',
  '/glossario/o-que-e-botijao-de-gas-glp-para-uso-domestico/': '/gas-de-cozinha/',
  '/glossario/o-que-e-cilindro-de-gas-glp-para-residencias/': '/gas-de-cozinha/',
  '/glossario/o-que-e-botijao-de-gas-glp-de-13kg/': '/gas-de-cozinha/',
  '/glossario/o-que-e-botijao-de-gas-glp-para-uso-residencial/': '/gas-de-cozinha/',
  '/glossario/o-que-e-gas-glp-de-uso-domestico/': '/gas-de-cozinha/',
  '/glossario/o-que-e-botijao-de-gas-glp-p5/': '/gas-de-cozinha-ou-gas-p45/',
  '/glossario/o-que-e-botijao-de-gas-glp-de-5kg/': '/gas-de-cozinha-ou-gas-p45/',
  '/glossario/o-que-e-botijao-de-gas-glp-p45/': '/gas-p45/',
  '/glossario/o-que-e-botijao-de-gas-glp-para-uso-alimenticio/': '/gas-industrial-campo-grande-ms/',
  '/glossario/o-que-e-botijao-de-gas-glp-para-uso-industrial/': '/gas-industrial-campo-grande-ms/',
  '/glossario/o-que-e-cilindro-de-gas-glp-para-industrias/': '/gas-industrial-campo-grande-ms/',
  '/glossario/o-que-e-cilindro-de-gas-glp-p45/': '/gas-industrial-campo-grande-ms/',
  '/glossario/o-que-e-botijao-de-gas-glp-de-45kg/': '/gas-p45/',
  '/glossario/o-que-e-garrafa-de-gas-glp/': '/glossario/o-que-e-botijao-de-gas-glp/',
  '/glossario/o-que-e-recipiente-de-armazenamento-do-gas-glp/': '/blog/como-armazenar-botijao-de-gas-com-seguranca/',
  '/glossario/o-que-e-gas-glp-em-vasilhame/': '/gas-de-cozinha/',
  '/glossario/o-que-e-limite-de-validade-do-gas-glp/': '/blog/botijao-de-gas-tem-validade/',
  '/glossario/o-que-e-procedimento-de-troca-do-gas-glp/': '/como-saber-se-o-gas-esta-acabando/',
  '/glossario/o-que-e-gas-glp-liquido/': '/glossario/o-que-e-botijao-de-gas-glp/',
  '/glossario/o-que-e-gas-glp-de-baixa-pressao/': '/gas-industrial-campo-grande-ms/',
  
  // ── URLs antigas ─
  '/agua-mineral-distribuidora-antigo/': '/agua-mineral-em-campo-grande-ms/',
  '/agua-mineral-distribuidora-antigo': '/agua-mineral-em-campo-grande-ms/',
  '/agua-mineral-campo-grande-ms-antigo/': '/agua-mineral-em-campo-grande-ms/',
  '/agua-mineral-campo-grande-ms-antigo': '/agua-mineral-em-campo-grande-ms/',
  // ── Consolidação canibalização água mineral (abr/2026) ─
  '/agua-mineral-distribuidora/': '/agua-mineral-em-campo-grande-ms/',
  '/agua-mineral-distribuidora': '/agua-mineral-em-campo-grande-ms/',
  '/agua-mineral-campo-grande-ms/': '/agua-mineral-em-campo-grande-ms/',
  '/agua-mineral-campo-grande-ms': '/agua-mineral-em-campo-grande-ms/',
  '/gas-p45-antigo/': '/gas-p45/',
  '/gas-p45-antigo': '/gas-p45/',
  '/gas-entrega-hoje-em-campo-grande-ms-antigo/': '/gas-entrega-hoje-em-campo-grande-ms/',
  '/gas-entrega-hoje-em-campo-grande-ms-antigo': '/gas-entrega-hoje-em-campo-grande-ms/',
  
  // ── Links encurtados ───────────────────────────────
  '/avaliar/': 'https://g.page/r/CYaoce2pbc5CEBM/review',
  '/avaliar': 'https://g.page/r/CYaoce2pbc5CEBM/review',
  
  // ════════════════════════════════════════════════════════════════════════════
  // GLOSSÁRIO TOP PERFORMERS (Onda 1 — abr/2026)
  // Substitui o catch-all /glossario/* → home (que causava soft 404).
  // Cada URL aponta para a página comercial mais relevante ao intent.
  // ════════════════════════════════════════════════════════════════════════════
  // ── Água mineral / qualidade da água ─
  '/glossario/acidez-e-alcalinidade-em-diferentes-tipos-de-agua/': '/agua-mineral-em-campo-grande-ms/',
  '/glossario/agua-alcalina-vs-agua-acida-entendendo-as-diferencas/': '/blog/agua-alcalina-vs-agua-acida/',
  '/glossario/o-que-e-analise-de-metais-pesados-na-agua-mineral/': '/agua-mineral-em-campo-grande-ms/',
  '/glossario/o-que-e-analise-de-sodio-na-agua-mineral/': '/agua-mineral-em-campo-grande-ms/',
  '/glossario/o-que-e-comercializacao-de-agua-mineral/': '/agua-mineral-em-campo-grande-ms/',
  '/glossario/o-que-e-controle-de-algas-na-agua-mineral/': '/agua-mineral-em-campo-grande-ms/',
  '/glossario/o-que-e-controle-de-antimonio-na-agua-mineral/': '/agua-mineral-em-campo-grande-ms/',
  '/glossario/o-que-e-controle-de-arsenio-na-agua-mineral/': '/agua-mineral-em-campo-grande-ms/',
  '/glossario/o-que-e-controle-de-bario-na-agua-mineral/': '/agua-mineral-em-campo-grande-ms/',
  '/glossario/o-que-e-controle-de-cloretos-na-agua-mineral/': '/agua-mineral-em-campo-grande-ms/',
  '/glossario/o-que-e-controle-de-estroncio-na-agua-mineral/': '/agua-mineral-em-campo-grande-ms/',
  '/glossario/o-que-e-controle-de-niquel-na-agua-mineral/': '/agua-mineral-em-campo-grande-ms/',
  '/glossario/o-que-e-controle-de-sulfatos-na-agua-mineral/': '/agua-mineral-em-campo-grande-ms/',
  '/glossario/o-que-e-controle-de-zinco-na-agua-mineral/': '/agua-mineral-em-campo-grande-ms/',
  '/glossario/o-que-e-distribuidora-de-agua-mineral-para-condominios/': '/agua-mineral-em-campo-grande-ms/',
  '/glossario/o-que-e-eliminacao-de-cloro-na-agua-mineral/': '/agua-mineral-em-campo-grande-ms/',
  '/glossario/o-que-e-eliminacao-de-sabor-na-agua-mineral/': '/agua-mineral-em-campo-grande-ms/',
  '/glossario/o-que-e-eliminacao-de-sais-minerais-na-agua-mineral/': '/agua-mineral-em-campo-grande-ms/',
  '/glossario/o-que-e-esterilizacao-da-agua-mineral/': '/agua-mineral-em-campo-grande-ms/',
  '/glossario/o-que-e-fosfato-na-agua-mineral/': '/agua-mineral-em-campo-grande-ms/',
  '/glossario/o-que-e-hidrogenio-na-agua-mineral/': '/agua-mineral-em-campo-grande-ms/',
  '/glossario/o-que-e-hidrogenio-sulfito-na-agua-mineral/': '/agua-mineral-em-campo-grande-ms/',
  '/glossario/o-que-e-hidroxido-de-sodio-na-agua-mineral/': '/agua-mineral-em-campo-grande-ms/',
  '/glossario/o-que-e-indice-de-acidez-na-agua-mineral/': '/agua-mineral-em-campo-grande-ms/',
  '/glossario/o-que-e-inibidor-de-gelo-na-agua-mineral/': '/agua-mineral-em-campo-grande-ms/',
  '/glossario/o-que-e-injecao-de-minerais-na-agua-mineral/': '/agua-mineral-em-campo-grande-ms/',
  '/glossario/o-que-e-inspecao-visual-da-agua-mineral/': '/agua-mineral-em-campo-grande-ms/',
  '/glossario/o-que-e-liberacao-para-venda-da-agua-mineral/': '/agua-mineral-em-campo-grande-ms/',
  '/glossario/o-que-e-linha-de-producao-da-agua-mineral/': '/agua-mineral-em-campo-grande-ms/',
  '/glossario/o-que-e-lista-de-documentacao-da-agua-mineral/': '/agua-mineral-em-campo-grande-ms/',
  '/glossario/o-que-e-logistica-de-entrega-da-agua-mineral/': '/agua-mineral-em-campo-grande-ms/',
  '/glossario/o-que-e-lote-de-agua-mineral/': '/agua-mineral-em-campo-grande-ms/',
  '/glossario/o-que-e-marcacao-de-validade-da-agua-mineral/': '/agua-mineral-em-campo-grande-ms/',
  '/glossario/o-que-e-material-de-embalagem-da-agua-mineral/': '/agua-mineral-em-campo-grande-ms/',
  '/glossario/o-que-e-medicao-de-temperatura-da-agua-mineral/': '/agua-mineral-em-campo-grande-ms/',
  '/glossario/o-que-e-nota-fiscal-de-comercializacao-da-agua-mineral/': '/agua-mineral-em-campo-grande-ms/',
  '/glossario/o-que-e-numero-de-serie-da-agua-mineral/': '/agua-mineral-em-campo-grande-ms/',
  '/glossario/o-que-e-peso-do-garrafao-de-agua-mineral/': '/agua-mineral-em-campo-grande-ms/',
  '/glossario/tipos-de-fontes-de-agua-mineral-e-suas-caracteristicas/': '/agua-mineral-em-campo-grande-ms/',
  '/glossario/tratamentos-especiais-para-aguas-minerais/': '/agua-mineral-em-campo-grande-ms/',
  // ── GLP industrial / equipamentos / comercial ─
  '/glossario/o-que-e-botijao-de-gas-glp-para-uso-hospitalar/': '/gas-industrial-campo-grande-ms/',
  '/glossario/o-que-e-cilindro-de-gas-glp-para-laboratorios/': '/gas-industrial-campo-grande-ms/',
  '/glossario/o-que-e-garrafa-de-gas-glp-para-corte/': '/gas-industrial-campo-grande-ms/',
  '/glossario/o-que-e-garrafa-de-gas-glp-para-food-truck/': '/gas-industrial-campo-grande-ms/',
  '/glossario/o-que-e-garrafa-de-gas-glp-para-gerador-eletrico/': '/gas-industrial-campo-grande-ms/',
  '/glossario/o-que-e-gas-glp-de-alta-pressao/': '/gas-industrial-campo-grande-ms/',
  '/glossario/o-que-e-gas-glp-em-tanque-estacionario/': '/gas-industrial-campo-grande-ms/',
  '/glossario/o-que-e-gas-glp-para-autoclave/': '/gas-industrial-campo-grande-ms/',
  '/glossario/o-que-e-gas-glp-para-caldeira/': '/gas-industrial-campo-grande-ms/',
  '/glossario/o-que-e-gas-glp-para-equipamentos-de-soldagem/': '/gas-industrial-campo-grande-ms/',
  '/glossario/o-que-e-gas-glp-para-maquinas-agricolas/': '/gas-industrial-campo-grande-ms/',
  '/glossario/o-que-e-quimica-de-combustao-do-gas-glp/': '/gas-industrial-campo-grande-ms/',
  // ── Segurança / queimadura / emergência ─
  '/glossario/o-que-e-dispositivo-de-alivio-de-pressao-no-gas-glp/': '/blog/seguranca-gas-cozinha-7-dicas-essenciais/',
  '/glossario/o-que-e-dispositivo-de-seguranca-no-gas-glp/': '/blog/seguranca-gas-cozinha-7-dicas-essenciais/',
  '/glossario/o-que-e-equipamento-de-protecao-para-gas-glp/': '/blog/seguranca-gas-cozinha-7-dicas-essenciais/',
  '/glossario/o-que-e-inspecao-de-cilindros-de-gas-glp/': '/blog/seguranca-gas-cozinha-7-dicas-essenciais/',
  '/glossario/o-que-e-inspecao-de-instalacoes-do-gas-glp/': '/blog/seguranca-gas-cozinha-7-dicas-essenciais/',
  '/glossario/o-que-e-kit-de-avaliacao-de-qualidade-do-gas-glp/': '/blog/seguranca-gas-cozinha-7-dicas-essenciais/',
  '/glossario/o-que-e-kit-de-emergencia-do-gas-glp/': '/blog/seguranca-gas-cozinha-7-dicas-essenciais/',
  '/glossario/o-que-e-mapeamento-de-riscos-do-gas-glp/': '/blog/seguranca-gas-cozinha-7-dicas-essenciais/',
  '/glossario/o-que-e-mascara-de-protecao-do-gas-glp/': '/blog/seguranca-gas-cozinha-7-dicas-essenciais/',
  '/glossario/o-que-e-plano-de-emergencia-do-gas-glp/': '/blog/seguranca-gas-cozinha-7-dicas-essenciais/',
  '/glossario/o-que-e-procedimento-de-seguranca-do-gas-glp/': '/blog/seguranca-gas-cozinha-7-dicas-essenciais/',
  '/glossario/o-que-e-queimadura-por-gas-glp/': '/blog/queimadura-por-gas-glp-primeiros-socorros/',
  '/glossario/o-que-e-treinamento-de-seguranca-no-uso-do-gas-glp/': '/blog/seguranca-gas-cozinha-7-dicas-essenciais/',
  '/glossario/o-que-e-valvula-de-seguranca-do-gas-glp/': '/blog/seguranca-gas-cozinha-7-dicas-essenciais/',
  // ── Armazenamento de cilindros ─
  '/glossario/o-que-e-armazenamento-em-esferas-para-gas-glp/': '/blog/como-armazenar-botijao-de-gas-com-seguranca/',
  '/glossario/o-que-e-deposito-de-gas-glp/': '/blog/como-armazenar-botijao-de-gas-com-seguranca/',
  '/glossario/o-que-e-janela-de-condicoes-de-armazenamento-do-gas-glp/': '/blog/como-armazenar-botijao-de-gas-com-seguranca/',
  '/glossario/o-que-e-jaula-de-gas-glp/': '/blog/como-armazenar-botijao-de-gas-com-seguranca/',
  // ── Validade / peso / dura ─
  '/glossario/o-que-e-balanca-para-verificacao-de-peso-do-gas-glp/': '/blog/botijao-de-gas-tem-validade/',
  '/glossario/o-que-e-peso-do-cilindro-de-gas-glp/': '/blog/botijao-de-gas-tem-validade/',
  // ── Duração ─
  '/glossario/o-que-e-quantidade-de-gas-glp/': '/blog/quanto-dura-botijao-p13/',
  // ── Descarte / sustentabilidade ─
  '/glossario/o-que-e-descarte-de-cilindros-de-gas-glp/': '/blog/botijao-de-gas-vazio-quanto-vale-o-casco/',
  '/glossario/o-que-e-descarte-responsavel-de-cilindros-de-gas-glp/': '/blog/botijao-de-gas-vazio-quanto-vale-o-casco/',
  '/glossario/o-que-e-logistica-reversa-do-gas-glp/': '/blog/botijao-de-gas-vazio-quanto-vale-o-casco/',
  '/glossario/o-que-e-normas-de-descarte-do-gas-glp/': '/blog/botijao-de-gas-vazio-quanto-vale-o-casco/',
  '/glossario/o-que-e-normas-de-metodo-de-descarte-do-gas-glp/': '/blog/botijao-de-gas-vazio-quanto-vale-o-casco/',
  '/glossario/o-que-e-sustentabilidade-no-uso-do-gas-glp/': '/blog/botijao-de-gas-vazio-quanto-vale-o-casco/',
  // ── Vazamento ─
  '/glossario/o-que-e-aditivo-para-odorizacao-do-gas-glp/': '/blog/como-identificar-vazamento-de-gas/',
  // ── Lacre / autenticidade ─
  '/glossario/o-que-e-lacre-de-seguranca-do-gas-glp/': '/blog/como-identificar-botijao-ultragaz-original/',
  // ── P13 doméstico ─
  '/glossario/o-que-e-cilindro-de-gas-glp-em-p13/': '/gas-de-cozinha/',
  // ── P5 / P20 / outros tamanhos ─
  '/glossario/o-que-e-cilindro-de-gas-glp-p5/': '/gas-de-cozinha-ou-gas-p45/',
  // ── Distribuição / logística / transporte / técnica ─
  '/glossario/kpis-importantes-na-distribuicao-de-gas-e-agua/': '/sobre-a-mosko-gas/',
  '/glossario/metodos-de-extracao-de-gas-uma-visao-tecnica/': '/sobre-a-mosko-gas/',
  '/glossario/o-que-e-aditivo-para-estabilizacao-do-gas-glp/': '/sobre-a-mosko-gas/',
  '/glossario/o-que-e-atestado-de-conformidade-para-gas-glp/': '/sobre-a-mosko-gas/',
  '/glossario/o-que-e-autorizacao-para-transporte-de-gas-glp/': '/sobre-a-mosko-gas/',
  '/glossario/o-que-e-conexoes-para-gas-glp/': '/sobre-a-mosko-gas/',
  '/glossario/o-que-e-despressurizacao-do-gas-glp/': '/sobre-a-mosko-gas/',
  '/glossario/o-que-e-documentacao-para-distribuicao-de-gas-glp/': '/sobre-a-mosko-gas/',
  '/glossario/o-que-e-dutos-de-distribuicao-de-gas-glp/': '/sobre-a-mosko-gas/',
  '/glossario/o-que-e-envasamento-de-gas-glp/': '/sobre-a-mosko-gas/',
  '/glossario/o-que-e-estacao-de-carregamento-de-gas-glp/': '/sobre-a-mosko-gas/',
  '/glossario/o-que-e-estacao-de-carregamento-e-descarregamento-de-gas-glp/': '/sobre-a-mosko-gas/',
  '/glossario/o-que-e-estacao-de-compressao-de-gas-glp/': '/sobre-a-mosko-gas/',
  '/glossario/o-que-e-estacao-de-distribuicao-de-gas-glp/': '/sobre-a-mosko-gas/',
  '/glossario/o-que-e-estacao-de-envase-de-gas-glp/': '/sobre-a-mosko-gas/',
  '/glossario/o-que-e-filtragem-de-gas-glp/': '/sobre-a-mosko-gas/',
  '/glossario/o-que-e-inflamabilidade-do-gas-glp/': '/sobre-a-mosko-gas/',
  '/glossario/o-que-e-jornada-de-trabalho-na-distribuidora-de-gas-glp/': '/sobre-a-mosko-gas/',
  '/glossario/o-que-e-limpeza-de-tanques-do-gas-glp/': '/sobre-a-mosko-gas/',
  '/glossario/o-que-e-lista-de-documentacao-do-gas-glp/': '/sobre-a-mosko-gas/',
  '/glossario/o-que-e-logistica-de-distribuicao-do-gas-glp/': '/sobre-a-mosko-gas/',
  '/glossario/o-que-e-logistica-de-transporte-do-gas-glp/': '/sobre-a-mosko-gas/',
  '/glossario/o-que-e-nota-fiscal-de-distribuicao-do-gas-glp/': '/sobre-a-mosko-gas/',
  '/glossario/o-que-e-numero-de-identificacao-do-gas-glp/': '/sobre-a-mosko-gas/',
  '/glossario/o-que-e-ponto-de-enchimento-do-gas-glp/': '/sobre-a-mosko-gas/',
  '/glossario/o-que-e-ponto-de-entrega-do-gas-glp/': '/sobre-a-mosko-gas/',
  '/glossario/o-que-e-rastreabilidade-do-gas-glp/': '/sobre-a-mosko-gas/',
  '/glossario/o-que-e-sistema-de-distribuicao-do-gas-glp/': '/sobre-a-mosko-gas/',
  '/glossario/o-que-e-sistema-de-transporte-do-gas-glp/': '/sobre-a-mosko-gas/',
  '/glossario/o-que-e-veiculo-de-transporte-do-gas-glp/': '/sobre-a-mosko-gas/',
  '/glossario/o-que-e-xenonio-xe-implementacao-em-metodos-de-armazenamento-do-gas-glp/': '/sobre-a-mosko-gas/',
};

// Posts antigos com emoji no slug
const REDIRECTS_EMOJI = {
  '/%f0%9f%94%a5-gas-de-cozinha-no-jardim-veraneio-em-campo-grande-ms-rapido-barato-e-perto-de-voce/': '/gas-jardim-veraneio/',
  '/%f0%9f%94%a5-gas-de-cozinha-nos-novos-estados-em-campo-grande-ms-rapido-barato-e-perto-de-voce/': '/gas-novos-estados/',
  '/%f0%9f%94%a5-gas-de-cozinha-no-estrela-dalva-em-campo-grande-ms-rapido-barato-e-perto-de-voce/': '/gas-estrela-dalva/',
  '/%f0%9f%94%a5-gas-de-cozinha-no-mata-do-jacinto-em-campo-grande-ms-rapido-barato-e-perto-de-voce/': '/gas-na-mata-do-jacinto/',
  '/%f0%9f%94%a5-entrega-de-gas-no-coronel-antonino-em-campo-grande-ms-rapido-barato-e-perto-de-voce/': '/gas-coronel-antonino/',
  '/%f0%9f%94%a5-gas-de-cozinha-no-danubio-azul-em-campo-grande-ms-rapido-barato-e-perto-de-voce/': '/gas-danubio-azul/',
};

// Prefixos que redirecionam 301 para home (URLs WordPress de sistema)
const PREFIXOS_REDIRECIONAR_HOME = [
  '/author/',
  '/tag/',
  '/category/',
  '/page/',
  '/comments/',
  '/trackback/',
  '/feed/',
  '/.well-known/',
  '/attachment/',
  '/embed/',
];

// ══════════════════════════════════════════════════════════════════════════════
// PÁGINAS ESTÁTICAS — todas as 181 páginas HTML do site
// ══════════════════════════════════════════════════════════════════════════════
const PAGINAS_ESTATICAS = [
  '/',
  '/agua-mineral-em-campo-grande-ms/',
  '/bairros/',
  '/blog/',
  '/blog/5-receitas-para-voce-economizar-gas-de-cozinha/',
  '/blog/agua-mineral-com-gas-por-que-servir-no-seu-restaurante/',
  '/blog/agua-mineral-de-onde-vem-a-agua-que-bebemos/',
  '/blog/agua-mineral-qual-a-melhor-forma-de-servir-no-meu-estabelecimento/',
  '/blog/bebedouro-de-agua-mineral-para-empresa/',
  '/blog/beneficio-gas-do-povo-como-funciona/',
  '/blog/botijao-de-gas-tem-validade/',
  '/blog/botijao-de-gas-vazio-quanto-vale-o-casco/',
  '/blog/botijao-vazio-como-pedir-entrega-campo-grande/',
  '/blog/como-armazenar-botijao-de-gas-com-seguranca/',
  '/blog/como-calcular-consumo-gas-restaurante/',
  '/blog/como-funciona-entrega-de-gas-em-campo-grande/',
  '/blog/como-identificar-botijao-ultragaz-original/',
  '/blog/como-identificar-vazamento-de-gas/',
  '/blog/como-saber-se-o-gas-esta-acabando/',
  '/blog/como-saber-se-revenda-de-gas-e-autorizada/',
  '/blog/como-utilizar-o-gas-de-cozinha-de-maneira-correta-em-seu-comercio/',
  '/blog/disk-gas-bairros-campo-grande/',
  '/blog/galao-de-agua-retornavel-ou-descartavel/',
  '/blog/gas-comercial-p13-p20-ou-p45/',
  '/blog/gas-de-cozinha-ou-gas-p45/',
  '/blog/gas-de-cozinha-preco-p13-campo-grande/',
  '/blog/gas-entrega-urgente-campo-grande/',
  '/blog/gas-glp-para-aquecedor-qual-botijao-usar/',
  '/blog/gas-liquefeito-de-petroleo-glp-a-vantagem-competitiva-para-hoteis-e-pousadas/',
  '/blog/gas-p20-empilhadeira-campo-grande/',
  '/blog/gas-p20-tudo-o-que-voce-precisa-saber-sobre-o-gas-para-empilhadeira/',
  '/blog/gas-p45-saiba-como-armazenar-cilindro-de-gas/',
  '/blog/gas-para-condominio-central-glp/',
  '/blog/gas-para-pizzaria-campo-grande/',
  '/blog/gas-para-restaurante-p45-ou-p20/',
  '/blog/gas-para-sauna-qual-botijao/',
  '/blog/gas-sem-nota-fiscal-riscos/',
  '/blog/mosko-gas-vs-supermercado/',
  '/blog/nao-e-so-no-fogao-conheca-3-utilidades-do-gas-de-cozinha/',
  '/blog/nem-diesel-nem-gasolina-conheca-as-vantagens-do-gas-para-empilhadeira/',
  '/blog/o-consumo-de-agua-mineral-e-a-importancia-de-escolher-agua-mineral-de-qualidade-e-segura-para-consumo/',
  '/blog/o-que-e-botijao-p45/',
  '/blog/o-que-e-o-gas-de-cozinha-ou-glp/',
  '/blog/onde-instalar-o-gas-de-cozinha/',
  '/blog/p13-p20-p45-qual-botijao-de-gas-escolher/',
  '/blog/p13-p20-p45-qual-botijao-escolher/',
  '/blog/ph-da-agua-mineral-o-que-significa/',
  '/blog/por-que-voce-deve-beber-agua-mineral-e-quais-sao-seus-beneficios/',
  '/blog/preco-botijao-de-gas-campo-grande-ms/',
  '/blog/quando-trocar-mangueira-regulador-gas/',
  '/blog/quanto-custa-botijao-de-gas-completo/',
  '/blog/quanto-dura-botijao-p13/',
  '/blog/quanto-pesa-galao-de-agua-mineral/',
  '/blog/como-trocar-galao-de-agua-no-bebedouro/',
  '/blog/queimadura-por-gas-glp-primeiros-socorros/',
  '/blog/agua-alcalina-vs-agua-acida/',
  '/blog/quanto-pesa-botijao-de-gas-cheio/',
  '/blog/regulamentacao-anp-revenda-gas/',
  '/blog/revenda-autorizada-gas-campo-grande/',
  '/blog/vantagens-de-utilizar-o-gas-glp/',
  '/blog/p13-p20-ou-p45-como-escolher-botijao-certo/',
  '/blog/guia-gas-para-restaurantes-campo-grande/',
  '/blog/seguranca-gas-cozinha-7-dicas-essenciais/',
  '/blog/entrega-gas-caranda-bosque-mata-jacinto/',
  '/blog/por-que-preco-gas-varia/',
  '/blog/gas-para-churrasco-p13-ou-p45/',
  '/blog/agua-mineral-para-empresas-beneficios/',
  '/blog/gas-perto-de-mim-como-encontrar/',
  '/blog/entrega-gas-mesmo-dia-como-funciona/',
  '/blog/economia-gas-cozinha-8-dicas/',
  '/blog/armazenamento-cilindros-p20/',
  '/botijao-de-gas/',
  '/como-saber-se-o-gas-esta-acabando/',
  '/contato/',
  '/disk-gas-em-campo-grande-ms/',
  '/distribuidora-de-gas-campo-grande/',
  '/entrega-de-gas-campo-grande-ms/',
  '/gas-aberto-agora-campo-grande/',
  '/gas-aero-rancho/',
  '/gas-aeroporto/',
  '/gas-alves-pereira/',
  '/gas-amambai/',
  '/gas-america/',
  '/gas-autonomista/',
  '/gas-bandeirantes/',
  '/gas-batistao/',
  '/gas-bela-vista/',
  '/gas-cabreuva/',
  '/gas-caicara/',
  '/gas-carada/',
  '/gas-caranda-bosque/',
  '/gas-carlota/',
  '/gas-carvalho/',
  '/gas-centenario/',
  '/gas-centro-oeste/',
  '/gas-centro/',
  '/gas-chacara-cachoeira/',
  '/gas-chacara-das-mansoes/',
  '/gas-columbia/',
  '/gas-conjunto-aero-rancho/',
  '/gas-conjunto-estrela-do-sul/',
  '/gas-conjunto-jose-abrao/',
  '/gas-conjunto-mata-jacinto/',
  '/gas-coophafe/',
  '/gas-coophasul/',
  '/gas-coophatrabalho/',
  '/gas-coophavila-ii/',
  '/gas-coronel-antonino/',
  '/gas-cruzeiro/',
  '/gas-de-cozinha-ou-gas-p45/',
  '/gas-de-cozinha/',
  '/gas-de-empilhadeiras-p20/',
  '/gas-do-povo-em-campo-grande-ms/',
  '/gas-doutor-albuquerque/',
  '/gas-em-campo-grande-ms/',
  '/gas-entrega-hoje-em-campo-grande-ms/',
  '/gas-estrela-dalva/',
  '/gas-giocondo-orsi/',
  '/gas-gloria/',
  '/gas-guanandi-ii/',
  '/gas-guanandi/',
  '/gas-industrial-campo-grande-ms/',
  '/gas-industrial-empresas/',
  '/gas-itanhanga-park/',
  '/gas-itanhanga/',
  '/gas-jacy/',
  '/gas-jardim-aero-rancho/',
  '/gas-jardim-aeroporto/',
  '/gas-jardim-america/',
  '/gas-jardim-bela-vista/',
  '/gas-jardim-campo-alto/',
  '/gas-jardim-centenario/',
  '/gas-jardim-columbia/',
  '/gas-jardim-dos-estados/',
  '/gas-jardim-ima/',
  '/gas-jardim-itamaraca/',
  '/gas-jardim-jacy/',
  '/gas-jardim-joquei-club/',
  '/gas-jardim-leblon/',
  '/gas-jardim-monte-libano/',
  '/gas-jardim-monumento/',
  '/gas-jardim-morena/',
  '/gas-jardim-nhanha/',
  '/gas-jardim-noroeste/',
  '/gas-jardim-parati/',
  '/gas-jardim-paulista/',
  '/gas-jardim-presidente/',
  '/gas-jardim-santa-emilia/',
  '/gas-jardim-sao-bento/',
  '/gas-jardim-sao-conrado/',
  '/gas-jardim-sao-lourenco/',
  '/gas-jardim-taruma/',
  '/gas-jardim-tijuca/',
  '/gas-jardim-veraneio/',
  '/gas-jardim-ze-pereira/',
  '/gas-joquei-club/',
  '/gas-lageado/',
  '/gas-lar-trabalhador/',
  '/gas-los-angeles/',
  '/gas-mais-proximo-em-campo-grande-ms/',
  '/gas-maria-aparecida/',
  '/gas-monte-castelo/',
  '/gas-na-mata-do-jacinto/',
  '/gas-no-alphaville/',
  '/gas-no-damha/',
  '/gas-no-futurista/',
  '/gas-nova-lima/',
  '/gas-novos-estados/',
  '/gas-p45/',
  '/gas-para-bares/',
  '/gas-para-clinicas/',
  '/gas-para-condominios/',
  '/gas-para-construcao-civil/',
  '/gas-para-escolas/',
  '/gas-para-hoteis/',
  '/gas-para-lavanderias/',
  '/gas-para-padarias/',
  '/gas-para-restaurantes/',
  '/gas-para-saloes-de-festas/',
  '/gas-perto-de-mim-campo-grande/',
  '/gas-santa-fe/',
  '/gas-sao-francisco/',
  '/gas-universitario/',
  '/gas-vila-margarida/',
  '/gas-vila-nascente/',
  '/gas-vila-rica/',
  '/gas-vivendas-do-bosque/',
  '/glossario/o-que-e-botijao-de-gas-glp/',
  '/loja/',
  '/politica-de-cookies/',
  '/politica-de-privacidade/',
  '/politica-de-troca/',
  '/preco-gas-campo-grande-ms/',
  '/sobre-a-mosko-gas/',
  '/termos-de-uso-mosko-gas/',
  '/vendas-corporativas/',
  '/whatsappgas/',
];

// Extensões de arquivos estáticos
const EXTENSOES_ESTATICAS = /\.(webp|jpg|jpeg|png|gif|svg|ico|woff|woff2|ttf|pdf|txt|xml|json|css|js)$/i;

// ══════════════════════════════════════════════════════════════════════════════
// HANDLER PRINCIPAL
// ══════════════════════════════════════════════════════════════════════════════
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    const pathLower = pathname.toLowerCase();

    // ── 1. Proxy API → backend Mosko App (resolve CORS) ─────────────────────
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

    // ── 2. Redirects 301 ────────────────────────────────────────────────────
    // PRIMEIRO checamos redirects exatos (top performers do glossário, URLs
    // antigas com mapeamento específico) ANTES do catch-all 410 Gone.
    if (REDIRECTS_301[pathname]) {
      const destino = REDIRECTS_301[pathname];
      const url = destino.startsWith('http') ? destino : 'https://' + DOMINIO + destino;
      return Response.redirect(url, 301);
    }

    // ── 3. 410 GONE — URLs WordPress de sistema + catch-all glossário ───────
    // Exceção: páginas estáticas reais (hub /glossario/o-que-e-botijao-de-gas-glp/)
    // têm prioridade sobre o catch-all 410 — checamos PAGINAS_ESTATICAS primeiro.
    let pathnameNorm410 = pathname;
    if (!pathnameNorm410.endsWith('/') && !pathnameNorm410.includes('.')) {
      pathnameNorm410 = pathnameNorm410 + '/';
    }
    if (!PAGINAS_ESTATICAS.includes(pathnameNorm410)) {
      for (const prefix of PREFIXOS_410_GONE) {
        if (pathLower.startsWith(prefix)) {
          return new Response('Gone', { 
            status: 410, 
            headers: { 'Cache-Control': 'public, max-age=86400', 'X-Robots-Tag': 'noindex' } 
          });
        }
      }
    }
    for (const arquivo of ARQUIVOS_410_GONE) {
      if (pathLower === arquivo || pathLower.startsWith(arquivo + '?')) {
        return new Response('Gone', { 
          status: 410, 
          headers: { 'Cache-Control': 'public, max-age=86400', 'X-Robots-Tag': 'noindex' } 
        });
      }
    }

    // ── 4. Redirects extras (emoji, queries WP) ─────────────────────────────
    // Redirects com emoji
    const redirEmoji = REDIRECTS_EMOJI[pathLower];
    if (redirEmoji) {
      return Response.redirect('https://' + DOMINIO + redirEmoji, 301);
    }

    // Query params WordPress antigos → 301 para home
    if (url.searchParams.has('p') || url.searchParams.has('page_id') || url.searchParams.has('attachment_id')) {
      return Response.redirect('https://' + DOMINIO + '/', 301);
    }
    if (url.search.includes('?author=') || url.search.includes('&author=')) {
      return Response.redirect('https://' + DOMINIO + '/', 301);
    }

    // Prefixos antigos → 301 para home
    if (PREFIXOS_REDIRECIONAR_HOME.some(p => pathLower.startsWith(p))) {
      return Response.redirect('https://' + DOMINIO + '/', 301);
    }

    // ── 4. Arquivos estáticos (imagens, fontes, XML, etc) ───────────────────
    if (EXTENSOES_ESTATICAS.test(pathname)) {
      const asset = await env.ASSETS.fetch(request);
      if (asset.status !== 404) {
        // Cache especial para sitemap e robots
        if (pathname === '/sitemap.xml' || pathname === '/robots.txt' || pathname === '/products.xml') {
          const h = new Headers(asset.headers);
          h.set('Cache-Control', 'public, max-age=3600');
          h.set('Content-Type', pathname.endsWith('.xml') ? 'application/xml; charset=utf-8' : 'text/plain');
          return new Response(asset.body, { status: asset.status, headers: h });
        }
        return asset;
      }
    }

    // ── 5. Páginas HTML estáticas ───────────────────────────────────────────
    let pathnameNorm = pathname;
    if (!pathnameNorm.endsWith('/') && !pathnameNorm.includes('.')) {
      pathnameNorm = pathnameNorm + '/';
    }

    if (PAGINAS_ESTATICAS.includes(pathnameNorm)) {
      const asset = await env.ASSETS.fetch(request);
      if (asset.status !== 404) return asset;
    }

    // ── 6. 404 — Página não encontrada ──────────────────────────────────────
    return new Response(pagina404(), {
      status: 404,
      headers: { 
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=60'
      }
    });
  },
};

// ══════════════════════════════════════════════════════════════════════════════
// PÁGINA 404 CUSTOMIZADA
// ══════════════════════════════════════════════════════════════════════════════
function pagina404() {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Página não encontrada — Mosko Gás</title>
  <meta name="robots" content="noindex, follow">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Inter',sans-serif;background:linear-gradient(135deg,#001A4D 0%,#003087 100%);min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;color:#fff}
    .container{text-align:center;max-width:500px}
    .icon{font-size:80px;margin-bottom:20px;opacity:.9}
    h1{font-size:clamp(1.8rem,5vw,2.5rem);font-weight:800;margin-bottom:12px}
    p{font-size:16px;opacity:.85;margin-bottom:32px;line-height:1.6}
    .btns{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
    .btn{display:inline-flex;align-items:center;gap:8px;padding:14px 28px;border-radius:50px;font-weight:700;font-size:15px;text-decoration:none;transition:.2s}
    .btn-wpp{background:#25D366;color:#fff}
    .btn-wpp:hover{background:#1ebe5a;transform:translateY(-2px)}
    .btn-home{background:rgba(255,255,255,.15);color:#fff;border:2px solid rgba(255,255,255,.4)}
    .btn-home:hover{background:rgba(255,255,255,.25);border-color:#fff}
    .links{margin-top:48px;padding-top:32px;border-top:1px solid rgba(255,255,255,.15)}
    .links p{font-size:14px;margin-bottom:16px;opacity:.7}
    .links a{color:rgba(255,255,255,.8);font-size:13px;margin:0 8px;text-decoration:none}
    .links a:hover{color:#fff;text-decoration:underline}
  </style>
</head>
<body>
  <div class="container">
    <div class="icon">🔍</div>
    <h1>Página não encontrada</h1>
    <p>A página que você procura não existe ou foi movida. Mas não se preocupe — estamos aqui para ajudar!</p>
    <div class="btns">
      <a href="https://wa.me/+5567993330303?text=Ol%C3%A1%2C%20preciso%20de%20ajuda" class="btn btn-wpp">
        <svg width="20" height="20" fill="#fff" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.107.548 4.086 1.508 5.806L0 24l6.362-1.481A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>
        Falar no WhatsApp
      </a>
      <a href="/" class="btn btn-home">Voltar ao início</a>
    </div>
    <div class="links">
      <p>Páginas populares:</p>
      <a href="/gas-de-cozinha/">Gás P13</a>
      <a href="/gas-p45/">Gás P45</a>
      <a href="/gas-de-empilhadeiras-p20/">Gás P20</a>
      <a href="/agua-mineral-em-campo-grande-ms/">Água Mineral</a>
      <a href="/loja/">Loja</a>
    </div>
  </div>
</body>
</html>`;
}
