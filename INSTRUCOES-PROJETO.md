
---

## BLOCOS OBRIGATÓRIOS EM TODAS AS PÁGINAS (ATUALIZAÇÃO)

> Regra adicionada em 2026-02-20. Aplicar em todas as páginas novas e nas revisões das existentes.

### 1. LINKAGEM INTERNA — obrigatório

Toda menção a um produto ou serviço deve virar um link para a respectiva página:

| Quando mencionar... | Linkar para |
|---|---|
| "gás de cozinha", "botijão P13", "P13" | `/gas-de-cozinha/` |
| "gás P45", "botijão 45kg", "industrial" | `/gas-industrial-campo-grande-ms/` |
| "gás P20", "empilhadeira" | `/gas-de-empilhadeiras-p20/` |
| "água mineral" | `/agua-mineral-em-campo-grande-ms/` |
| "vendas corporativas", "empresas", "frotista" | `/vendas-corporativas/` |
| "Disk Gás", "gás urgente" | `/disk-gas-em-campo-grande-ms/` |
| "Gás do Povo" | `/gas-do-povo-em-campo-grande-ms/` |
| nome de bairro atendido | página do bairro (ver slugs abaixo) |

**Slugs dos bairros para linkagem:**
```
/gas-caranda-bosque/
/gas-no-giocondo-orsi/
/gas-estrela-dalva/
/gas-no-autonomista/
/gas-novos-estados/
/gas-nova-lima/
/gas-na-mata-do-jacinto/
/gas-santa-fe/
/gas-chacara-cachoeira/
/gas-no-futurista/
/gas-no-damha/
/gas-no-alphaville/
/gas-vivendas-do-bosque/
```

Regra: se a página do bairro ainda não existir no estático, linkar mesmo assim (WordPress responde no fallback do worker).

---

### 2. SEÇÃO DE AVALIAÇÕES GOOGLE — obrigatório

Deve aparecer em todas as páginas, preferencialmente após as seções de produto/como funciona, antes do FAQ.

```html
<!-- AVALIAÇÕES GOOGLE -->
<section class="depoimentos" style="padding:60px 20px;background:var(--cinza-bg)">
  <div class="container" style="text-align:center">
    <h2 class="section-title">O que os clientes dizem da Mosko Gás</h2>
    <p class="section-sub">+350 avaliações reais no Google</p>
    <!-- google-badge + 3 review-cards — ver código completo na seção depoimentos da home -->
  </div>
</section>
```

Usar 3 review cards com nomes reais e textos reais (buscar no Google Maps). Background `var(--cinza-bg)`.

---

### 3. SEÇÃO DE BAIRROS COM LINKS — obrigatório

Substituir as `.regiao-tag` simples por `<a>` com href para a página do bairro:

```html
<a href="/gas-caranda-bosque/" class="regiao-tag">Carandá Bosque</a>
<a href="/gas-estrela-dalva/" class="regiao-tag">Estrela Dalva</a>
<!-- etc -->
```

Se o bairro não tiver página própria, ainda assim incluir a tag (sem href ou com href para `/gas-de-cozinha/`).

---

### 4. MAPA GOOGLE MAPS — obrigatório, carregamento lazy

**Posição:** Logo antes do footer, depois do CTA final. Sempre o último bloco de conteúdo.

**Regra de performance:** NUNCA carregar o iframe diretamente. Usar o padrão click-to-load:

```html
<!-- MAPA — sempre no final, lazy load obrigatório -->
<section class="mapa-section" style="background:#fff;padding:40px 20px 0">
  <div class="container" style="text-align:center">
    <h2 class="section-title" style="margin-bottom:8px">Onde estamos</h2>
    <p style="color:var(--cinza-sub);font-size:15px;margin-bottom:20px">
      Av. Panamericana, 295 – Estrela Dalva – Campo Grande/MS
    </p>
    <div id="mapa-container" style="width:100%;max-width:900px;margin:0 auto;border-radius:var(--radius);overflow:hidden;border:1.5px solid var(--borda);cursor:pointer;background:var(--cinza-bg);height:350px;display:flex;align-items:center;justify-content:center" onclick="carregarMapa()">
      <div style="text-align:center">
        <div style="font-size:40px;margin-bottom:12px">📍</div>
        <p style="font-weight:700;color:var(--azul);font-size:16px">Ver no Google Maps</p>
        <p style="color:var(--cinza-sub);font-size:13px">Clique para carregar o mapa</p>
      </div>
    </div>
  </div>
</section>
<script>
function carregarMapa(){
  document.getElementById('mapa-container').innerHTML='<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3738.34!2d-54.6400!3d-20.4550!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjDCsDI3JzE4LjAiUyA1NMKwMzgnMjQuMCJX!5e0!3m2!1spt!2sbr!4v1" width="100%" height="350" style="border:0" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>';
}
</script>
```

---

### 5. LINKS INTERNOS NO RODAPÉ DE CADA SEÇÃO — recomendado

Ao final de seções relevantes, adicionar um bloco de "Veja também":

```html
<div style="margin-top:28px;padding-top:20px;border-top:1px solid var(--borda);display:flex;flex-wrap:wrap;gap:10px;justify-content:center">
  <span style="font-size:13px;color:var(--cinza-sub);font-weight:600">Veja também:</span>
  <a href="/gas-de-cozinha/" style="font-size:13px;color:var(--azul-medio);font-weight:600">Gás de Cozinha P13</a>
  <a href="/gas-industrial-campo-grande-ms/" style="font-size:13px;color:var(--azul-medio);font-weight:600">Gás P45 e P20</a>
  <a href="/disk-gas-em-campo-grande-ms/" style="font-size:13px;color:var(--azul-medio);font-weight:600">Disk Gás Urgente</a>
</div>
```

---

### ORDEM FINAL OBRIGATÓRIA DE SEÇÕES (atualizada)

```
1.  <head>           → meta SEO + canonical + OG + Schema + CSS
2.  TOPBAR           → idêntico (não alterar)
3.  NAV              → idêntico (só .active muda)
4.  HERO             → h1 + keyword + preços (se tiver) + rating + botões WPP
5.  URGÊNCIA         → banner laranja (não alterar)
6.  BADGES           → faixa credenciais (não alterar)
7.  [seções específicas do produto/serviço com links internos]
8.  AVALIAÇÕES       → google-badge + 3 review-cards reais (bg cinza-bg)
9.  BAIRROS          → regiao-tags com <a href="/gas-BAIRRO/"> (bg branco ou cinza-bg)
10. FAQ              → accordion mín. 7 perguntas (bg branco)
11. CTA FINAL        → gradiente azul + btn-wpp
12. MAPA             → click-to-load iframe, último bloco antes do footer
13. FOOTER           → idêntico (não alterar)
14. FLOAT WPP        → idêntico (não alterar)
15. <script>         → FAQ + hamburger + carregarMapa()
16. Schema JSON-LD   → LocalBusiness + FAQPage
```

---

## CORREÇÃO APLICADA EM 2026-02-20

- Substituir "Na sua porta" por **"Na sua casa"** em todos os cards de preço de entrega
- Mapa Google Maps: usar iframe com `loading="lazy"` nativo (não click-to-load) — carrega ao rolar, não pesa no LCP, e mantém o sinal geográfico para SEO local
- Avaliações (review-cards): sempre adaptar os textos para referenciar o produto/serviço da página em questão

### Código padrão do mapa (iframe lazy nativo — substituir o click-to-load)
```html
<section class="mapa-section" style="background:#fff;padding:40px 20px">
  <div class="container" style="text-align:center">
    <h2 class="section-title" style="margin-bottom:8px">Onde estamos</h2>
    <p style="color:var(--cinza-sub);font-size:15px;margin-bottom:20px">
      Av. Panamericana, 295 – Estrela Dalva – Campo Grande/MS
    </p>
    <div style="width:100%;max-width:900px;margin:0 auto;border-radius:var(--radius);overflow:hidden;border:1.5px solid var(--borda)">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3738.34!2d-54.64003!3d-20.45500!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9486e9271f3df10d%3A0x5c53b1e81df51e02!2sMosko%20G%C3%A1s!5e0!3m2!1spt-BR!2sbr!4v1"
        width="100%" height="350" style="border:0;display:block"
        allowfullscreen="" loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
        title="Mosko Gás — Localização em Campo Grande MS">
      </iframe>
    </div>
  </div>
</section>
```

### Regra de imagem padrão (hero)
- **Imagem padrão do hero:** `/images/Gas-24-horas-de-Cozinha.webp` — usar SEMPRE que não houver imagem específica
- `entrega.webp` — apenas em seções internas ("como funciona", "sobre"), NUNCA no hero
- Imagens corretas por tipo de página:
  | Página | Hero |
  |---|---|
  | Gás cozinha, P13, disk gás, entrega hoje, mais próximo | `Gas-24-horas-de-Cozinha.webp` |
  | Gás P45 / industrial | `p45-campo-grande-ms-moskogas-ultragaz.webp` |
  | Gás P20 / empilhadeiras | `gas-p20-entrega-campo-grande.webp` |
  | Água mineral | `Pedir-gas-Whatsaap.webp` ou URL do WP |
  | Sobre / institucional | `Sobre-a-Mosko-Gas-Distribuidora-(...).webp` |
  | Gás do Povo | `gas-do-povo-campo-grande-ms.webp` |
