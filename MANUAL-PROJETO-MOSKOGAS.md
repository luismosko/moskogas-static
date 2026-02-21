# MANUAL DO PROJETO — moskogas-static
> Histórico completo de decisões, execução e planejamento
> Atualizado: 2026-02-21

---

## 1. ORIGEM E CONTEXTO

**Problema inicial:** Site `moskogas.com.br` com PageSpeed 75 (Performance), LCP 4,9s, Speed Index 5,7s — causado por WordPress + Elementor com dezenas de scripts bloqueando renderização.

**Agravante:** Ataque de malware em setembro/2024 derrubou o ranking do site. Concorrentes com Authority Score idêntico (9) mas apenas 2 backlinks passaram à frente por terem domínios com keyword-match e conteúdo focado.

**Decisão:** Migração gradual para HTML puro no Cloudflare Pages, mantendo WordPress ativo como fallback durante a transição. Blog e páginas legais permanecem no WordPress.

**Vantagens da Mosko Gás sobre concorrentes:**
- 145 backlinks reais
- +350 avaliações 5★ no Google
- Marca registrada MoskoGás® (INPI nº 912827599)
- Revenda autorizada Ultragaz (registro ANP)
- CNPJ ativo: 12.977.901/0001-17

---

## 2. ARQUITETURA TÉCNICA

### Fluxo de requisição
```
Usuário → moskogas.com.br
    → Cloudflare DNS (proxied)
    → Cloudflare Pages (moskogas-static)
    → _worker.js decide:
        PAGINAS_ESTATICAS → serve HTML local (ultra rápido, CDN global)
        REDIRECTS → 301 para URL correta
        demais → proxy para origin.moskogas.com.br (WordPress/HostGator)
```

### Componentes
| Componente | Detalhe |
|---|---|
| Repositório | github.com/luismosko/moskogas-static |
| Hosting estático | Cloudflare Pages (gratuito) |
| Worker | _worker.js v1.9.0 |
| WordPress | HostGator, IP 162.241.62.186, sh-pro88.hostgator.com.br |
| SSL Mode | Full (não Full Strict — HostGator usa cert autoassinado) |
| WP Admin URL | moskogas.com.br/acesso-seguro |

### DNS crítico
- `moskogas.com.br` → A → 162.241.62.186 → **Proxied ✅**
- `origin.moskogas.com.br` → A → 162.241.62.186 → **DNS Only ❌** (canal secreto do worker)
- `www` → CNAME → moskogas.com.br → **Proxied ✅**

> **NUNCA transformar `origin` em Proxied** — isso quebra o proxy para o WordPress.

### Problemas resolvidos durante a implantação
1. **Cloudflare Pages não suporta proxy 200 no `_redirects`** (é feature do Netlify) → solução: usar `_worker.js`
2. **Loop de redirecionamento WordPress** → resolvido com `X-Forwarded-Proto: https` e `redirect: 'manual'` no worker + configuração no `wp-config.php`
3. **Imagens servidas pelo WordPress** → worker v1.7.0 passou a detectar extensões estáticas e servir pelo Cloudflare
4. **SSL Full Strict incompatível com HostGator** → mantido em Full

---

## 3. HISTÓRICO DE EXECUÇÃO

### Fase 1 — Fundação (fev/2026)
- [x] Home `index.html` v3.2.0 criada com design Ultragaz (Inter, #003087, pill buttons)
- [x] `_worker.js` v1.0 → v1.9.0 com roteamento completo
- [x] `wrangler.jsonc` configurado
- [x] Repositório GitHub conectado ao Cloudflare Pages
- [x] `origin.moskogas.com.br` configurado como DNS Only
- [x] WordPress sem loops de redirect

### Fase 2 — Páginas Principais (fev/2026)
- [x] `/gas-de-cozinha/` — P13, preços, FAQs
- [x] `/gas-p45/` — industrial, specs, segmentos
- [x] `/gas-industrial-campo-grande-ms/` — P45 + P20 empresas
- [x] `/agua-mineral-em-campo-grande-ms/` — galões, garrafas
- [x] `/vendas-corporativas/` — B2B, frotistas
- [x] `/sobre-a-mosko-gas/` — institucional
- [x] `/contato/` — formulário/mapa

### Fase 3 — Páginas de Serviço (fev/2026)
- [x] `/disk-gas-em-campo-grande-ms/`
- [x] `/gas-entrega-hoje-em-campo-grande-ms/`
- [x] `/gas-mais-proximo-em-campo-grande-ms/`
- [x] `/gas-do-povo-em-campo-grande-ms/`
- [x] `/whatsappgas/`
- [x] `/gas-de-empilhadeiras-p20/`

### Fase 4 — Páginas por Segmento Corporativo (fev/2026)
Script Python gerou 11 páginas de segmento com conteúdo específico:
- [x] restaurantes, padarias, hotéis, condomínios, bares, lavanderias
- [x] clínicas, escolas, salões de festas, construção civil, industrial-empresas

### Fase 5 — Páginas de Bairro (fev/2026)
Script Python gerou 75 páginas de bairro baseadas em template com:
- H1, title, meta description com keyword + bairro
- Schema LocalBusiness completo
- FAQ 7 perguntas padrão
- Linkagem interna para páginas principais
- Tags de bairros vizinhos para navegação

**Bairros cobertos:** Carandá Bosque, Estrela Dalva, Mata do Jacinto, Santa Fé, Autonomista, Novos Estados, Monte Castelo, Vila Rica, Vila Nascente, Vila Margarida, Nova Lima, São Francisco, Universitário, Giocondo Orsi, Centro, Jardim dos Estados, Columbia, Chácara Cachoeira, Coronel Antonino, Danúbio Azul, e ~55 outros.

### Fase 6 — Imagens (fev/2026)
- [x] Pasta `/images/` criada no repositório
- [x] Todas as imagens migradas do WordPress para o repo
- [x] Fotos da frota tratadas com IA (ChatGPT Image): cores saturadas, sujeiras removidas
- [x] Todas convertidas para `.webp`
- **REGRA ESTABELECIDA:** toda foto nova deve ser tratada com IA antes de subir

### Fase 7 — Sitemap e robots.txt (fev/2026)
- [x] `sitemap.xml` gerado com 100 → 118 URLs (após adição do blog)
- [x] `robots.txt` com `Sitemap: https://moskogas.com.br/sitemap.xml`
- [x] Prioridades definidas: 1.0 (home), 0.9 (principais), 0.8 (serviço/blog index), 0.7 (posts), 0.6 (bairros)

### Fase 8 — Blog Migrado (fev/2026)
- [x] Leitura do `post-sitemap.xml` do WordPress — 23 entradas identificadas
- [x] Análise: 6 posts com emoji no slug (redundantes, substituídos por redirects) + 17 posts informativos reais
- [x] 17 posts migrados para HTML estático com:
  - Conteúdo preservado e enriquecido
  - Linkagem interna para páginas de produto e serviço
  - Seção "Leia também" com 3 posts relacionados em cada
  - CTA final para WhatsApp
  - Template responsivo com mesma identidade visual
- [x] `/blog/index.html` — grid com todos os 17 posts em cards
- [x] 6 redirects 301 no worker: posts emoji → páginas de bairro estáticas
- [x] _worker.js v1.9.0 com todas as rotas do blog

---

## 4. ESTRUTURA DO REPOSITÓRIO (COMPLETA)

```
moskogas-static/
├── index.html                          ✅ Home v3.2.0
├── _worker.js                          ✅ v1.9.0
├── wrangler.jsonc
├── sitemap.xml                         ✅ 118 URLs
├── robots.txt
├── INSTRUCOES-PROJETO-MOSKOGAS.md     ✅ Referência rápida
├── MANUAL-PROJETO-MOSKOGAS.md         ✅ Este arquivo
│
├── images/                             ✅ Todas as imagens locais
│   ├── logo.webp
│   ├── Gas-24-horas-de-Cozinha.webp
│   ├── entrega.webp
│   ├── Sobre-a-Mosko-Gas-(...).webp
│   ├── gas-do-povo-campo-grande-ms.webp
│   ├── gas-p20-entrega-campo-grande.webp
│   ├── p45-campo-grande-ms-moskogas-ultragaz.webp
│   ├── frota-entrega-gas-moskogas.webp    ← IA enhanced
│   ├── moto-entrega-gas-moskogas.webp     ← IA enhanced
│   ├── Pedir-gas-Whatsaap.webp
│   └── pedir-gas-agora-no-whatsapp.webp
│
├── gas-de-cozinha/index.html           ✅ v1.1.0
├── gas-p45/index.html                  ✅
├── gas-industrial-campo-grande-ms/     ✅
├── agua-mineral-em-campo-grande-ms/    ✅
├── vendas-corporativas/                ✅
├── sobre-a-mosko-gas/                  ✅
├── contato/                            ✅
│
├── disk-gas-em-campo-grande-ms/        ✅
├── gas-entrega-hoje-em-campo-grande-ms/✅
├── gas-mais-proximo-em-campo-grande-ms/✅
├── gas-do-povo-em-campo-grande-ms/     ✅
├── whatsappgas/                        ✅
├── gas-de-empilhadeiras-p20/           ✅
│
├── gas-para-restaurantes/              ✅
├── gas-para-padarias/                  ✅
├── gas-para-hoteis/                    ✅
├── gas-para-condominios/               ✅
├── gas-para-bares/                     ✅
├── gas-para-lavanderias/               ✅
├── gas-para-clinicas/                  ✅
├── gas-para-escolas/                   ✅
├── gas-para-saloes-de-festas/          ✅
├── gas-para-construcao-civil/          ✅
├── gas-industrial-empresas/            ✅
│
├── gas-caranda-bosque/                 ✅
├── gas-estrela-dalva/                  ✅
├── gas-na-mata-do-jacinto/             ✅
├── [+ 72 outras páginas de bairro]     ✅
│
├── blog/
│   ├── index.html                      ✅ Índice blog
│   ├── o-que-e-o-gas-de-cozinha-ou-glp/
│   ├── como-saber-se-o-gas-esta-acabando/
│   ├── onde-instalar-o-gas-de-cozinha/
│   ├── nao-e-so-no-fogao-conheca-3-utilidades-do-gas-de-cozinha/
│   ├── como-utilizar-o-gas-de-cozinha-de-maneira-correta-em-seu-comercio/
│   ├── 5-receitas-para-voce-economizar-gas-de-cozinha/
│   ├── gas-de-cozinha-ou-gas-p45/
│   ├── vantagens-de-utilizar-o-gas-glp/
│   ├── gas-p45-saiba-como-armazenar-cilindro-de-gas/
│   ├── gas-p20-tudo-o-que-voce-precisa-saber-sobre-o-gas-para-empilhadeira/
│   ├── nem-diesel-nem-gasolina-conheca-as-vantagens-do-gas-para-empilhadeira/
│   ├── gas-liquefeito-de-petroleo-glp-a-vantagem-competitiva-para-hoteis-e-pousadas/
│   ├── agua-mineral-com-gas-por-que-servir-no-seu-restaurante/
│   ├── agua-mineral-de-onde-vem-a-agua-que-bebemos/
│   ├── agua-mineral-qual-a-melhor-forma-de-servir-no-meu-estabelecimento/
│   ├── por-que-voce-deve-beber-agua-mineral-e-quais-sao-seus-beneficios/
│   └── o-consumo-de-agua-mineral-e-a-importancia-de-escolher-agua-mineral-de-qualidade-e-segura-para-consumo/
│
└── [NUNCA criar pasta blog/ adicional — blog completo acima]
```

> **NUNCA criar pasta `uploads-wordpress/`** — foi usada durante migração, não deve existir no repo final.

---

## 5. REGRAS E PADRÕES ESTABELECIDOS

### Versionamento HTML
```html
<!--
  pasta/index.html | Versão: X.X.X | Atualizado: AAAA-MM-DD | Descrição: resumo
-->
```
- `1.0.0` → criação inicial
- `1.1.0` → mudança de conteúdo ou seção
- `1.0.1` → correção pequena
- `2.0.0` → redesign completo

### Fotos e imagens
1. Tratar com IA: *"deixe mais bonita, retire sujeiras, deixe as cores mais bonitas"*
2. Converter para `.webp`
3. Commitar em `/images/`
4. Usar `loading="eager"` apenas na imagem do hero; `loading="lazy"` nas demais

### Commits
```bash
git config user.email "luis@moskogas.com.br"
git config user.name "Luis Mosko"
git add .
git commit -m "v1.0.0 /slug/ — descrição curta"
git push origin main
```

### SEO obrigatório em cada página
- `<title>` com keyword + "Campo Grande MS" + diferencial + "| Mosko Gás"
- `<meta description>` ≤160 chars com keyword + preço + autoridade + WhatsApp
- `<h1>` único com `<span style="color:#7EC8FF">keyword</span>`
- `<link rel="canonical">`
- Schema.org `LocalBusiness` + `FAQPage`
- FAQ mínimo 7 perguntas
- Bairros atendidos listados

### Estrutura obrigatória de cada página
```
1. head — meta SEO + canonical + OG + CSS
2. TOPBAR — idêntico
3. NAV — idêntico (só .active muda)
4. HERO — h1 + preços (se tiver) + rating + botões
5. URGÊNCIA — banner laranja, idêntico
6. BADGES — credenciais, idêntico
7. [conteúdo específico]
8. FAQ — accordion, ≥7 perguntas
9. CTA FINAL — azul escuro + btn-wpp
10. FOOTER — idêntico
11. FLOAT WPP — idêntico
12. scripts — FAQ accordion + hambúrguer
13. Schema JSON-LD
```

---

## 6. PLANEJAMENTO FUTURO

### Pendente / Oportunidades

| Prioridade | Ação | Motivo |
|---|---|---|
| 🔴 Alta | Submeter sitemap.xml no Search Console | Indexação das 118 páginas |
| 🔴 Alta | Solicitar indexação das 17 páginas de blog | Blog novo no estático |
| 🟡 Média | Desligar WordPress completamente | Todas páginas migradas |
| 🟡 Média | Adicionar mais posts ao blog | Conteúdo fresco para SEO |
| 🟡 Média | Criar páginas de bairro faltantes | Cobertura completa da cidade |
| 🟢 Baixa | Integração com backend Bling | Preços em tempo real |
| 🟢 Baixa | Formulário de contato estático | Eliminar dependência do WP |

### Integração futura com Mosko APP
O projeto **Mosko APP - Bling Interface** (Claude Project separado) tem:
- Cloudflare Worker `moskogas-backend-v2`
- R2 + D1 + API Bling
- Objetivo: exibir preços em tempo real e processar pedidos no site estático via API

### Novos posts de blog sugeridos
- "Como trocar o botijão de gás com segurança"
- "Gás de cozinha: vale a pena o kit reserva?"
- "Como calcular o consumo de gás do meu restaurante"
- "Gás do Povo em Campo Grande: quem tem direito"
- "Água mineral vs água filtrada: qual escolher"

---

## 7. REFERÊNCIAS RÁPIDAS

### WhatsApp links padrão
```
Pedido geral: https://wa.me/+5567993330303?text=Ol%C3%A1%2C%20quero%20fazer%20um%20pedido%20de%20G%C3%A1s
Urgência: https://wa.me/+5567993330303?text=Ol%C3%A1%2C%20preciso%20de%20g%C3%A1s%20urgente!
```

### Coordenadas geográficas (Schema.org)
```json
"geo": {"@type": "GeoCoordinates", "latitude": -20.4697, "longitude": -54.6201}
```

### Bairros padrão para FAQ (copiar em toda página)
Carandá Bosque, Giocondo Orsi, Estrela Dalva, Autonomista, Vila Rica, Santa Fé, Centro, Jardim dos Estados, Vila Margarida, Novos Estados, Mata do Jacinto, Vila Nascente, Nova Lima, Jardim Presidente, Columbia, Chácara Cachoeira, Monte Castelo, São Francisco, Universitário

### Formas de pagamento (padrão FAQ)
Pix, dinheiro, cartão de crédito e cartão de débito. Pagamento na entrega, sem taxas.

### Google Maps embed (para /contato/)
```
https://www.google.com/maps/place/Mosko+Gás
```

---

## 8. FERRAMENTAS USADAS NO PROJETO

| Ferramenta | Uso |
|---|---|
| Claude AI (bash_tool) | Geração de HTML, scripts Python, commits diretos no GitHub |
| Python 3 | Scripts para geração em lote de páginas de bairro, blog, sitemap |
| GitHub | Controle de versão + trigger do Cloudflare Pages |
| Cloudflare Pages | Hosting estático com CDN global |
| Cloudflare Workers | Roteamento e proxy para WordPress |
| ChatGPT Image | Tratamento de fotos da frota |
| Google Search Console | Indexação e monitoramento |
| PageSpeed Insights | Validação de performance |
