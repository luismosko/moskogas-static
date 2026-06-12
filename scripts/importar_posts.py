#!/usr/bin/env python3
"""
importar_posts.py | v1.0.0
Puxa artigos da API LeadLoop (Studio Artemis) e gera posts estáticos em /blog/.
Importa como RASCUNHO (noindex + banner, fora do sitemap) — publicar via publicar.py.

Uso (local ou GitHub Action):
    LEADLOOP_API_KEY=sk_live_xxx python3 scripts/importar_posts.py

Saída: blog/<slug>/index.html + imagens em images/blog/ + imported_ids.txt
(imported_ids.txt é lido pelo passo de mark-consumed só APÓS o commit+push).
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


def add_to_index(slug, title, desc):
    """Insere o card do post na seção 'Últimos Artigos' da /blog/ (mais novo no topo)."""
    idx_path = os.path.join(ROOT, "blog", "index.html")
    idx = open(idx_path, encoding="utf-8").read()
    url = f"https://moskogas.com.br/blog/{slug}/"
    if url in idx:
        return  # já listado, evita duplicar
    t = html.escape(title)
    d = desc.strip()
    d = (d[:90] + "…") if len(d) > 90 else d
    d = html.escape(d)
    card = ('<!-- IMPORTADOS-API -->\n'
            f'      <a href="{url}" class="post-card">\n'
            f'        <h3>{t}</h3>\n'
            f'        <p>{d}</p>\n'
            f'        <span class="read-more">Ler artigo →</span>\n'
            f'      </a>')
    idx = idx.replace("<!-- IMPORTADOS-API -->", card, 1)
    open(idx_path, "w", encoding="utf-8").write(idx)


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
            add_to_index(slug, p["title"], p.get("meta_description", ""))
            importados.append((p["id"], slug))
            print(f"  ✓ publicado: /blog/{slug}/")
        except Exception as e:
            print(f"  ✗ erro em {p.get('slug')}: {e}", file=sys.stderr)
    # ids para o passo de mark-consumed (só roda após commit+push)
    with open(os.path.join(ROOT, "imported_ids.txt"), "w") as f:
        for pid, slug in importados:
            f.write(f"{pid}\t{slug}\n")
    print(f"TOTAL importados: {len(importados)}")


if __name__ == "__main__":
    main()
