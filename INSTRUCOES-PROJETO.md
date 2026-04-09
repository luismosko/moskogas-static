# INSTRUÇÕES DO PROJETO — moskogas.com.br (Site Estático)

## IDENTIDADE DO PROJETO
Site 100% estático hospedado no Cloudflare Pages (WordPress removido em março/2026).  
**Meta PageSpeed:** 95+  
**Token GitHub:** Ver arquivo `token_github.txt` no Claude Projects  
**Repositório:** `github.com/luismosko/moskogas-static`

---

## DADOS DA EMPRESA

| Campo | Valor |
|---|---|
| Empresa | Mosko Gás Distribuidora de Gás e Água Mineral |
| CNPJ | 12.977.901/0001-17 |
| Endereço | Av. Panamericana, 295 – Estrela Dalva – Campo Grande/MS – CEP 79034-722 |
| WhatsApp | (67) 99333-0303 |
| Telefone | (67) 3026-5454 |
| Horário | Seg–Sáb 7h às 18h30 |
| Marca | Revenda autorizada Ultragaz / Registro ANP |
| INPI | MoskoGás® — Processo nº 912827599 |
| Avaliações | +350 avaliações 5 estrelas no Google |
| Facebook | facebook.com/gasdecozinhaCampoGrandeMosko |
| Instagram | instagram.com/moskogas |

**Preços atuais (atualizar quando mudar):**
- P13 na portaria: **R$ 103,99** (promoção)
- P13 com entrega: **R$ 124,90**

---

## ARQUITETURA — SITE 100% ESTÁTICO

```
Usuário → moskogas.com.br
              ↓
        Cloudflare DNS
              ↓
        Cloudflare Pages (moskogas-static)
              ↓
        _worker.js verifica a rota:
         ├─ Rota em PAGINAS_ESTATICAS? → Serve HTML do repositório ✅
         └─ Rota NÃO listada?         → Retorna 404 ❌
```

> ⚠️ **IMPORTANTE:** O WordPress foi desativado em março/2026. Todo o conteúdo agora é HTML estático.

### Infraestrutura

| Componente | Detalhe |
|---|---|
| DNS/CDN | Cloudflare |
| Site estático | Cloudflare Pages — projeto `moskogas-static` |
| SSL | Cloudflare (gerenciado automaticamente) |
| Deploy | Automático via `git push` (~30 segundos) |

---

## REPOSITÓRIO — ESTRUTURA DE PASTAS

```
moskogas-static/
├── index.html                               ✅ Home
├── gas-de-cozinha/index.html                ✅ Gás de Cozinha P13
├── gas-p45/index.html                       ✅ Gás P45
├── agua-mineral-em-campo-grande-ms/         ✅ Água Mineral
├── vendas-corporativas/                     ✅ Vendas Corporativas
├── sobre-a-mosko-gas/                       ✅ Sobre
├── contato/                                 ✅ Contato
├── blog/                                    ✅ 62 posts de blog
│   ├── index.html                           ← Listagem do blog
│   ├── gas-para-churrasco-p13-ou-p45/       ← Exemplo de post
│   └── ...
├── bairros/                                 ✅ ~110 páginas de bairros
├── glossario/                               ✅ Termos do glossário
├── images/                                  ← Imagens do site
│   ├── logo.webp                            ← Logo nav (height:50px)
│   ├── Gas-24-horas-de-Cozinha.webp         ← Botijão P13 (hero)
│   └── ...
├── _worker.js                               ✅ v3.0.2 — Roteador (CRÍTICO!)
├── sitemap.xml                              ✅ ~190 URLs
├── robots.txt                               ✅ Configuração de crawlers
├── INSTRUCOES-PROJETO.md                    ← Este arquivo
└── wrangler.jsonc                           ✅ Config Cloudflare Pages
```

> **Blog:** Os posts ficam em `blog/slug-do-post/index.html` — são HTML estático como o resto do site.  
> **Imagens extras** ficam em `moskogas.com.br/wp-content/uploads/` (usar URLs absolutas quando necessário).

---

## COMO ADICIONAR NOVA PÁGINA (fluxo completo)

> ⚠️ **REGRA CRÍTICA:** Toda página nova DEVE ser registrada no `_worker.js`. Sem isso, o Cloudflare retorna 404 e o Google não indexa!

### Checklist obrigatório — NUNCA PULAR ETAPAS

| # | Etapa | Arquivo | O que fazer |
|---|-------|---------|-------------|
| 1 | Criar HTML | `pasta/index.html` | Criar arquivo baseado no TEMPLATE |
| 2 | **Registrar rota** | `_worker.js` | Adicionar em `PAGINAS_ESTATICAS` |
| 3 | Adicionar sitemap | `sitemap.xml` | Inserir `<url>` antes de `</urlset>` |
| 4 | Commit e push | — | `git add . && git commit && git push` |
| 5 | Solicitar indexação | GSC ou API | Manual: Inspeção de URL, ou `python _tools/google-indexing.py` |

### Fluxo de comandos

```bash
# 1. Clonar repositório (se ainda não clonado na sessão)
git clone https://TOKEN@github.com/luismosko/moskogas-static.git
cd moskogas-static

# 2. Criar pasta e arquivo
mkdir nome-da-pagina
# ... criar index.html baseado no TEMPLATE-PAGINA.html ...

# 3. OBRIGATÓRIO: Adicionar rota no _worker.js
# No array PAGINAS_ESTATICAS, adicionar:
#   '/nome-da-pagina/',

# 4. OBRIGATÓRIO: Adicionar no sitemap.xml
# Antes de </urlset>, adicionar:
#   <url><loc>https://moskogas.com.br/nome-da-pagina/</loc></url>

# 5. Commitar tudo
git add .
git commit -m "v1.0.0 /nome-da-pagina/ — descrição"
git push origin main
# Cloudflare publica em ~30 segundos
```

---

## COMO ADICIONAR NOVO POST DE BLOG

> ⚠️ **LIÇÃO APRENDIDA (abril/2026):** Posts de blog TAMBÉM precisam ser registrados no `_worker.js`. Sem isso = 404 no Google!

### Checklist obrigatório para posts de blog

| # | Etapa | Arquivo | O que fazer |
|---|-------|---------|-------------|
| 1 | Criar pasta | `blog/slug-do-post/` | `mkdir blog/slug-do-post` |
| 2 | Criar HTML | `blog/slug-do-post/index.html` | Baseado no template de blog |
| 3 | **Registrar rota** | `_worker.js` | Adicionar `'/blog/slug-do-post/',` |
| 4 | Adicionar sitemap | `sitemap.xml` | Inserir URL do post |
| 5 | Commit e push | — | `git add . && git commit && git push` |
| 6 | Solicitar indexação | GSC | Após deploy (~30s) |

### Exemplo prático

```bash
# Criar post
mkdir blog/meu-novo-post
# Criar blog/meu-novo-post/index.html

# OBRIGATÓRIO: Adicionar no _worker.js
# Na seção PAGINAS_ESTATICAS, adicionar:
  '/blog/meu-novo-post/',

# OBRIGATÓRIO: Adicionar no sitemap.xml
# Antes de </urlset>:
  <url><loc>https://moskogas.com.br/blog/meu-novo-post/</loc></url>

# Commit
git add .
git commit -m "v1.0.0 /blog/meu-novo-post/ — novo post sobre X"
git push origin main
```

### Por que isso é necessário?

O `_worker.js` funciona como um **roteador**:
- Se a URL está em `PAGINAS_ESTATICAS` → Serve o HTML estático ✅
- Se NÃO está → Retorna 404 ❌

**Não basta criar o arquivo HTML** — ele precisa estar registrado no worker!

---

## ESTADO ATUAL DO WORKER (v3.0.2)

```javascript
const PAGINAS_ESTATICAS = [
  '/',
  '/agua-mineral-em-campo-grande-ms/',
  '/bairros/',
  '/blog/',
  '/blog/5-receitas-para-voce-economizar-gas-de-cozinha/',
  // ... + 60 posts de blog ...
  '/gas-de-cozinha/',
  '/gas-p45/',
  // ... + 100 páginas de bairros ...
];
// Total: ~190 rotas
```

---

## VERSIONAMENTO — REGRA OBRIGATÓRIA

Primeira linha de todo HTML deve conter:
```html
<!--
  pasta/index.html | Versão: X.X.X | Atualizado: AAAA-MM-DD | Descrição: resumo
-->
```

---

## IDENTIDADE VISUAL — REGRAS QUE NÃO PODEM MUDAR

> **REGRA MÁXIMA:** Topbar, nav, banner urgência, badges, footer e float-wpp são IDÊNTICOS em todas as páginas. Nunca modificar esses blocos. Só o conteúdo interno (hero, seções do meio) muda.

### Variáveis CSS — copiar exatas
```css
:root {
  --azul: #003087;
  --azul-medio: #0055CC;
  --azul-claro: #E8F0FD;
  --verde-wpp: #25D366;
  --laranja: #FF6B00;
  --cinza-bg: #F4F6FA;
  --cinza-texto: #333;
  --cinza-sub: #666;
  --borda: #E0E7F3;
  --footer-bg: #001A4D;
  --radius: 14px;
  --radius-btn: 50px;
}
```

### Fonte única
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
```
**Só Inter.** Não usar Montserrat, Roboto, nem outras.

### Gradiente hero
```css
background: linear-gradient(130deg, #001A4D 0%, #003087 55%, #0055CC 100%);
```

### Tipos de botão (não criar outros)
| Classe | Onde | Aparência |
|---|---|---|
| `.btn-wpp` | CTAs principais | Verde `#25D366`, pill, ícone WhatsApp SVG |
| `.btn-outline` | Hero secundário | Transparente, borda branca, só no fundo azul |
| `.n-wpp` | Nav desktop | Verde, sem ícone |
| `.t-wpp` | Topbar | Verde com ícone WPP |
| `.t-tel` | Topbar | Borda branca semi-transparente |

### Estrutura obrigatória de cada página
```
1. <head>        → meta SEO + canonical + OG + schema JSON-LD + CSS
2. TOPBAR        → idêntico à home
3. NAV           → idêntico à home (só .active muda)
4. HERO          → h1 focado na keyword + card preços (se tiver) + rating + botões
5. URGÊNCIA      → banner laranja, idêntico
6. BADGES        → faixa cinza com credenciais, idêntico
7. [seções específicas da página]
8. FAQ           → accordion, mín. 7 perguntas, idêntico ao estilo da home
9. CTA FINAL     → seção azul escuro com btn-wpp
10. FOOTER       → idêntico à home
11. FLOAT WPP    → idêntico à home
12. <script>     → FAQ accordion + hambúrguer
13. Schema JSON-LD → LocalBusiness + FAQPage
```

---

## SEO — ESTRATÉGIA E PADRÕES

### Por que estamos perdendo para concorrentes fracos
O site passou por ataque de malware em set/2024 e perdeu ranking. Concorrentes como `gascampogrande.com.br` têm Authority Score 9 (igual ao nosso) mas só 2 backlinks — rankeiam por keyword-match no domínio e conteúdo focado. Nossa vantagem: 145 backlinks reais, 350 avaliações 5★, marca registrada, Ultragaz oficial.

**Solução:** Criar páginas HTML ultra-rápidas com keyword exata no título, URL semântica, preços explícitos, schema.org completo e FAQs para rich snippets.

### Title Tag — fórmula
```
[Keyword Principal em Campo Grande MS] — [Diferencial concreto] | Mosko Gás
```
Exemplos:
- `Gás de Cozinha em Campo Grande MS — Botijão P13 R$ 103,99 | Mosko Gás`
- `Água Mineral em Campo Grande MS — Entrega Rápida | Mosko Gás`
- `Gás P45 em Campo Grande MS — GLP Industrial Ultragaz | Mosko Gás`

### Meta Description — deve conter
1. Keyword principal
2. Preço atual (quando aplicável)
3. Autoridade ("Revenda autorizada Ultragaz" ou "350 avaliações 5★")
4. Telefone ou "WhatsApp"
5. Máx 160 caracteres

### H1 — estrutura padrão
```html
<h1><span>Keyword Principal em Campo Grande</span> — Complemento descritivo</h1>
```
Uma única H1 por página. O `<span>` fica em `color: #7EC8FF` (azul claro no fundo escuro).

### Canonical — sempre incluir
```html
<link rel="canonical" href="https://moskogas.com.br/SLUG-DA-PAGINA/">
```

### FAQs — mínimo 7 por página — sempre responder
1. Qual o preço de [produto] em Campo Grande?
2. Qual o horário de atendimento?
3. Quais bairros vocês atendem?
4. [Produto] é entregue lacrado e com nota fiscal?
5. Quais formas de pagamento?
6. Como fazer o pedido?
7. A Mosko Gás é revenda autorizada?

### Schema.org — obrigatório em toda página
- `LocalBusiness` com preços, horário, avaliações, endereço, coordenadas
- `FAQPage` com todas as perguntas da seção FAQ

### Bairros atendidos — lista padrão para incluir nas páginas
Carandá Bosque, Giocondo Orsi, Estrela Dalva, Autonomista, Vila Rica, Santa Fé, Centro, Jardim dos Estados, Vila Margarida, Novos Estados, Mata do Jacinto, Vila Nascente, Nova Lima, Jardim Presidente, Columbia, Chácara Cachoeira, Monte Castelo, São Francisco, Universitário

### Google Search Console — após cada nova página

**Opção 1 — Manual (1-2 URLs):**
Search Console → Inspeção de URL → Solicitar indexação.

**Opção 2 — API (múltiplas URLs):**
Usar o script em `_tools/google-indexing.py` (limite: 200 URLs/dia):
```bash
python _tools/google-indexing.py "https://moskogas.com.br/nova-pagina/"
```

**Configuração da API (já feita):**
- Conta de serviço: `indexing-bot@mosko-marketing.iam.gserviceaccount.com`
- Projeto GCP: `mosko-marketing`
- Credencial: `_tools/google-credentials.json` (não commitado)

---

## PÁGINAS A CRIAR — PRIORIDADE E KEYWORDS

| Prioridade | Slug | Keyword-alvo | Produto |
|---|---|---|---|
| 1 | `/gas-p45/` | "gás p45 campo grande" | Botijão industrial 45kg |
| 2 | `/gas-industrial-campo-grande-ms/` | "gás industrial campo grande" | P45 + P20 empresas |
| 3 | `/agua-mineral-em-campo-grande-ms/` | "água mineral campo grande entrega" | Água mineral |
| 4 | `/vendas-corporativas/` | "gás para empresas campo grande" | B2B / frotista |
| 5 | `/sobre-a-mosko-gas/` | "Mosko Gás campo grande" | Institucional |
| 6 | `/contato/` | "contato Mosko Gás" | Formulário/mapa |

---

## IMAGENS DISPONÍVEIS EM /images/

| Arquivo | Usar em |
|---|---|
| `logo.webp` | Nav de todas as páginas |
| `Gas-24-horas-de-Cozinha.webp` | Hero e seção produto do P13 |
| `entrega.webp` | Seções "como funciona", "sobre nós" |
| `Sobre-a-Mosko-Gas-Distribuidora-(...).webp` | Página Sobre, hero institucional |
| `gas-do-povo-campo-grande-ms.webp` | Seção Gás do Povo |
| `gas-p20-entrega-campo-grande.webp` | Páginas P20 / Industrial |
| `p45-campo-grande-ms-moskogas-ultragaz.webp` | Páginas P45 / Industrial |
| `Pedir-gas-Whatsaap.webp` | CTAs secundários |
| `pedir-gas-agora-no-whatsapp.webp` | Banners CTA |

Regra de carregamento:
- Imagem do hero: `loading="eager"`
- Todas as outras: `loading="lazy"`

---

## RESULTADO ESPERADO — PAGESPEED

| Métrica | Antes (WP+Elementor) | Meta (HTML puro) |
|---|---|---|
| Performance | 75 | 95+ |
| LCP | 4,9s | < 2s |
| Speed Index | 5,7s | < 2s |
| Acessibilidade | 94 | 95+ |
| SEO | 100 | 100 |

---

## OBSERVAÇÃO — PROJETO RELACIONADO

Existe o projeto **Mosko APP - Bling Interface** (Claude Projects separado) com backend no Cloudflare Worker `moskogas-backend-v2` (R2 + D1 + API Bling). No futuro será integrado ao site estático para dados dinâmicos (preços em tempo real, pedidos).

---

## ARQUIVOS ANEXOS DESTE PROJETO

| Arquivo | Conteúdo |
|---|---|
| `INSTRUCOES-PROJETO.md` | Este documento |
| `TEMPLATE-PAGINA.html` | Template HTML completo para novas páginas |
| `token_github.txt` | Token de acesso ao repositório |
