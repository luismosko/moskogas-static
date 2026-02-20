@echo off
echo Baixando imagens do moskogas.com.br...
mkdir images 2>nul

curl -o "images\botijao-gas-ultragaz-p13-campo-grande-ms.webp" "https://moskogas.com.br/wp-content/uploads/2024/12/botijao-gas-ultragaz-p13-campo-grande-ms.webp"
curl -o "images\gas-p20-empilhadeira-campo-grande-ms.webp" "https://moskogas.com.br/wp-content/uploads/2024/12/gas-p20-empilhadeira-campo-grande-ms.webp"
curl -o "images\gas-p45-campo-grande-ms.webp" "https://moskogas.com.br/wp-content/uploads/2024/12/gas-p45-campo-grande-ms.webp"
curl -o "images\logo-mosko-gas-distribuidora-ultragaz-campo-grande-ms.webp" "https://moskogas.com.br/wp-content/uploads/2024/12/logo-mosko-gas-distribuidora-ultragaz-campo-grande-ms.webp"
curl -o "images\entrega-gas-campo-grande-ms-mosko.webp" "https://moskogas.com.br/wp-content/uploads/2024/12/entrega-gas-campo-grande-ms-mosko.webp"
curl -o "images\gas-do-povo-campo-grande-ms.webp" "https://moskogas.com.br/wp-content/uploads/2026/02/gas-do-povo-campo-grande-ms.webp"

echo.
echo Concluido! Imagens salvas na pasta /images
pause
