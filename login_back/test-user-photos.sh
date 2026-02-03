#!/bin/bash

# Script de teste para endpoints de fotos por usuário
# Certifique-se de que o servidor está rodando em http://localhost:8080

BASE_URL="http://localhost:8080/api/users"
USER_ID="123"

echo "=========================================="
echo "Testando Sistema de Fotos por Usuário"
echo "=========================================="
echo ""

# 1. Upload de Avatar
echo "1. Fazendo upload de avatar..."
curl -X POST "$BASE_URL/$USER_ID/photos/avatar" \
  -F "file=@avatar.jpg" \
  -H "Content-Type: multipart/form-data"
echo -e "\n"

# 2. Upload de Foto com Nome Automático
echo "2. Fazendo upload de foto (nome automático)..."
curl -X POST "$BASE_URL/$USER_ID/photos" \
  -F "file=@foto1.jpg" \
  -H "Content-Type: multipart/form-data"
echo -e "\n"

# 3. Upload de Foto com Nome Específico
echo "3. Fazendo upload de foto (nome específico)..."
curl -X POST "$BASE_URL/$USER_ID/photos" \
  -F "file=@documento.jpg" \
  -F "photoName=documento-identidade.jpg" \
  -H "Content-Type: multipart/form-data"
echo -e "\n"

# 4. Listar Fotos do Usuário
echo "4. Listando fotos do usuário..."
curl -X GET "$BASE_URL/$USER_ID/photos"
echo -e "\n"

# 5. Verificar se Avatar Existe
echo "5. Verificando se avatar existe..."
curl -X GET "$BASE_URL/$USER_ID/photos/avatar.jpg/exists"
echo -e "\n"

# 6. Obter URL do Avatar
echo "6. Obtendo URL pré-assinada do avatar..."
curl -X GET "$BASE_URL/$USER_ID/photos/avatar.jpg/url?expiryMinutes=30"
echo -e "\n"

# 7. Obter URLs de Todas as Fotos
echo "7. Obtendo URLs de todas as fotos..."
curl -X GET "$BASE_URL/$USER_ID/photos/urls?expiryMinutes=60"
echo -e "\n"

# 8. Obter Informações de Foto Específica
echo "8. Obtendo informações da foto..."
curl -X GET "$BASE_URL/$USER_ID/photos/documento-identidade.jpg/info"
echo -e "\n"

# 9. Download do Avatar
echo "9. Fazendo download do avatar..."
curl -X GET "$BASE_URL/$USER_ID/photos/avatar" -o "downloaded-avatar.jpg"
echo "Avatar salvo como: downloaded-avatar.jpg"
echo -e "\n"

# 10. Download de Foto Específica
echo "10. Fazendo download de foto específica..."
curl -X GET "$BASE_URL/$USER_ID/photos/documento-identidade.jpg" -o "downloaded-documento.jpg"
echo "Documento salvo como: downloaded-documento.jpg"
echo -e "\n"

echo "=========================================="
echo "Testes concluídos!"
echo "=========================================="