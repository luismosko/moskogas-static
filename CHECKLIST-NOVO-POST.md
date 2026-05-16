# 📋 CHECKLIST — CRIAR NOVO POST BLOG

**Problema:** Post criado mas retorna 404 porque faltou registrar no `_worker.js`

**Solução:** Sempre seguir estes 3 passos ao criar novo post

---

## ✅ PASSO 1: Criar o post

```bash
cd moskogas-static
mkdir blog/slug-do-post
# criar blog/slug-do-post/index.html
```

---

## ✅ PASSO 2: Registrar no _worker.js

**OBRIGATÓRIO** senão o post vai retornar 404 mesmo existindo!

1. Abrir `_worker.js`
2. Localizar a seção `const PAGINAS_ESTATICAS = [`
3. Adicionar a rota na lista de blog (ordem alfabética):

```javascript
const PAGINAS_ESTATICAS = [
  // ... outras rotas
  '/blog/post-existente-1/',
  '/blog/post-existente-2/',
  '/blog/slug-do-post/',  // ← ADICIONAR AQUI
  '/blog/post-existente-3/',
  // ...
];
```

4. Atualizar versão no cabeçalho do arquivo:
```javascript
/**
 * _worker.js | Versão: 3.X.X | Atualizado: AAAA-MM-DD
 * MUDANÇAS vX.X.X: Adiciona rota /blog/slug-do-post/
 */
```

---

## ✅ PASSO 3: Adicionar ao sitemap.xml

1. Abrir `sitemap.xml`
2. Adicionar entrada antes do `</urlset>`:

```xml
  <url>
    <loc>https://moskogas.com.br/blog/slug-do-post/</loc>
    <lastmod>AAAA-MM-DD</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>
```

---

## ✅ PASSO 4: Verificar sincronização

**Antes de fazer commit**, rodar este comando para verificar:

```bash
cd moskogas-static

# Verificar se todas URLs do sitemap estão no worker
grep "<loc>" sitemap.xml | sed 's/.*<loc>//;s/<\/loc>.*//' | while read url; do 
  path=$(echo $url | sed 's|https://moskogas.com.br||')
  if [ "$path" = "" ]; then path="/"; fi
  if ! grep -q "'$path'," _worker.js 2>/dev/null; then 
    echo "⚠️ FALTA: $path"
  fi
done

# Se não aparecer nada = tudo OK!
```

---

## ✅ PASSO 5: Commit e push

```bash
git add .
git commit -m "blog: adiciona post slug-do-post + registra no worker v3.X.X"
git push origin main
```

---

## 🔍 SCRIPT VERIFICAÇÃO AUTOMÁTICA

Copiar e colar no terminal antes de cada commit:

```bash
#!/bin/bash
# Verifica sincronização sitemap ↔ worker

echo "🔍 Verificando sincronização sitemap.xml ↔ _worker.js..."
echo ""

ERROS=0

# Verifica URLs do sitemap que não estão no worker
while IFS= read -r url; do 
  path=$(echo "$url" | sed 's|https://moskogas.com.br||')
  [ "$path" = "" ] && path="/"
  
  if ! grep -q "'$path'," _worker.js 2>/dev/null; then 
    echo "❌ URL no sitemap mas NÃO no worker: $path"
    ERROS=$((ERROS + 1))
  fi
done < <(grep "<loc>" sitemap.xml | sed 's/.*<loc>//;s/<\/loc>.*//')

if [ $ERROS -eq 0 ]; then
  echo "✅ Sitemap e worker 100% sincronizados!"
  echo ""
  echo "Total URLs no sitemap: $(grep -c '<loc>' sitemap.xml)"
  echo "Total rotas no worker: $(grep -c "  '/" _worker.js | head -1)"
else
  echo ""
  echo "⚠️  Encontrados $ERROS erros de sincronização"
  echo "❌ NÃO FAÇA COMMIT até corrigir!"
fi
```

**Salvar como:** `verificar-sitemap.sh`

**Usar:**
```bash
chmod +x verificar-sitemap.sh
./verificar-sitemap.sh
```

---

## 🚨 ERRO COMUM

**Sintoma:** Post existe em `blog/slug/index.html` e no `sitemap.xml`, mas retorna 404

**Causa:** Esqueceu de adicionar no `_worker.js` na seção `PAGINAS_ESTATICAS`

**Fix rápido:**
1. Abrir `_worker.js`
2. Adicionar `'/blog/slug/',` na lista
3. Bumpar versão no cabeçalho
4. Commit + push

---

## 📊 NÚMEROS ATUAIS (16/Mai/2026)

- **Sitemap:** 203 URLs
- **Worker:** 209 rotas registradas
- **Blog posts:** 87 (75 no sitemap inicial + 12 adicionados em 16/Mai)
- **Páginas bairro:** 101
- **Páginas principais:** 18

---

## 🔄 MANUTENÇÃO MENSAL

**Todo mês:**
1. Rodar script de verificação
2. Se encontrar erros, corrigir
3. Atualizar este documento com números atuais

**Última verificação:** 16 de maio de 2026 — ✅ 0 erros
