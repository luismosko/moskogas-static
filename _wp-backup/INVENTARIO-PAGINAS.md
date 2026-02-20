# INVENTÁRIO COMPLETO DE PÁGINAS — moskogas.com.br
Fonte: WordPress Admin → Páginas (34 publicadas + 1 rascunho)
Atualizado: 2026-02-20

## LEGENDA
- ✅ EST = Convertida para HTML estático (Cloudflare Pages)
- ⚠️ WP  = Ainda no WordPress (proxy via worker)
- 🔒 WP  = Fica no WordPress para sempre (não converter)
- ❓     = Verificar URL

---

## PÁGINAS PRINCIPAIS (nav)
| Título WP | URL | Status |
|---|---|---|
| Home | / | ✅ EST v3.2.0 |
| Gás de Cozinha | /gas-de-cozinha/ | ✅ EST v1.1.0 |
| Gás Industrial P45 e P20 | /gas-industrial-campo-grande-ms/ | ✅ EST v2.2.0 |
| Gás P45 | /gas-p45/ | ✅ EST v1.0.0 |
| Água Mineral em Campo Grande MS | /agua-mineral-em-campo-grande-ms/ | ✅ EST v2.1.0 |
| Vendas Corporativas | /vendas-corporativas/ | ✅ EST v2.2.0 |
| Sobre a Mosko Gás | /sobre-a-mosko-gas/ | ✅ EST v2.7.0 |
| Contato | /contato/ | ✅ EST v1.0.0 |

---

## PÁGINAS DE PRODUTO / KEYWORD (WP — converter com prioridade)
| Título WP | URL provável | Prioridade |
|---|---|---|
| Gás do Povo em Campo Grande – MS | /gas-do-povo-em-campo-grande-ms/ | 🔴 Alta |
| Disk Gás em Campo Grande MS | /disk-gas-em-campo-grande-ms/ | 🔴 Alta |
| Gás Entrega hoje em Campo Grande MS | /gas-entrega-hoje-em-campo-grande-ms/ | 🔴 Alta |
| Gás no WhatsApp (67) 99333-0303 | /whatsappgas/ | 🔴 Alta |
| Gás mais Próximo em Campo Grande MS | /gas-mais-proximo-em-campo-grande-ms/ | 🟡 Média |
| Gás de Empilhadeiras P20 | /gas-de-empilhadeiras-p20/ | 🟡 Média |
| EMPILHADEIRA A GÁS: PRINCIPAIS CUIDADOS | /empilhadeira-a-gas-principais-cuidados/ | 🟢 Baixa |
| Glossário sobre Gás e Água Mineral | /glossario-sobre-gas-e-agua-mineral/ | 🟢 Baixa |

---

## PÁGINAS DE BAIRRO (WP — converter em lote)
| Título WP | URL provável |
|---|---|
| Gás no Carandá Bosque – Entrega Rápida | /gas-carandá-bosque/ ❓ |
| Gás no Giocondo Orsi – Entrega Rápida | /gas-giocondo-orsi/ ❓ |
| Gás no Autonomista | /gas-autonomista/ ❓ |
| Gás Estrela Dalva – Entrega Rápida | /gas-estrela-dalva/ |
| Gás Novos Estados – Entrega Rápida | /gas-novos-estados/ |
| Gás Nova Lima – Entrega Rápida | /gas-nova-lima/ ❓ |
| Gás na Mata do Jacinto | /gas-mata-do-jacinto/ ❓ |
| Gás Santa Fé – Entrega Rápida | /gas-santa-fe/ ❓ |
| Gás no Alphaville – Entrega Rápida | /gas-alphaville/ ❓ |
| Gás no Damha – Entrega Rápida | /gas-no-damha/ |
| Gás no Futurista – Entrega Rápida | /gas-futurista/ ❓ |
| Gás no Chácara Cachoeira – Entrega Rápida | /gas-chacara-cachoeira/ ❓ |
| Gás no Vivendas do Bosque | /gas-vivendas-do-bosque/ |

---

## PÁGINAS LEGAIS (WP — baixa prioridade)
| Título WP | URL |
|---|---|
| Política de Privacidade | /politica-de-privacidade/ |
| Termos de Uso – Mosko Gás | /termos-de-uso-mosko-gas/ |
| Política de Cookies | /politica-de-cookies/ |

---

## PÁGINAS QUE FICAM NO WORDPRESS (não converter)
| Título WP | Motivo |
|---|---|
| Blog | Sempre no WP |
| Local Portfolio | Interno |
| Home (WP) | Substituída pela estática |

---

## ORDEM DE CONVERSÃO RECOMENDADA
### Fase 1 — Keywords de alto tráfego
1. /disk-gas-em-campo-grande-ms/
2. /gas-entrega-hoje-em-campo-grande-ms/
3. /whatsappgas/
4. /gas-do-povo-em-campo-grande-ms/
5. /gas-mais-proximo-em-campo-grande-ms/

### Fase 2 — Produtos
6. /gas-de-empilhadeiras-p20/

### Fase 3 — Bairros (lote — 13 páginas)
7-19. Todas as páginas de bairro

### Fase 4 — Legais (opcional)
20-22. Privacidade, Termos, Cookies

---
## REGRA: FLUXO OBRIGATÓRIO ANTES DE QUALQUER CONVERSÃO
1. fetch da página no WP → salvar em _wp-backup/slug.md
2. Adaptar ao template → mostrar PREVIEW aqui no chat
3. Aguardar APROVAÇÃO do Luis
4. Só então commitar e ativar rota no worker
