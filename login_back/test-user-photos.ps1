# Script de teste para endpoints de fotos por usuário (PowerShell)
# Certifique-se de que o servidor está rodando em http://localhost:8080

$BaseUrl = "http://localhost:8080/api/users"
$UserId = "123"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Testando Sistema de Fotos por Usuário" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Upload de Avatar
Write-Host "1. Fazendo upload de avatar..." -ForegroundColor Yellow
curl.exe -X POST "$BaseUrl/$UserId/photos/avatar" `
  -F "file=@avatar.jpg" `
  -H "Content-Type: multipart/form-data"
Write-Host ""

# 2. Upload de Foto com Nome Automático
Write-Host "2. Fazendo upload de foto (nome automático)..." -ForegroundColor Yellow
curl.exe -X POST "$BaseUrl/$UserId/photos" `
  -F "file=@foto1.jpg" `
  -H "Content-Type: multipart/form-data"
Write-Host ""

# 3. Upload de Foto com Nome Específico
Write-Host "3. Fazendo upload de foto (nome específico)..." -ForegroundColor Yellow
curl.exe -X POST "$BaseUrl/$UserId/photos" `
  -F "file=@documento.jpg" `
  -F "photoName=documento-identidade.jpg" `
  -H "Content-Type: multipart/form-data"
Write-Host ""

# 4. Listar Fotos do Usuário
Write-Host "4. Listando fotos do usuário..." -ForegroundColor Yellow
curl.exe -X GET "$BaseUrl/$UserId/photos"
Write-Host ""

# 5. Verificar se Avatar Existe
Write-Host "5. Verificando se avatar existe..." -ForegroundColor Yellow
curl.exe -X GET "$BaseUrl/$UserId/photos/avatar.jpg/exists"
Write-Host ""

# 6. Obter URL do Avatar
Write-Host "6. Obtendo URL pré-assinada do avatar..." -ForegroundColor Yellow
curl.exe -X GET "$BaseUrl/$UserId/photos/avatar.jpg/url?expiryMinutes=30"
Write-Host ""

# 7. Obter URLs de Todas as Fotos
Write-Host "7. Obtendo URLs de todas as fotos..." -ForegroundColor Yellow
curl.exe -X GET "$BaseUrl/$UserId/photos/urls?expiryMinutes=60"
Write-Host ""

# 8. Obter Informações de Foto Específica
Write-Host "8. Obtendo informações da foto..." -ForegroundColor Yellow
curl.exe -X GET "$BaseUrl/$UserId/photos/documento-identidade.jpg/info"
Write-Host ""

# 9. Download do Avatar
Write-Host "9. Fazendo download do avatar..." -ForegroundColor Yellow
curl.exe -X GET "$BaseUrl/$UserId/photos/avatar" -o "downloaded-avatar.jpg"
Write-Host "Avatar salvo como: downloaded-avatar.jpg" -ForegroundColor Green
Write-Host ""

# 10. Download de Foto Específica
Write-Host "10. Fazendo download de foto específica..." -ForegroundColor Yellow
curl.exe -X GET "$BaseUrl/$UserId/photos/documento-identidade.jpg" -o "downloaded-documento.jpg"
Write-Host "Documento salvo como: downloaded-documento.jpg" -ForegroundColor Green
Write-Host ""

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Testes concluídos!" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan