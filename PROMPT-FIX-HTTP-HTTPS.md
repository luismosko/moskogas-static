# PROMPT: Fix HTTP→HTTPS (Cloudflare Workers)

> Copie e cole este prompt em qualquer chat do Claude para aplicar o fix de redirect HTTP→HTTPS em projetos Cloudflare Workers/Pages.

---

## PROMPT

```
Preciso adicionar redirect HTTP→HTTPS em um Cloudflare Worker.

CONTEXTO:
- Projeto: [NOME DO PROJETO]
- Repositório: [URL DO REPO]
- Arquivo: _worker.js (ou workers-site/index.js)
- Problema: Google está indexando versões HTTP e HTTPS separadamente, causando canibalização de ranking

SOLUÇÃO:
Adicionar redirect 301 permanente de HTTP para HTTPS no INÍCIO do handler fetch(), ANTES de qualquer outra lógica.

CÓDIGO A ADICIONAR:
```javascript
// ── 0. REDIRECT HTTP → HTTPS (301) ─────────────────────────────────────
// CRITICAL: evita duplicação de indexação no Google
if (url.protocol === 'http:') {
  return Response.redirect('https://' + url.host + url.pathname + url.search, 301);
}
```

REQUISITOS:
1. Clone o repositório
2. Configure git user.email e user.name
3. Faça git fetch origin && git reset --hard origin/main
4. Localize a função `async fetch(request, env) {` no _worker.js
5. Adicione o código logo após `const url = new URL(request.url);`
6. Incremente a versão no comentário do topo do arquivo
7. Commit com mensagem: "vX.X.X CRITICAL FIX: adiciona redirect HTTP→HTTPS"
8. Push para main

FORMATO DE RESPOSTA:
1. Mostre o diff do que foi alterado
2. Confirme o commit e número de commit
3. Explique o que acontece agora quando alguém acessa via HTTP
```

---

## EXEMPLO DE USO

**Para moskogas.com.br:**
```bash
cd /home/claude
git clone https://[TOKEN]@github.com/luismosko/moskogas-static.git
cd moskogas-static
git config user.email "luismosko@gmail.com"
git config user.name "Luis Mosko"
git fetch origin && git reset --hard origin/main

# [Claude edita _worker.js aqui]

git add _worker.js
git commit -m "v3.1.4 CRITICAL FIX: adiciona redirect HTTP→HTTPS"
git push origin main
```

**Resultado:**
- HTTP requests agora retornam 301 para HTTPS
- Google consolida todo o link juice na versão HTTPS
- Eliminação de duplicação de indexação em 2-4 semanas

---

## CHECKLIST PÓS-APLICAÇÃO

- [ ] Deploy confirmado (Cloudflare Pages ~30s)
- [ ] Testar manualmente: `curl -I http://seudominio.com` (deve retornar 301)
- [ ] Monitorar GSC nas próximas semanas: versões HTTP devem sumir do índice
- [ ] Atualizar documentação do projeto mencionando o fix

---

## QUANDO NÃO USAR

❌ **Não aplicar se:**
- Site já tem HTTPS Strict no Cloudflare (redundante)
- Site intencionalmente serve HTTP (muito raro)
- Worker já tem lógica de redirect HTTP→HTTPS

✅ **Sempre aplicar se:**
- GSC mostra URLs HTTP indexadas
- Semrush/Ahrefs reportam duplicação HTTP/HTTPS
- PageSpeed mostra versões HTTP

---

*Criado por Luis Mosko — 13/Mai/2026*
*Baseado no fix aplicado em moskogas.com.br (commit cb1e552)*
