# 📘 DOCUMENTAÇÃO COMPLETA — moskogas.com.br

**Última atualização:** 28 de março de 2026  
**Versão do site:** 100% estático (WordPress removido em 23/03/2026)  
**Versão do Worker:** 3.0.0

---

## 📊 VISÃO GERAL DO PROJETO

### Status Atual
| Métrica | Valor |
|---------|-------|
| **Total de páginas HTML** | 185 |
| **Páginas de bairros** | 110 |
| **Posts do blog** | 56 |
| **Imagens otimizadas** | 35 |
| **URLs no sitemap** | 181+ |
| **Backlinks** | 167 |
| **Authority Score** | 10 |
| **Avaliações Google** | 350+ ⭐⭐⭐⭐⭐ |

### Infraestrutura
```
┌─────────────────────────────────────────────────────────────────┐
│  ARQUITETURA - SITE 100% ESTÁTICO                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   Usuário → moskogas.com.br                                    │
│                 ↓                                               │
│         Cloudflare DNS (Proxied)                               │
│                 ↓                                               │
│         Cloudflare Pages                                        │
│           (moskogas-static)                                     │
│                 ↓                                               │
│         _worker.js v3.0.0                                       │
│           ├─ 410 Gone → URLs WordPress                          │
│           ├─ 301 Redirect → URLs antigas                        │
│           ├─ Proxy API → api.moskogas.com.br                    │
│           └─ Serve HTML estático                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

| Componente | Tecnologia | Detalhes |
|------------|------------|----------|
| DNS/CDN | Cloudflare | Proxied (laranja) |
| Hospedagem | Cloudflare Pages | projeto `moskogas-static` |
| Repositório | GitHub | `luismosko/moskogas-static` |
| Deploy | Automático | Push → main → 30s |
| SSL | Cloudflare | Full |
| Backend API | Cloudflare Worker | `api.moskogas.com.br` |

---

## 🏢 DADOS DA EMPRESA

| Campo | Valor |
|-------|-------|
| **Razão Social** | Mosko Gás Distribuidora de Gás e Água Mineral |
| **CNPJ** | 12.977.901/0001-17 |
| **Endereço** | Av. Panamericana, 295 – Estrela Dalva – Campo Grande/MS |
| **CEP** | 79034-722 |
| **WhatsApp** | (67) 99333-0303 |
| **Telefone** | (67) 3026-5454 |
| **Horário** | Seg–Sáb 7h às 18h30 |
| **Marca** | Revenda autorizada Ultragaz |
| **Registro** | ANP (Agência Nacional de Petróleo) |
| **INPI** | MoskoGás® — Processo nº 912827599 |
| **Google Merchant ID** | 134264758 |
| **Store Code** | MOSKOGAS-CG |

### Redes Sociais
- **Facebook:** [facebook.com/gasdecozinhaCampoGrandeMosko](https://facebook.com/gasdecozinhaCampoGrandeMosko)
- **Instagram:** [instagram.com/moskogas](https://instagram.com/moskogas)

---

## 💰 PRODUTOS E PREÇOS

### Tabela de Preços Atual

| Produto | Preço | Observação |
|---------|-------|------------|
| **P13 na Portaria** | R$ 103,99 | ⚡ Promoção |
| **P13 com Entrega** | R$ 124,90 | Entrega grátis |
| **P20 Empilhadeira** | R$ 220,00 | Industrial |
| **P45 Industrial** | R$ 495,00 | Restaurantes/Empresas |
| **Água 20L** | R$ 25,00 | Galão retornável |

### Google Merchant Center Feed
- **Arquivo:** `products.xml`
- **Produtos cadastrados:** 5 (P13-Portaria, P13-Entrega, P20, P45, Água 20L)
- **Página de destino:** `/loja/` com seleção automática via `?produto=`

---

## 📁 ESTRUTURA DO REPOSITÓRIO

```
moskogas-static/
│
├── 📄 index.html                          ✅ v3.3.2 — Home
├── 📄 _worker.js                          ✅ v3.0.0 — Roteador
├── 📄 wrangler.jsonc                      ✅ Config Cloudflare
├── 📄 sitemap.xml                         ✅ 181+ URLs
├── 📄 robots.txt                          ✅ Otimizado
├── 📄 products.xml                        ✅ Google Merchant Feed
├── 📄 BingSiteAuth.xml                    ✅ Verificação Bing
│
├── 📁 images/                             35 imagens WebP/PNG
│   ├── logo.webp                          Logo (160x50)
│   ├── Gas-24-horas-de-Cozinha.webp       P13 hero
│   ├── gas-p45-botijao-*.webp             P45 produtos
│   ├── gas-p20-*.webp                     P20 empilhadeira
│   ├── galao-20-litros-*.webp             Água mineral
│   └── ...
│
├── 📁 gas-de-cozinha/                     ✅ v1.8.0 — P13
├── 📁 gas-p45/                            ✅ v2.0.0 — P45 Industrial
├── 📁 gas-de-empilhadeiras-p20/           ✅ P20 Empilhadeira
├── 📁 gas-industrial-campo-grande-ms/     ✅ Página industrial
├── 📁 agua-mineral-em-campo-grande-ms/    ✅ Água mineral
├── 📁 vendas-corporativas/                ✅ v1.2.0 — B2B
├── 📁 sobre-a-mosko-gas/                  ✅ Institucional
├── 📁 contato/                            ✅ Formulário/mapa
├── 📁 loja/                               ✅ v2.3.0 — E-commerce
│
├── 📁 blog/                               56 posts HTML
│   ├── index.html                         v1.0.0 — Índice
│   ├── gas-de-cozinha-preco-p13-*/        
│   ├── como-identificar-vazamento-*/      
│   └── ...
│
├── 📁 bairros/                            Hub de bairros
├── 📁 gas-[BAIRRO]/                       110 páginas de bairros
│   ├── gas-autonomista/
│   ├── gas-caranda-bosque/
│   ├── gas-centro/
│   ├── gas-estrela-dalva/
│   ├── gas-giocondo-orsi/
│   ├── gas-jardim-dos-estados/
│   └── ... (107 mais)
│
├── 📁 gas-para-[SEGMENTO]/                12 páginas B2B
│   ├── gas-para-restaurantes/
│   ├── gas-para-padarias/
│   ├── gas-para-hoteis/
│   ├── gas-para-condominios/
│   ├── gas-para-clinicas/
│   ├── gas-para-escolas/
│   ├── gas-para-lavanderias/
│   ├── gas-para-bares/
│   ├── gas-para-saloes-de-festas/
│   ├── gas-para-construcao-civil/
│   └── ...
│
├── 📁 Páginas SEO/                        
│   ├── disk-gas-em-campo-grande-ms/
│   ├── entrega-de-gas-campo-grande-ms/
│   ├── gas-aberto-agora-campo-grande/
│   ├── gas-mais-proximo-em-campo-grande-ms/
│   ├── gas-perto-de-mim-campo-grande/
│   ├── preco-gas-campo-grande-ms/
│   ├── botijao-de-gas/
│   └── ...
│
├── 📁 Páginas legais/
│   ├── politica-de-privacidade/
│   ├── politica-de-cookies/
│   ├── politica-de-troca/
│   └── termos-de-uso-mosko-gas/
│
└── 📁 glossario/                          1 página ativa
    └── o-que-e-botijao-de-gas-glp/
```

---

## 🖼️ IMAGENS DISPONÍVEIS

### Produtos
| Arquivo | Uso | Dimensão |
|---------|-----|----------|
| `Gas-24-horas-de-Cozinha.webp` | Hero P13 | 380x316 |
| `gas-p13-botijao-campo-grande-moskogas.webp` | Produto P13 | - |
| `gas-p20-botijao-campo-grande-moskogas.webp` | Produto P20 | - |
| `gas-p20-hero.webp` | Hero P20 | - |
| `gas-p45-botijao-campo-grande-moskogas.webp` | Produto P45 | - |
| `p45-campo-grande-ms-moskogas-ultragaz.webp` | Hero P45 | - |
| `gas-p45-campo-grande-ms-moskogas.webp` | P45 alternativo | - |
| `gas-industrial-p45-p20-campo-grande-moskogas.webp` | Industrial | - |
| `empilhadeira-gas-p20-campo-grande-ms.webp` | Empilhadeira | - |
| `gasp20-campo-grande-ms-ultragaz.webp` | P20 Ultragaz | - |

### Água Mineral
| Arquivo | Uso |
|---------|-----|
| `galao-20-litros-agua-mineral-campo-grande-moskogas.webp` | Galão 20L |
| `galao-5-litros-agua-mineral-campo-grande-moskogas.webp` | Galão 5L |
| `copo-200ml-agua-mineral-campo-grande-moskogas.webp` | Copo 200ml |
| `garrafa-500ml-sem-gas-agua-mineral-campo-grande-moskogas.webp` | Garrafa 500ml |
| `garrafa-500ml-com-gas-agua-mineral-campo-grande-moskogas.webp` | Garrafa c/ gás |
| `garrafa-1-5-litros-com-gas-agua-mineral-campo-grande-moskogas.webp` | Garrafa 1,5L |
| `agua-mineral-linha-completa-campo-grande-moskogas.webp` | Linha completa |

### Institucional
| Arquivo | Uso |
|---------|-----|
| `logo.webp` | Nav (160x50) |
| `logo-square.webp` | Quadrado |
| `logo-square.png` | PNG quadrado |
| `logo-square-1000.png` | Alta resolução |
| `Sobre-a-Mosko-Gas-Distribuidora-de-Gas-e-Agua-Mineral-em-Campo-Grande-MS.webp` | Página Sobre |
| `sobre-mosko-gas-distribuidora-campo-grande.webp` | Sobre alternativo |
| `fachada-mosko-gas-campo-grande-ms.webp` | Fachada loja |
| `interior-planta-gas-moskogas-campo-grande.webp` | Interior |
| `frota-entrega-gas-moskogas.webp` | Frota |
| `moto-entrega-gas-moskogas.webp` | Moto entrega |
| `entrega.webp` | Entrega genérico |
| `entrega-gas-bairro-campo-grande.webp` | Entrega bairro |

### Banners/CTAs
| Arquivo | Uso |
|---------|-----|
| `Pedir-gas-Whatsaap.webp` | Ilustração WPP |
| `pedir-gas-agora-no-whatsapp.webp` | CTA WPP |
| `banner-produtos-moskogas.webp` | Banner produtos |
| `por-que-escolher-moskogas-campo-grande.webp` | Diferenciais |
| `gas-do-povo-campo-grande-ms.webp` | Gás do Povo |

---

## 🎨 IDENTIDADE VISUAL

### Variáveis CSS
```css
:root {
  /* Cores principais */
  --azul: #003087;
  --azul-medio: #0055CC;
  --azul-claro: #E8F0FD;
  --verde-wpp: #25D366;
  --laranja: #FF6B00;
  
  /* Neutros */
  --cinza-bg: #F4F6FA;
  --cinza-texto: #333;
  --cinza-sub: #666;
  --borda: #E0E7F3;
  --footer-bg: #001A4D;
  
  /* Bordas */
  --radius: 14px;
  --radius-btn: 50px;
}
```

### Gradiente Hero
```css
background: linear-gradient(130deg, #001A4D 0%, #003087 55%, #0055CC 100%);
```

### Tipografia
- **Fonte única:** Inter (Google Fonts)
- **Pesos:** 400, 500, 600, 700, 800, 900
- **Link:** `https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap`

### Classes de Botão
| Classe | Local | Aparência |
|--------|-------|-----------|
| `.btn-wpp` | CTAs principais | Verde #25D366, pill, ícone SVG |
| `.btn-outline` | Hero secundário | Transparente, borda branca |
| `.n-wpp` | Nav desktop | Verde, sem ícone |
| `.t-wpp` | Topbar | Verde com ícone WPP |
| `.t-tel` | Topbar | Borda branca semi-transparente |

### Estrutura Padrão de Página
```
1.  <head>      → meta SEO + canonical + OG + Schema + CSS
2.  TOPBAR      → idêntico em todas (não alterar)
3.  NAV         → idêntico (só .active muda)
4.  HERO        → h1 + preços + rating + botões
5.  URGÊNCIA    → banner laranja (não alterar)
6.  BADGES      → faixa cinza (não alterar)
7.  [Seções específicas]
8.  FAQ         → accordion, mín. 7 perguntas
9.  CTA FINAL   → seção azul escuro
10. FOOTER      → idêntico (não alterar)
11. FLOAT WPP   → botão flutuante (não alterar)
12. <script>    → FAQ + hambúrguer
13. Schema      → LocalBusiness + FAQPage
```

---

## 🔍 SEO — ESTRATÉGIA

### Métricas SEMrush (Mar/2026)
| Métrica | Mosko Gás | Status |
|---------|-----------|--------|
| Authority Score | 10 | 🟢 Crescendo |
| Visibilidade na IA | 20 | 🟡 Melhorando |
| Site Health | 94% | 🟢 Ótimo |
| Tráfego Orgânico | 826 | 🟡 Recuperando |
| Palavras-chave | 790 | 🟢 Crescendo |
| Backlinks | 167 | 🟢 +9,87% |
| Domínios de Ref. | 86 | 🟢 Estável |

### Principais Concorrentes
| Domínio | Keywords | Tráfego | Authority |
|---------|----------|---------|-----------|
| gaspajobu.com | 19,6K | 38K | 36 |
| **moskogas.com.br** | **765** | **826** | **10** |
| supergasdobrasil.com.br | 307 | 843 | 9 |
| gascampogrande.com.br | - | 843 | 9 |
| diskgaspertodemim.com.br | 20 | 86 | 11 |

### Title Tag — Fórmula
```
[Keyword Principal em Campo Grande MS] — [Diferencial] | Mosko Gás
```

**Exemplos:**
- `Gás de Cozinha em Campo Grande MS — Botijão P13 R$ 103,99 | Mosko Gás`
- `Gás P45 Industrial em Campo Grande MS — Ultragaz | Mosko Gás`
- `Água Mineral em Campo Grande MS — Entrega Rápida | Mosko Gás`

### Meta Description — Elementos
1. Keyword principal
2. Preço (quando aplicável)
3. Autoridade ("350 avaliações 5★" ou "Revenda Ultragaz")
4. WhatsApp ou telefone
5. Máx 160 caracteres

### H1 — Estrutura
```html
<h1><span>Keyword em Campo Grande</span> — Complemento</h1>
```
- `<span>` em `color: #7EC8FF` (fundo escuro)
- Uma única H1 por página

### FAQs — Perguntas Obrigatórias
1. Qual o preço de [produto] em Campo Grande?
2. Qual o horário de atendimento?
3. Quais bairros vocês atendem?
4. [Produto] vem lacrado e com nota fiscal?
5. Quais formas de pagamento?
6. Como fazer o pedido?
7. A Mosko Gás é revenda autorizada?

### Schema.org — Obrigatório
- **LocalBusiness** (nome, endereço, horário, avaliações, geo)
- **FAQPage** (todas as perguntas da seção)
- **Product** (nas páginas de produto com preço)

---

## 📍 BAIRROS ATENDIDOS

### Lista Completa (110 páginas)
```
Aero Rancho, Aeroporto, Alves Pereira, Amambai, América, Autonomista,
Bandeirantes, Batistão, Bela Vista, Cabreúva, Caiçara, Carada,
Carandá Bosque, Carlota, Carvalho, Centenário, Centro, Centro Oeste,
Chácara Cachoeira, Chácara das Mansões, Columbia, Conj. Aero Rancho,
Conj. Estrela do Sul, Conj. José Abrão, Conj. Mata Jacinto, Coophafe,
Coophasul, Coophatrabalho, Coophavila II, Coronel Antonino, Cruzeiro,
Doutor Albuquerque, Estrela Dalva, Giocondo Orsi, Glória, Guanandi,
Guanandi II, Itanhangá, Itanhangá Park, Jacy, Jardim Aero Rancho,
Jardim Aeroporto, Jardim América, Jardim Bela Vista, Jardim Campo Alto,
Jardim Centenário, Jardim Columbia, Jardim dos Estados, Jardim Imá,
Jardim Itamaracá, Jardim Jacy, Jardim Jóquei Club, Jardim Leblon,
Jardim Monte Líbano, Jardim Monumento, Jardim Morena, Jardim Nhanhá,
Jardim Noroeste, Jardim Parati, Jardim Paulista, Jardim Presidente,
Jardim Santa Emília, Jardim São Bento, Jardim São Conrado, 
Jardim São Lourenço, Jardim Tarumã, Jardim Tijuca, Jardim Veraneio,
Jardim Zé Pereira, Jóquei Club, Lageado, Lar Trabalhador, Los Angeles,
Maria Aparecida, Mata do Jacinto, Monte Castelo, Nova Lima, Novos Estados,
Santa Fé, São Francisco, Universitário, Vila Margarida, Vila Nascente,
Vila Rica, Vivendas do Bosque, Alphaville, Damha, Futurista
```

### Condomínios Fechados Atendidos
- Alphaville Campo Grande
- Damha I e II
- Futurista

---

## 📝 BLOG — 56 POSTS

### Categorias
| Categoria | Quantidade |
|-----------|------------|
| Gás de Cozinha | 15 |
| Gás Industrial | 12 |
| Água Mineral | 8 |
| Segurança | 7 |
| Dicas/Economia | 8 |
| Institucional | 6 |

### Posts Mais Importantes (SEO)
1. `/blog/gas-de-cozinha-preco-p13-campo-grande/`
2. `/blog/como-identificar-vazamento-de-gas/`
3. `/blog/quanto-custa-botijao-de-gas-completo/`
4. `/blog/quanto-dura-botijao-p13/`
5. `/blog/gas-entrega-urgente-campo-grande/`
6. `/blog/p13-p20-p45-qual-botijao-escolher/`
7. `/blog/gas-p45-saiba-como-armazenar-cilindro-de-gas/`
8. `/blog/gas-para-restaurante-p45-ou-p20/`

---

## ⚙️ WORKER — FUNCIONALIDADES

### Versão: 3.0.0 (23/03/2026)

#### 1. 410 Gone (URLs WordPress)
```javascript
PREFIXOS_410_GONE = [
  '/wp-content/', '/wp-includes/', '/wp-admin/', '/wp-json/',
  '/.env', '/.git', '/.htaccess', '/phpmyadmin', '/admin/', ...
]
ARQUIVOS_410_GONE = [
  '/xmlrpc.php', '/wp-login.php', '/wp-cron.php', ...
]
```

#### 2. Redirects 301
- URLs quebradas → URLs corretas
- Glossário → Páginas produto
- URLs antigas → URLs novas

#### 3. Proxy API
```javascript
// POST /api/pub/pedido-site → api.moskogas.com.br
```

#### 4. Servir HTML Estático
- 181 páginas mapeadas
- Arquivos estáticos (webp, js, css, pdf)

---

## 🚀 FLUXO DE TRABALHO

### Adicionar Nova Página
```bash
# 1. Clonar repositório
git clone https://TOKEN@github.com/luismosko/moskogas-static.git
cd moskogas-static

# 2. Criar pasta e index.html
mkdir nome-da-pagina
# Copiar de TEMPLATE-PAGINA.html e preencher

# 3. Adicionar rota no _worker.js
# Adicionar '/nome-da-pagina/' no array PAGINAS_ESTATICAS

# 4. Atualizar sitemap.xml

# 5. Commit e push
git add .
git commit -m "v1.0.0 /nome-da-pagina/ — descrição"
git push origin main

# 6. Cloudflare publica em ~30 segundos

# 7. Submeter no Google Search Console
```

### Versionamento
```html
<!--
  pasta/index.html | Versão: X.X.X | Atualizado: AAAA-MM-DD | Descrição: resumo
-->
```

### Configuração Git
```bash
git config user.email "luis@moskogas.com.br"
git config user.name "Luis Mosko"
```

---

## 📈 INTEGRAÇÕES

### Google
- **Search Console:** Verificado ✅
- **Analytics:** GA4 configurado
- **Merchant Center:** ID 134264758
- **Meu Negócio:** Verificado

### Bing
- **Webmaster Tools:** Verificado (BingSiteAuth.xml)

### Cloudflare
- **Pages:** Deploy automático
- **Workers:** Roteamento + API proxy
- **SSL:** Full

---

## 🔗 RECURSOS

### Repositório
- **URL:** https://github.com/luismosko/moskogas-static
- **Branch:** main
- **Token:** Arquivo `token_github.txt` no projeto

### Documentação Interna
| Arquivo | Conteúdo |
|---------|----------|
| `INSTRUCOES-PROJETO.md` | Instruções originais |
| `INSTRUCOES-PROJETO-MOSKOGAS.md` | Versão expandida |
| `MANUAL-PROJETO-MOSKOGAS.md` | Manual completo |
| `DOCUMENTACAO-SITE-MOSKOGAS.md` | Este documento |

### URLs Importantes
| URL | Descrição |
|-----|-----------|
| https://moskogas.com.br | Site principal |
| https://moskogas.com.br/loja/ | E-commerce |
| https://moskogas.com.br/sitemap.xml | Sitemap |
| https://moskogas.com.br/products.xml | Feed Google Merchant |

---

## 📞 CONTATOS

| Canal | Informação |
|-------|------------|
| **WhatsApp Business** | (67) 99333-0303 |
| **Telefone Fixo** | (67) 3026-5454 |
| **E-mail** | contato@moskogas.com.br |
| **Endereço** | Av. Panamericana, 295 – Estrela Dalva |

---

## 📋 ÚLTIMAS ATUALIZAÇÕES

### Março 2026
- ✅ **23/03** — WordPress removido, site 100% estático
- ✅ **22/03** — Menu corrigido (P20 e P45 separados) em 64 páginas
- ✅ **22/03** — Botão COMPRAR com auto-seleção na loja
- ✅ **18/03** — Blog índice criado (56 posts)
- ✅ **17/03** — Link para hub /bairros/ na home

### Fevereiro 2026
- ✅ Páginas de segmentos comerciais (12 páginas)
- ✅ Products.xml para Google Merchant Center
- ✅ Schema Product completo

---

**Documentação gerada em:** 28/03/2026  
**Por:** Claude (Anthropic AI)  
**Para:** Luis Mosko — Mosko Gás
