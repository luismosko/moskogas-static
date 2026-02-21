# INSTRUÇÕES DO PROJETO — moskogas.com.br (Site Estático)
> Atualizado: 2026-02-21 | Versão: 3.0.0

## IDENTIDADE DO PROJETO
Migração do WordPress/Elementor para HTML puro no Cloudflare Pages.
**Meta PageSpeed:** de 75 → 95+ ✅ **ATINGIDO**
**Token GitHub:** `ghp_[TOKEN_NO_PROJETO_CLAUDE]`
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

**Preços atuais:**
- P13 na portaria: **R$ 103,99** (promoção)
- P13 com entrega: **R$ 124,90**

---

## ARQUITETURA

```
Usuário → moskogas.com.br
              ↓
        Cloudflare DNS
              ↓
        Cloudflare Pages (moskogas-static)
              ↓
        _worker.js verifica a rota:
         ├─ Rota em PAGINAS_ESTATICAS? → Serve HTML (RÁPIDO ⚡)
         ├─ Rota em REDIRECTS?         → 301 para página correta
         └─ Rota NÃO listada?          → Proxeia para WordPress
```

**WordPress** continua ativo na HostGator como fallback (legal pages, etc.)

### Infraestrutura

| Componente | Detalhe |
|---|---|
| DNS/CDN | Cloudflare |
| Site estático | Cloudflare Pages — projeto `moskogas-static` |
| WordPress | HostGator — IP: 162.241.62.186 — sh-pro88.hostgator.com.br |
| SSL Cloudflare | **Full** (não Full Strict) |
| WP Admin | moskogas.com.br/acesso-seguro |

### DNS — Registros críticos

| Nome | Tipo | Valor | Proxy |
|---|---|---|---|
| `moskogas.com.br` | A | 162.241.62.186 | ✅ Proxied |
| `origin` | A | 162.241.62.186 | ❌ DNS Only — acesso direto ao WP |
| `www` | CNAME | moskogas.com.br | ✅ Proxied |

> **CRÍTICO:** `origin.moskogas.com.br` deve SEMPRE ser DNS Only (cinza). Nunca Proxied.

---

## STATUS COMPLETO DAS PÁGINAS

### ✅ Páginas Estáticas (118 total)

#### Páginas Principais
- `/` — Home v3.2.0
- `/gas-de-cozinha/` — Gás P13
- `/gas-p45/` — Gás P45 Industrial
- `/gas-industrial-campo-grande-ms/` — Industrial geral
- `/agua-mineral-em-campo-grande-ms/` — Água Mineral
- `/vendas-corporativas/` — B2B
- `/sobre-a-mosko-gas/` — Institucional
- `/contato/` — Contato

#### Páginas de Serviço
- `/disk-gas-em-campo-grande-ms/`
- `/gas-entrega-hoje-em-campo-grande-ms/`
- `/gas-mais-proximo-em-campo-grande-ms/`
- `/gas-do-povo-em-campo-grande-ms/`
- `/whatsappgas/`
- `/gas-de-empilhadeiras-p20/`

#### Páginas por Segmento (corporativo)
- `/gas-para-restaurantes/`
- `/gas-para-padarias/`
- `/gas-para-hoteis/`
- `/gas-para-condominios/`
- `/gas-para-bares/`
- `/gas-para-lavanderias/`
- `/gas-para-clinicas/`
- `/gas-para-escolas/`
- `/gas-para-saloes-de-festas/`
- `/gas-para-construcao-civil/`
- `/gas-industrial-empresas/`

#### Páginas de Bairro (75 páginas)
Carandá Bosque, Estrela Dalva, Mata do Jacinto, Santa Fé, Autonomista, Novos Estados, Monte Castelo, Vila Rica, Vila Nascente, Vila Margarida, Nova Lima, São Francisco, Universitário, Giocondo Orsi, Centro, Jardim dos Estados, Columbia, Chácara Cachoeira, Coronel Antonino, Danúbio Azul, Jardim Veraneio, e ~54 outros bairros.

#### Blog (18 páginas)
- `/blog/` — Índice
- 17 posts sobre gás de cozinha, GLP e água mineral

### ❌ Ainda no WordPress (pode manter)
- `/politica-de-privacidade/`
- `/termos-de-uso-mosko-gas/`
- `/politica-de-cookies/`

### 🔄 Redirects 301 configurados no _worker.js
- Posts antigos com emoji no slug → páginas de bairro estáticas

---

## _WORKER.JS — ESTADO ATUAL v1.9.0

```javascript
const PAGINAS_ESTATICAS = [
  '/',
  '/gas-de-cozinha/',
  '/gas-p45/',
  '/gas-industrial-campo-grande-ms/',
  '/agua-mineral-em-campo-grande-ms/',
  '/vendas-corporativas/',
  '/sobre-a-mosko-gas/',
  '/contato/',
  '/blog/',
  '/blog/[17 posts]...',
  // + 75 páginas de bairro
  // + 11 páginas corporativas
  // + 6 páginas de serviço
];
```

---

## COMO ADICIONAR NOVA PÁGINA

```bash
# 1. Clonar (se não clonado na sessão)
git clone https://ghp_[TOKEN_NO_PROJETO_CLAUDE]@github.com/luismosko/moskogas-static.git
cd moskogas-static

# 2. Criar pasta e HTML baseado no TEMPLATE-PAGINA-MOSKOGAS.html

# 3. Adicionar rota no _worker.js em PAGINAS_ESTATICAS

# 4. Commitar
git config user.email "luis@moskogas.com.br"
git config user.name "Luis Mosko"
git add .
git commit -m "v1.0.0 /slug/ — descrição"
git push origin main
# Cloudflare publica em ~30 segundos
```

---

## VERSIONAMENTO — REGRA OBRIGATÓRIA

```html
<!--
  pasta/index.html | Versão: X.X.X | Atualizado: AAAA-MM-DD | Descrição: resumo
-->
```

---

## IDENTIDADE VISUAL

> **REGRA MÁXIMA:** Topbar, nav, urgência, badges, footer e float-wpp são IDÊNTICOS em todas as páginas.

### CSS Variables
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

**Fonte:** Somente `Inter`. Nunca Montserrat, Roboto ou outras.

**Gradiente hero:**
```css
background: linear-gradient(130deg, #001A4D 0%, #003087 55%, #0055CC 100%);
```

---

## IMAGENS DISPONÍVEIS EM /images/

| Arquivo | Usar em |
|---|---|
| `logo.webp` | Nav de todas as páginas |
| `Gas-24-horas-de-Cozinha.webp` | Hero P13 |
| `entrega.webp` | Seções entrega/sobre |
| `Sobre-a-Mosko-Gas-Distribuidora-(...).webp` | Página Sobre |
| `gas-do-povo-campo-grande-ms.webp` | Seção Gás do Povo |
| `gas-p20-entrega-campo-grande.webp` | P20/Industrial |
| `p45-campo-grande-ms-moskogas-ultragaz.webp` | P45/Industrial |
| `frota-entrega-gas-moskogas.webp` | Frota veículos (IA enhanced) |
| `moto-entrega-gas-moskogas.webp` | Moto entrega (IA enhanced) |
| `Pedir-gas-Whatsaap.webp` | CTAs secundários |
| `pedir-gas-agora-no-whatsapp.webp` | Banners CTA |

**REGRA DE FOTOS:** Antes de subir qualquer foto não tratada, processar com IA: *"deixe mais bonita, retire sujeiras, deixe as cores mais bonitas"*. Depois converter para .webp e commitar.

---

## SEO — ESTRATÉGIA

**Por que perdemos ranking:** ataque de malware em set/2024. Concorrentes com menos backlinks rankeiam por keyword-match no domínio. **Nossa vantagem:** 145 backlinks reais, 350 avaliações 5★, marca registrada, Ultragaz oficial.

**Solução aplicada:** páginas HTML ultra-rápidas, keyword exata no título, preços explícitos, schema.org completo, FAQs para rich snippets, 75 páginas de bairro, 11 páginas de segmento.

### Title Tag
```
[Keyword em Campo Grande MS] — [Diferencial concreto] | Mosko Gás
```

### Schema.org obrigatório
- `LocalBusiness` com preços, horário, avaliações, endereço, coordenadas
- `FAQPage` com todas as perguntas da seção FAQ

### Após cada nova página
Submeter no Google Search Console: Inspeção de URL → Solicitar indexação.

---

## SITEMAP
- **Arquivo:** `sitemap.xml` na raiz (118 URLs)
- **Robots:** `robots.txt` na raiz
- **Submeter em:** Search Console → Índice → Sitemaps

---

## PROJETO RELACIONADO
**Mosko APP - Bling Interface** (Claude Project separado):
- Backend: Cloudflare Worker `moskogas-backend-v2`
- Stack: R2 + D1 + API Bling
- Integração futura: preços em tempo real no site estático
