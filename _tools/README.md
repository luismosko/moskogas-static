# 🛠️ Ferramentas de Automação — Mosko Marketing

## google-indexing.py

Script para solicitar indexação via Google Indexing API.

### Configuração (uma vez)

1. **Credenciais:** Obtenha `google-credentials.json` do Google Cloud Console
2. **Coloque na pasta:** `_tools/google-credentials.json`
3. **Search Console:** Adicione `indexing-bot@mosko-marketing.iam.gserviceaccount.com` como **Proprietário**

### Uso

```bash
# Instalar dependências
pip install google-auth google-api-python-client

# Indexar URLs específicas
python google-indexing.py "https://moskogas.com.br/nova-pagina/"

# Indexar múltiplas URLs
python google-indexing.py "url1" "url2" "url3"
```

### Limites

- **200 URLs por dia** (limite do Google)
- Apenas URLs de domínios verificados no GSC

### Sites configurados

Mesma credencial funciona para todos os sites onde o bot é Proprietário:
- moskogas.com.br ✅
- diskgaspertodemim.com.br (adicionar)
- gasdecozinhacampogrande.com.br (adicionar)
- gasp20empilhadeira.com.br (adicionar)

---

**⚠️ IMPORTANTE:** Nunca commitar `google-credentials.json`!
