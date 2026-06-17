#!/usr/bin/env python3
"""
importar_posts.py | v1.1.0
Puxa artigos da API LeadLoop (Studio Artemis) e gera posts estáticos em /blog/.
Importa como RASCUNHO (noindex + banner, fora do sitemap) — publicar via publicar.py.

Uso (local ou GitHub Action):
    LEADLOOP_API_KEY=sk_live_xxx python3 scripts/importar_posts.py

Saída: blog/<slug>/index.html + imagens em images/blog/ + imported_ids.txt
(imported_ids.txt é lido pelo passo de mark-consumed só APÓS o commit+push).

LISTAGEM /blog/ — modelo DETERMINÍSTICO (v1.1.0):
  A seção "📰 Últimos Artigos" é 100% auto-gerada a cada execução pela função
  regenerar_listagem(), que varre blog/*/ e lista todos os posts que NÃO estão
  curados em nenhuma seção temática, ordenados por data (mais novo no topo).
  Resultado: é IMPOSSÍVEL um post ficar órfão da listagem. Idempotente.
  (Substitui o antigo add_to_index incremental, que gerava órfãos silenciosos.)
"""
import os, re, io, json, sys, datetime, urllib.request, html

API_BASE = "https://api-seo.studioartemis.co"
KEY = os.environ.get("LEADLOOP_API_KEY", "").strip()
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

MESES = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto',
         'setembro','outubro','novembro','dezembro']

BANNER = ''  # auto-publicação: sem banner de rascunho

RELATED = '''<div class="related-posts">
      <h3>Leia também:</h3>
      <ul>
        <li><a href="/blog/como-saber-se-o-gas-esta-acabando/">Como Saber se o Gás Está Acabando</a></li>
        <li><a href="/blog/botijao-de-gas-tem-validade/">Botijão de Gás Tem Validade?</a></li>
        <li><a href="/blog/checklist-seguranca-gas-residencial/">Checklist de Segurança do Gás</a></li>
      </ul>
    </div>'''


def http(method, path, body=None):
    req = urllib.request.Request(API_BASE + path, method=method,
                                 headers={"Authorization": f"Bearer {KEY}",
                                          "Content-Type": "application/json"})
    data = body.encode() if body else None
    with urllib.request.urlopen(req, data=data, timeout=60) as r:
        return json.loads(r.read().decode())


def baixar_webp(url, destino_rel):
    """Baixa imagem e salva como webp. Retorna caminho local ou a URL original se falhar."""
    try:
        from PIL import Image
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        raw = urllib.request.urlopen(req, timeout=40).read()
        im = Image.open(io.BytesIO(raw)).convert("RGB")
        im.thumbnail((1200, 1200))
        dest_abs = os.path.join(ROOT, destino_rel)
        os.makedirs(os.path.dirname(dest_abs), exist_ok=True)
        im.save(dest_abs, "WEBP", quality=82, method=6)
        return "/" + destino_rel
    except Exception as e:
        print(f"  ! imagem falhou ({url[:60]}...): {e}", file=sys.stderr)
        return url


def add_sitemap(slug):
    """Adiciona a URL do post ao sitemap.xml (antes de </urlset>) se ainda não existir."""
    sm_path = os.path.join(ROOT, "sitemap.xml")
    sm = open(sm_path, encoding="utf-8").read()
    loc = f"https://moskogas.com.br/blog/{slug}/"
    if loc not in sm:
        hoje = datetime.date.today().isoformat()
        entry = (f'  <url><loc>{loc}</loc><lastmod>{hoje}</lastmod>'
                 f'<changefreq>monthly</changefreq><priority>0.7</priority></url>\n</urlset>')
        sm = sm.replace("</urlset>", entry, 1)
        open(sm_path, "w", encoding="utf-8").write(sm)


AUTO_INI = "<!-- AUTO-INICIO -->"
AUTO_FIM = "<!-- AUTO-FIM -->"


def _meta_do_post(path):
    """Extrai (data_iso, title, desc) de um blog/<slug>/index.html."""
    t = open(path, encoding="utf-8").read()
    m_title = re.search(r"<h1[^>]*>(.*?)</h1>", t, re.S)
    title = re.sub(r"<[^>]+>", "", m_title.group(1)).strip() if m_title else ""
    m_desc = re.search(r'<meta name="description" content="([^"]*)"', t)
    desc = m_desc.group(1).strip() if m_desc else ""
    m_data = re.search(r"Atualizado: (\d{4}-\d{2}-\d{2})", t)
    data = m_data.group(1) if m_data else "0000-00-00"
    return data, title, desc


def _card(slug, title, desc):
    t = html.escape(title)
    d = desc.strip()
    d = (d[:90] + "…") if len(d) > 90 else d
    d = html.escape(d)
    return (f'      <a href="https://moskogas.com.br/blog/{slug}/" class="post-card">\n'
            f"        <h3>{t}</h3>\n"
            f"        <p>{d}</p>\n"
            f'        <span class="read-more">Ler artigo →</span>\n'
            f"      </a>")


def regenerar_listagem():
    """Reconstrói a seção 'Últimos Artigos' do zero a partir das pastas blog/*/.
    Lista todos os posts NÃO curados em seções temáticas, por data desc.
    Idempotente — roda a cada execução. Garante que nenhum post fique órfão."""
    idx_path = os.path.join(ROOT, "blog", "index.html")
    idx = open(idx_path, encoding="utf-8").read()

    # 1ª vez: instala os marcadores no lugar do grid de 'Últimos Artigos'
    if AUTO_INI not in idx:
        a = idx.index("📰</span> Últimos Artigos")
        g = idx.index('<div class="posts-grid">', a) + len('<div class="posts-grid">')
        end = idx.index("\n    </div>", g)   # </div> que fecha o grid (4 espaços)
        idx = idx[:g] + "\n      " + AUTO_INI + "\n      " + AUTO_FIM + idx[end:]

    pre, _, rest = idx.partition(AUTO_INI)
    _, _, pos = rest.partition(AUTO_FIM)
    curado = pre + pos  # HTML fora do bloco auto = seções temáticas curadas

    blog_dir = os.path.join(ROOT, "blog")
    posts = []
    for slug in os.listdir(blog_dir):
        p = os.path.join(blog_dir, slug, "index.html")
        if not os.path.isfile(p) or slug.startswith("."):
            continue
        data, title, desc = _meta_do_post(p)
        posts.append((data, slug, title, desc))

    # um post é "curado" se já está linkado em alguma seção temática
    naocurados = [x for x in posts if f"/blog/{x[1]}/" not in curado]
    naocurados.sort(key=lambda x: (x[0], x[1]), reverse=True)  # data desc
    cards = "\n".join(_card(slug, title, desc) for _, slug, title, desc in naocurados)

    novo = pre + AUTO_INI + "\n" + cards + "\n      " + AUTO_FIM + pos
    open(idx_path, "w", encoding="utf-8").write(novo)
    print(f"  listagem regenerada: {len(naocurados)} posts em 'Últimos Artigos' "
          f"(de {len(posts)} totais; {len(posts)-len(naocurados)} curados em temas)")


def listar_disponiveis():
    posts, page = [], 1
    while True:
        d = http("GET", f"/api/integration/posts?page={page}&limit=100")
        posts += d.get("data", [])
        pg = d.get("pagination", {})
        if not pg.get("has_next"):
            break
        page += 1
    return posts


def render(post, tpl):
    slug = post["slug"]
    title = post["title"]
    body = "\n".join(b.get("html", "") for b in post.get("content_blocks") or []) \
           or post.get("content_html", "")

    # baixa imagens internas do corpo e reescreve para local
    for i, m in enumerate(re.findall(r'<img[^>]+src="([^"]+)"', body)):
        if m.startswith("http"):
            local = baixar_webp(m, f"images/blog/{slug}-{i+1}.webp")
            body = body.replace(m, local)

    # imagem destacada
    fimg = post.get("featured_image_url", "")
    fimg_local = baixar_webp(fimg, f"images/blog/{slug}.webp") if fimg else ""
    falt = (post.get("featured_image_alt") or title).replace('"', "'")

    words = len(re.sub(r'<[^>]+>', ' ', body).split())
    readmin = max(2, round(words / 200))
    hoje = datetime.date.today()
    data_pt = f"{hoje.day} de {MESES[hoje.month-1]} de {hoje.year}"
    data_iso = hoje.isoformat()
    crumb = title[:42]

    img_tag = (f'<img src="{fimg_local}" alt="{falt}" width="800" height="450" '
               f'loading="eager" style="border-radius:14px;margin:8px 0 24px;width:100%;object-fit:cover">'
               ) if fimg_local else ""

    cta = ('<div style="background:linear-gradient(130deg,#001A4D,#0055CC);border-radius:14px;'
           'padding:28px;text-align:center;margin:32px 0">'
           '<p style="color:#fff;font-size:1.1rem;font-weight:700;margin-bottom:16px">'
           'Precisa de gás em Campo Grande? A Mosko Gás entrega rápido.</p>'
           '<a href="https://wa.me/5567993330303?text=Ol%C3%A1%2C%20quero%20fazer%20um%20pedido" '
           'target="_blank" rel="noopener" style="display:inline-block;background:#25D366;color:#fff;'
           'font-weight:700;padding:14px 28px;border-radius:50px">📲 Pedir pelo WhatsApp</a></div>')

    article = f'''<article>
  <div class="container">
    <h1>{title}</h1>
    <div class="meta">
      <span>📅 {data_pt}</span>
      <span>⏱️ {readmin} min de leitura</span>
    </div>
    {img_tag}
{body}
    {cta}
    {RELATED}
  </div>
</article>'''

    img_abs = ("https://moskogas.com.br" + fimg_local) if fimg_local.startswith("/") else fimg_local
    schema = {"@context": "https://schema.org", "@graph": [
        {"@type": "Article", "headline": title, "description": post.get("meta_description", ""),
         "image": img_abs, "datePublished": data_iso, "dateModified": data_iso,
         "author": {"@type": "Organization", "name": "Mosko Gás"},
         "publisher": {"@type": "Organization", "name": "Mosko Gás"},
         "mainEntityOfPage": f"https://moskogas.com.br/blog/{slug}/"},
        {"@type": "BreadcrumbList", "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Início", "item": "https://moskogas.com.br/"},
            {"@type": "ListItem", "position": 2, "name": "Blog", "item": "https://moskogas.com.br/blog/"},
            {"@type": "ListItem", "position": 3, "name": crumb}]}]}
    schema_block = '<script type="application/ld+json">\n' + json.dumps(schema, ensure_ascii=False) + '\n</script>'

    html = (tpl
            .replace("{{SLUG}}", slug)
            .replace("{{TITLE}}", title)
            .replace("{{META_DESC}}", post.get("meta_description", "").replace('"', "'"))
            .replace("{{ROBOTS}}", "index, follow")
            .replace("{{DATE}}", data_iso)
            .replace("{{CRUMB}}", crumb)
            .replace("{{BANNER}}", "")
            .replace("{{ARTICLE}}", article)
            .replace("{{SCHEMA}}", schema_block))
    return slug, html


def main():
    if not KEY:
        print("ERRO: defina LEADLOOP_API_KEY", file=sys.stderr); sys.exit(1)
    tpl = open(os.path.join(ROOT, "scripts/template-post.html"), encoding="utf-8").read()
    posts = listar_disponiveis()
    print(f"{len(posts)} post(s) disponível(is) na API")
    importados = []
    for p in posts:
        try:
            slug, html = render(p, tpl)
            d = os.path.join(ROOT, "blog", slug)
            os.makedirs(d, exist_ok=True)
            open(os.path.join(d, "index.html"), "w", encoding="utf-8").write(html)
            add_sitemap(slug)
            importados.append((p["id"], slug))
            print(f"  ✓ publicado: /blog/{slug}/")
        except Exception as e:
            print(f"  ✗ erro em {p.get('slug')}: {e}", file=sys.stderr)
    # regenera a listagem da /blog/ a partir das pastas (idempotente, sem órfãos)
    regenerar_listagem()
    # ids para o passo de mark-consumed (só roda após commit+push)
    with open(os.path.join(ROOT, "imported_ids.txt"), "w") as f:
        for pid, slug in importados:
            f.write(f"{pid}\t{slug}\n")
    print(f"TOTAL importados: {len(importados)}")


if __name__ == "__main__":
    main()
