#!/usr/bin/env python3
"""
Gera automaticamente um novo post para o blog da Mosko Gás
usando a API do Claude, e o salva como HTML estático.
"""

import anthropic, json, os, re, datetime
from pathlib import Path

BASE = Path(__file__).parent.parent.parent  # raiz do repo
BLOG = BASE / 'blog'
TODAY = datetime.date.today().isoformat()

# ── Fila de temas — rotaciona em ordem, nunca repete slug existente ──────────
TEMAS = [
    ("Como trocar o botijão de gás com segurança", "gas-seguranca"),
    ("Vale a pena ter um botijão P13 reserva em casa?", "gas-p13-reserva"),
    ("Como calcular o consumo de gás do meu restaurante", "gas-restaurante-consumo"),
    ("Gás do Povo em Campo Grande: quem tem direito?", "gas-do-povo-campo-grande"),
    ("Diferença entre água mineral e água filtrada", "agua-mineral-vs-filtrada"),
    ("Como saber se o gás está vencido ou danificado", "gas-vencido-como-saber"),
    ("Gás GLP para churrasqueira: P13 ou P45?", "gas-churrasqueira"),
    ("Por que o gás de cozinha subiu de preço?", "gas-preco-variacao"),
    ("Mangueira de gás: quando trocar e como escolher", "mangueira-gas-cozinha"),
    ("Gás para padaria: quanto consome e qual botijão usar", "gas-para-padaria-consumo"),
    ("Água mineral gelada ou em temperatura ambiente: qual é melhor?", "agua-mineral-temperatura"),
    ("Como instalar central de GLP em condomínio", "central-glp-condominio"),
    ("GLP vs energia elétrica: qual é mais econômico na cozinha?", "glp-vs-eletrico-cozinha"),
    ("Regulador de pressão de gás: tipos e como escolher", "regulador-gas-tipos"),
    ("Gás para chuveiro a gás: vantagens e dicas", "chuveiro-gas-dicas"),
]

# Descobrir quais slugs já existem
slugs_existentes = {d.name for d in BLOG.iterdir() if d.is_dir()}

# Escolher próximo tema não publicado
tema, slug_base = None, None
for t, s in TEMAS:
    if s not in slugs_existentes:
        tema, slug_base = t, s
        break

if not tema:
    print("⚠️ Todos os temas já foram publicados. Adicione mais temas à lista.")
    exit(0)

print(f"📝 Gerando post: {tema} → /blog/{slug_base}/")

# ── Chamar a API do Claude ────────────────────────────────────────────────────
client = anthropic.Anthropic()

PROMPT = f"""Você é redator de conteúdo SEO para a Mosko Gás, revenda autorizada Ultragaz em Campo Grande/MS.

Escreva um post de blog em português brasileiro sobre o tema: "{tema}"

EMPRESA:
- Nome: Mosko Gás | CNPJ: 12.977.901/0001-17
- Endereço: Av. Panamericana, 295 – Estrela Dalva – Campo Grande/MS
- WhatsApp: (67) 99333-0303 | Horário: Seg–Sáb 7h às 18h30
- Revenda autorizada Ultragaz | +350 avaliações 5★ no Google
- Preços: P13 portaria R$103,99 | P13 entrega R$124,90

FORMATO DA RESPOSTA — JSON válido apenas, sem markdown:
{{
  "title": "título SEO ≤60 chars",
  "description": "meta description ≤155 chars com keyword + WhatsApp",
  "h1": "título H1 para a página",
  "cat": "categoria (Dicas|Segurança|Negócios|Industrial|Água Mineral|Gás e GLP)",
  "conteudo_html": "HTML do conteúdo — use <h2>, <h3>, <p>, <ul>, <li>, <strong>. Mín 400 palavras. Inclua links internos: /gas-de-cozinha/, /gas-p45/, /agua-mineral-em-campo-grande-ms/, /vendas-corporativas/, /sobre-a-mosko-gas/. Terminar com parágrafo CTA mencionando WhatsApp.",
  "posts_relacionados": [
    {{"slug": "slug-existente", "title": "título"}},
    {{"slug": "slug-existente", "title": "título"}},
    {{"slug": "slug-existente", "title": "título"}}
  ]
}}

Posts existentes para relacionados (escolha 3 relevantes):
o-que-e-o-gas-de-cozinha-ou-glp, como-saber-se-o-gas-esta-acabando, onde-instalar-o-gas-de-cozinha, 
5-receitas-para-voce-economizar-gas-de-cozinha, gas-de-cozinha-ou-gas-p45, vantagens-de-utilizar-o-gas-glp,
gas-p45-saiba-como-armazenar-cilindro-de-gas, gas-p20-tudo-o-que-voce-precisa-saber-sobre-o-gas-para-empilhadeira
"""

message = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=2000,
    messages=[{"role": "user", "content": PROMPT}]
)

raw = message.content[0].text.strip()
# Limpar possível markdown
raw = re.sub(r'^```json\s*', '', raw)
raw = re.sub(r'\s*```$', '', raw)

data = json.loads(raw)

# ── Gerar HTML do post ────────────────────────────────────────────────────────
links_rel = '\n      '.join([
    f'<li><a href="/blog/{p["slug"]}/">{p["title"]}</a></li>'
    for p in data['posts_relacionados']
])

html = f'''<!--
  blog/{slug_base}/index.html | Versão: 1.0.0 | Atualizado: {TODAY} | Descrição: {data["title"]}
-->
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{data["title"]} | Mosko Gás</title>
  <meta name="description" content="{data["description"]}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://moskogas.com.br/blog/{slug_base}/">
  <meta property="og:title" content="{data["title"]}">
  <meta property="og:url" content="https://moskogas.com.br/blog/{slug_base}/">
  <meta property="og:type" content="article">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    *,*::before,*::after{{box-sizing:border-box;margin:0;padding:0}}
    :root{{--azul:#003087;--azul-medio:#0055CC;--azul-claro:#E8F0FD;--verde-wpp:#25D366;--cinza-bg:#F4F6FA;--cinza-texto:#333;--cinza-sub:#666;--borda:#E0E7F3;--footer-bg:#001A4D}}
    body{{font-family:'Inter',sans-serif;color:var(--cinza-texto);line-height:1.7;overflow-x:hidden}}
    a{{text-decoration:none;color:inherit}}
    .container{{max-width:780px;margin:0 auto;padding:0 20px}}
    .topbar{{background:var(--azul);padding:8px 20px;display:flex;justify-content:center;gap:12px;flex-wrap:wrap}}
    .topbar a{{color:#fff;font-size:13px;font-weight:600;display:inline-flex;align-items:center;gap:7px;padding:6px 18px;border-radius:50px}}
    .topbar a.t-tel{{border:1.5px solid rgba(255,255,255,.4)}}
    .topbar a.t-wpp{{background:var(--verde-wpp)}}
    .topbar svg{{width:15px;height:15px;fill:currentColor}}
    header{{background:#fff;border-bottom:1.5px solid var(--borda);position:sticky;top:0;z-index:100}}
    nav{{max-width:1180px;margin:0 auto;padding:14px 20px;display:flex;align-items:center;justify-content:space-between;gap:20px}}
    .logo img{{height:50px;width:auto}}
    .nav-links{{display:flex;list-style:none;gap:2px}}
    .nav-links a{{color:var(--cinza-texto);font-size:14px;font-weight:500;padding:7px 14px;border-radius:50px;white-space:nowrap}}
    .nav-links a:hover,.nav-links a.active{{background:var(--azul-claro);color:var(--azul-medio)}}
    .nav-links .n-wpp{{background:var(--verde-wpp);color:#fff;font-weight:700;padding:8px 18px;margin-left:6px}}
    .hamburger{{display:none;flex-direction:column;gap:5px;cursor:pointer;background:none;border:none;padding:4px}}
    .hamburger span{{display:block;width:26px;height:3px;background:var(--azul);border-radius:3px}}
    .mobile-menu{{display:none;background:#fff;border-top:1px solid var(--borda);padding:12px 20px 18px}}
    .mobile-menu.open{{display:block}}
    .mobile-menu a{{display:block;padding:10px 0;color:var(--azul);font-weight:600;border-bottom:1px solid #f0f0f0;font-size:15px}}
    .post-hero{{background:linear-gradient(130deg,#001A4D 0%,#003087 100%);padding:50px 20px 40px}}
    .post-hero .container{{text-align:center}}
    .post-cat{{display:inline-block;background:rgba(255,255,255,.15);color:#fff;font-size:12px;font-weight:700;padding:4px 14px;border-radius:50px;margin-bottom:16px;text-transform:uppercase;letter-spacing:.08em}}
    .post-hero h1{{font-size:clamp(1.4rem,3vw,2rem);font-weight:800;color:#fff;line-height:1.2;margin-bottom:12px}}
    .post-meta{{color:rgba(255,255,255,.65);font-size:13px}}
    .post-body{{padding:48px 20px 60px;background:#fff}}
    .post-body h2{{font-size:1.25rem;font-weight:800;color:var(--azul);margin:32px 0 12px}}
    .post-body h3{{font-size:1.05rem;font-weight:700;color:var(--azul-medio);margin:24px 0 8px}}
    .post-body p{{margin-bottom:16px;font-size:16px}}
    .post-body ul,.post-body ol{{margin:0 0 16px 24px}}
    .post-body li{{margin-bottom:8px;font-size:15px}}
    .post-body strong{{color:var(--azul);font-weight:700}}
    .post-body a{{color:var(--azul-medio);text-decoration:underline;font-weight:600}}
    .post-body hr{{border:none;border-top:1px solid var(--borda);margin:32px 0}}
    .cta-box{{background:linear-gradient(130deg,#001A4D,#003087);border-radius:16px;padding:32px 28px;text-align:center;margin:40px 0}}
    .cta-box h3{{color:#fff;font-size:1.2rem;font-weight:800;margin-bottom:8px}}
    .cta-box p{{color:rgba(255,255,255,.8);font-size:14px;margin-bottom:20px}}
    .btn-wpp{{display:inline-flex;align-items:center;gap:8px;background:var(--verde-wpp);color:#fff;font-weight:700;font-size:15px;padding:14px 26px;border-radius:50px}}
    .btn-wpp svg{{width:20px;height:20px;fill:#fff}}
    .relacionados{{background:var(--cinza-bg);padding:40px 20px}}
    .relacionados h2{{font-size:1.1rem;font-weight:800;color:var(--azul);margin-bottom:16px}}
    .relacionados ul{{list-style:none;display:flex;flex-direction:column;gap:8px}}
    .relacionados li a{{color:var(--azul-medio);font-size:15px;font-weight:600}}
    .breadcrumb{{font-size:13px;color:var(--cinza-sub);margin-bottom:24px}}
    .breadcrumb a{{color:var(--azul-medio);font-weight:500}}
    footer{{background:var(--footer-bg);padding:40px 20px 20px;color:rgba(255,255,255,.7)}}
    .footer-inner{{max-width:1180px;margin:0 auto;font-size:13px;line-height:1.8}}
    .footer-info strong{{color:#fff;font-size:15px;display:block;margin-bottom:4px}}
    .footer-copy{{font-size:12px;color:rgba(255,255,255,.4)}}
    .float-wpp{{position:fixed;bottom:28px;right:28px;width:58px;height:58px;border-radius:50%;background:var(--verde-wpp);display:flex;align-items:center;justify-content:center;box-shadow:0 6px 20px rgba(37,211,102,.45);z-index:999}}
    .float-wpp svg{{width:32px;height:32px;fill:#fff}}
    @media(max-width:768px){{.nav-links{{display:none}}.hamburger{{display:flex}}}}
  </style>
</head>
<body>
<div class="topbar">
  <a href="tel:6799333-0303" class="t-tel"><svg viewBox="0 0 24 24"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg>LIGUE (67) 99333-0303</a>
  <a href="https://wa.me/+5567993330303?text=Ol%C3%A1%2C%20quero%20fazer%20um%20pedido%20de%20G%C3%A1s" target="_blank" rel="noopener" class="t-wpp"><svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.107.548 4.086 1.508 5.806L0 24l6.362-1.481A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>Peça pelo WhatsApp</a>
</div>
<header>
  <nav>
    <a href="/" class="logo"><img src="/images/logo.webp" alt="Mosko Gás Ultragaz Campo Grande" width="160" height="50"></a>
    <ul class="nav-links">
      <li><a href="/gas-de-cozinha/">Gás de Cozinha</a></li>
      <li><a href="/gas-industrial-campo-grande-ms/">Gás P45 e P20</a></li>
      <li><a href="/agua-mineral-em-campo-grande-ms/">Água Mineral</a></li>
      <li><a href="/vendas-corporativas/">Corporativo</a></li>
      <li><a href="/blog/" class="active">Blog</a></li>
      <li><a href="https://wa.me/+5567993330303?text=Ol%C3%A1%2C%20quero%20fazer%20um%20pedido%20de%20G%C3%A1s" target="_blank" rel="noopener" class="n-wpp">Peça agora</a></li>
    </ul>
    <button class="hamburger" id="hamburger" aria-label="Menu"><span></span><span></span><span></span></button>
  </nav>
  <div class="mobile-menu" id="mobile-menu">
    <a href="/gas-de-cozinha/">Gás de Cozinha</a>
    <a href="/gas-p45/">Gás P45</a>
    <a href="/agua-mineral-em-campo-grande-ms/">Água Mineral</a>
    <a href="/vendas-corporativas/">Vendas Corporativas</a>
    <a href="/blog/">Blog</a>
    <a href="https://wa.me/+5567993330303?text=Ol%C3%A1%2C%20quero%20fazer%20um%20pedido%20de%20G%C3%A1s" target="_blank" rel="noopener">📲 Peça pelo WhatsApp</a>
  </div>
</header>
<div class="post-hero">
  <div class="container">
    <div class="post-cat">{data["cat"]}</div>
    <h1>{data["h1"]}</h1>
    <div class="post-meta">Mosko Gás · Campo Grande/MS · {TODAY}</div>
  </div>
</div>
<section class="post-body">
  <div class="container">
    <div class="breadcrumb"><a href="/">Home</a> › <a href="/blog/">Blog</a> › {data["title"]}</div>
    {data["conteudo_html"]}
    <div class="cta-box">
      <h3>Precisa de gás em Campo Grande/MS?</h3>
      <p>Entregamos gás P13, P20 e P45 com rapidez. Seg–Sáb das 7h às 18h30.</p>
      <a class="btn-wpp" href="https://wa.me/+5567993330303?text=Ol%C3%A1%2C%20quero%20fazer%20um%20pedido%20de%20G%C3%A1s" target="_blank" rel="noopener">
        <svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.107.548 4.086 1.508 5.806L0 24l6.362-1.481A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>
        Pedir gás pelo WhatsApp
      </a>
    </div>
  </div>
</section>
<section class="relacionados">
  <div class="container">
    <h2>Leia também</h2>
    <ul>
      {links_rel}
    </ul>
  </div>
</section>
<footer>
  <div class="footer-inner">
    <div class="footer-info">
      <strong>Mosko Gás Distribuidora de Gás e Água Mineral</strong>
      Av. Panamericana, 295 – Estrela Dalva · Campo Grande – MS · WhatsApp: (67) 99333-0303<br>
      CNPJ: 12.977.901/0001-17 — Revenda autorizada Ultragaz / ANP — MoskoGás® INPI nº 912827599
    </div>
    <div class="footer-copy">© 2026 Mosko Gás · <a href="/gas-de-cozinha/" style="color:rgba(255,255,255,.5)">Gás de Cozinha</a> · <a href="/gas-p45/" style="color:rgba(255,255,255,.5)">Gás P45</a> · <a href="/agua-mineral-em-campo-grande-ms/" style="color:rgba(255,255,255,.5)">Água Mineral</a> · <a href="/blog/" style="color:rgba(255,255,255,.5)">Blog</a></div>
  </div>
</footer>
<a class="float-wpp" href="https://wa.me/+5567993330303?text=Ol%C3%A1%2C%20quero%20fazer%20um%20pedido%20de%20G%C3%A1s" target="_blank" rel="noopener" aria-label="WhatsApp">
  <svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.107.548 4.086 1.508 5.806L0 24l6.362-1.481A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.89 0-3.653-.518-5.16-1.419l-.37-.22-3.777.88.898-3.678-.242-.378A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
</a>
<script>document.getElementById('hamburger').addEventListener('click',()=>document.getElementById('mobile-menu').classList.toggle('open'));</script>
<script type="application/ld+json">
{{"@context":"https://schema.org","@graph":[
  {{"@type":"Article","headline":"{data['title']}","author":{{"@type":"Organization","name":"Mosko Gás"}},"publisher":{{"@type":"Organization","name":"Mosko Gás","url":"https://moskogas.com.br"}},"datePublished":"{TODAY}","dateModified":"{TODAY}","url":"https://moskogas.com.br/blog/{slug_base}/","articleSection":"{data['cat']}","inLanguage":"pt-BR"}},
  {{"@type":"BreadcrumbList","itemListElement":[{{"@type":"ListItem","position":1,"name":"Home","item":"https://moskogas.com.br/"}},{{"@type":"ListItem","position":2,"name":"Blog","item":"https://moskogas.com.br/blog/"}},{{"@type":"ListItem","position":3,"name":"{data['title']}","item":"https://moskogas.com.br/blog/{slug_base}/"}}]}}
]}}
</script>
</body>
</html>'''

# Salvar o post
dest = BLOG / slug_base
dest.mkdir(exist_ok=True)
(dest / 'index.html').write_text(html, encoding='utf-8')
print(f"✅ Post salvo: /blog/{slug_base}/")

# ── Atualizar sitemap.xml ─────────────────────────────────────────────────────
sitemap_path = BASE / 'sitemap.xml'
content = sitemap_path.read_text(encoding='utf-8')

nova_url = f"""  <url>
    <loc>https://moskogas.com.br/blog/{slug_base}/</loc>
    <lastmod>{TODAY}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>"""

content = content.replace('</urlset>', nova_url + '\n</urlset>')
sitemap_path.write_text(content, encoding='utf-8')
print(f"✅ sitemap.xml atualizado")

# ── Atualizar /blog/index.html — adicionar card do novo post ─────────────────
blog_index = BLOG / 'index.html'
idx_content = blog_index.read_text(encoding='utf-8')

novo_card = f'''<a href="/blog/{slug_base}/" class="post-card">
      <div class="post-cat-tag">{data["cat"]}</div>
      <h2>{data["title"]}</h2>
      <span class="read-more">Ler artigo →</span>
    </a>'''

idx_content = idx_content.replace('<div class="posts-grid">', '<div class="posts-grid">\n      ' + novo_card)
blog_index.write_text(idx_content, encoding='utf-8')
print(f"✅ /blog/index.html atualizado com novo card")

print(f"\n🎉 Post publicado com sucesso: /blog/{slug_base}/")
