#!/usr/bin/env python3
"""
Google Indexing API — Mosko Marketing
Solicita indexação de URLs em lote no Google Search Console

Uso:
  python google-indexing.py                    # Indexa lista padrão
  python google-indexing.py url1 url2 url3    # Indexa URLs específicas

Pré-requisitos:
  1. pip install google-auth google-api-python-client
  2. Arquivo google-credentials.json na mesma pasta
  3. Conta de serviço como Proprietário no GSC

Limite: 200 URLs por dia
"""

import sys
import os

try:
    from google.oauth2 import service_account
    from googleapiclient.discovery import build
except ImportError:
    print("❌ Bibliotecas não instaladas!")
    print("   Execute: pip install google-auth google-api-python-client")
    sys.exit(1)

SCOPES = ["https://www.googleapis.com/auth/indexing"]
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
CREDENTIALS_FILE = os.path.join(SCRIPT_DIR, "google-credentials.json")

def indexar_url(service, url):
    body = {"url": url, "type": "URL_UPDATED"}
    try:
        service.urlNotifications().publish(body=body).execute()
        print(f"✅ {url}")
        return True
    except Exception as e:
        print(f"❌ {url} — {str(e)[:100]}")
        return False

def main():
    if not os.path.exists(CREDENTIALS_FILE):
        print(f"❌ Arquivo não encontrado: google-credentials.json")
        print(f"   Coloque na pasta: {SCRIPT_DIR}")
        sys.exit(1)
    
    credentials = service_account.Credentials.from_service_account_file(
        CREDENTIALS_FILE, scopes=SCOPES
    )
    service = build("indexing", "v3", credentials=credentials, cache_discovery=False)
    
    urls = sys.argv[1:] if len(sys.argv) > 1 else []
    
    if not urls:
        print("Uso: python google-indexing.py URL1 URL2 ...")
        print("     Passe as URLs como argumentos.")
        sys.exit(0)
    
    print(f"\n🚀 Indexando {len(urls)} URLs...\n")
    sucesso = sum(1 for url in urls if indexar_url(service, url))
    print(f"\n📊 {sucesso}/{len(urls)} sucesso | Limite: 200/dia")

if __name__ == "__main__":
    main()
