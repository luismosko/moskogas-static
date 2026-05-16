#!/bin/bash
# verificar-sitemap.sh
# Verifica se todas URLs do sitemap.xml estão registradas no _worker.js

echo "🔍 Verificando sincronização sitemap.xml ↔ _worker.js..."
echo ""

ERROS=0
TOTAL_SITEMAP=0
TOTAL_WORKER=0

# Conta URLs no sitemap
TOTAL_SITEMAP=$(grep -c '<loc>' sitemap.xml 2>/dev/null || echo "0")

# Conta rotas no worker
TOTAL_WORKER=$(grep -c "  '/" _worker.js 2>/dev/null || echo "0")

echo "📊 Totais:"
echo "   Sitemap: $TOTAL_SITEMAP URLs"
echo "   Worker:  $TOTAL_WORKER rotas"
echo ""

# Verifica URLs do sitemap que não estão no worker
while IFS= read -r url; do 
  path=$(echo "$url" | sed 's|https://moskogas.com.br||')
  [ "$path" = "" ] && path="/"
  
  if ! grep -q "'$path'," _worker.js 2>/dev/null; then 
    echo "❌ URL no sitemap mas NÃO no worker: $path"
    ERROS=$((ERROS + 1))
  fi
done < <(grep "<loc>" sitemap.xml | sed 's/.*<loc>//;s/<\/loc>.*//')

echo ""

if [ $ERROS -eq 0 ]; then
  echo "✅ Sitemap e worker 100% sincronizados!"
  echo "✅ Pode fazer commit com segurança"
  exit 0
else
  echo "⚠️  Encontrados $ERROS erros de sincronização"
  echo "❌ NÃO FAÇA COMMIT até corrigir!"
  echo ""
  echo "Como corrigir:"
  echo "1. Abrir _worker.js"
  echo "2. Adicionar as rotas faltantes em PAGINAS_ESTATICAS"
  echo "3. Rodar este script novamente"
  exit 1
fi
