#!/usr/bin/env python3
"""
publicar.py | v1.0.0
Promove um post de RASCUNHO para PUBLICADO:
  - troca robots noindex,nofollow -> index,follow
  - remove o banner amarelo de rascunho
  - adiciona a URL ao sitemap.xml (antes de </urlset>)

Uso:  python3 scripts/publicar.py <slug> [<slug2> ...]
"""
import os, re, sys, datetime

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def publicar(slug):
    fpath = os.path.join(ROOT, "blog", slug, "index.html")
    if not os.path.exists(fpath):
        print(f"  ✗ não encontrado: /blog/{slug}/"); return False
    html = open(fpath, encoding="utf-8").read()

    # 1. robots -> index
    html = re.sub(r'(<meta name="robots" content=")[^"]*(">)', r'\g<1>index, follow\g<2>', html, count=1)
    # 2. remove banner de rascunho (a div logo após <body>)
    html = re.sub(r'\n?<div style="background:#FFF4CE;.*?</div>', '', html, count=1, flags=re.S)
    open(fpath, "w", encoding="utf-8").write(html)

    # 3. adiciona ao sitemap se ainda não estiver
    sm_path = os.path.join(ROOT, "sitemap.xml")
    sm = open(sm_path, encoding="utf-8").read()
    loc = f"https://moskogas.com.br/blog/{slug}/"
    if loc not in sm:
        hoje = datetime.date.today().isoformat()
        entry = (f'  <url><loc>{loc}</loc><lastmod>{hoje}</lastmod>'
                 f'<changefreq>monthly</changefreq><priority>0.7</priority></url>\n</urlset>')
        sm = sm.replace("</urlset>", entry, 1)
        open(sm_path, "w", encoding="utf-8").write(sm)
        print(f"  ✓ publicado + sitemap: /blog/{slug}/")
    else:
        print(f"  ✓ publicado (já no sitemap): /blog/{slug}/")
    return True


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("uso: python3 scripts/publicar.py <slug> [<slug2> ...]"); sys.exit(1)
    for s in sys.argv[1:]:
        publicar(s.strip().strip("/").replace("blog/", ""))
