# 📚 API Documentation - MS Users

Documentação completa de todos os endpoints da API de usuários.

## 📋 Índice

1. [Endpoints de Usuários](#endpoints-de-usuários)
2. [Endpoints de Fotos Gerais](#endpoints-de-fotos-gerais)
3. [Endpoints de Fotos por Usuário](#endpoints-de-fotos-por-usuário)
4. [Modelos de Dados](#modelos-de-dados)
5. [Códigos de Status](#códigos-de-status)
6. [Exemplos de Uso](#exemplos-de-uso)

---

## 🧑 Endpoints de Usuários

Base URL: `/users`

### 1. Listar Todos os Usuários

```http
GET /users
```

**Descrição**: Retorna a lista de todos os usuários cadastrados.

**Resposta de Sucesso**:
```json
[
  {
    "id": 1,
    "name": "João Silva",
    "email": "joao@example.com",
    "phone_number": "+5511999999999",
    "cep": "01310-100",
    "birthday": "15/05/1990",
    "biography": "Desenvolvedor Full Stack",
    "url_picture": "https://storage.example.com/avatar.jpg"
  },
  {
    "id": 2,
    "name": "Maria Santos",
    "email": "maria@example.com",
    "phone_number": "+5511988888888",
    "cep": "04567-890",
    "birthday": "20/08/1985",
    "biography": "Designer UX/UI",
    "url_picture": null
  }
]
```

**Exemplo cURL**:
```bash
curl -X GET http://localhost:8080/users
```

---

### 2. Buscar Usuário por ID

```http
GET /users/id
```

**Headers**:
- `userId` (Long, obrigatório): ID do usuário

**Descrição**: Retorna os dados de um usuário específico pelo ID.

**Resposta de Sucesso**:
```json
{
  "id": 1,
  "name": "João Silva",
  "email": "joao@example.com",
  "phone_number": "+5511999999999",
  "cep": "01310-100",
  "birthday": "15/05/1990",
  "biography": "Desenvolvedor Full Stack",
  "url_picture": "https://storage.example.com/avatar.jpg"
}
```

**Exemplo cURL**:
```bash
curl -X GET http://localhost:8080/users/id \
  -H "userId: 1"
```

**Exemplo JavaScript**:
```javascript
fetch('http://localhost:8080/users/id', {
  headers: {
    'userId': '1'
  }
})
.then(response => response.json())
.then(data => console.log(data));
```

---

### 3. Buscar Usuário por Email

```http
GET /users/email
```

**Headers**:
- `email` (String, obrigatório): Email do usuário

**Descrição**: Retorna os dados de um usuário específico pelo email.

**Resposta de Sucesso**:
```json
{
  "id": 1,
  "name": "João Silva",
  "email": "joao@example.com",
  "phone_number": "+5511999999999",
  "cep": "01310-100",
  "birthday": "15/05/1990",
  "biography": "Desenvolvedor Full Stack",
  "url_picture": "https://storage.example.com/avatar.jpg"
}
```

**Exemplo cURL**:
```bash
curl -X GET http://localhost:8080/users/email \
  -H "email: joao@example.com"
```

**Exemplo JavaScript**:
```javascript
fetch('http://localhost:8080/users/email', {
  headers: {
    'email': 'joao@example.com'
  }
})
.then(response => response.json())
.then(data => console.log(data));
```

---

### 4. Criar Novo Usuário

```http
POST /users
```

**Content-Type**: `application/json`

**Body**:
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "phone_number": "+5511999999999",
  "cep": "01310-100",
  "birthday": "15/05/1990",
  "biography": "Desenvolvedor Full Stack",
  "url_picture": "https://storage.example.com/avatar.jpg"
}
```

**Validações**:
- `name`: Obrigatório, não pode estar em branco
- `email`: Obrigatório, deve ser um email válido
- `phone_number`: Obrigatório, não pode estar em branco
- `cep`: Obrigatório, não pode estar em branco
- `birthday`: Obrigatório, deve ser uma data no passado (formato: dd/MM/yyyy)
- `biography`: Opcional
- `url_picture`: Opcional

**Resposta de Sucesso**:
```json
{
  "id": 1,
  "name": "João Silva",
  "email": "joao@example.com",
  "phone_number": "+5511999999999",
  "cep": "01310-100",
  "birthday": "15/05/1990",
  "biography": "Desenvolvedor Full Stack",
  "url_picture": "https://storage.example.com/avatar.jpg"
}
```

**Exemplo cURL**:
```bash
curl -X POST http://localhost:8080/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "phone_number": "+5511999999999",
    "cep": "01310-100",
    "birthday": "15/05/1990",
    "biography": "Desenvolvedor Full Stack",
    "url_picture": null
  }'
```

**Exemplo JavaScript**:
```javascript
fetch('http://localhost:8080/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'João Silva',
    email: 'joao@example.com',
    phone_number: '+5511999999999',
    cep: '01310-100',
    birthday: '15/05/1990',
    biography: 'Desenvolvedor Full Stack',
    url_picture: null
  })
})
.then(response => response.json())
.then(data => console.log(data));
```

---

### 5. Atualizar Usuário

```http
PUT /users
```

**Content-Type**: `application/json`

**Body**:
```json
{
  "id": 1,
  "name": "João Silva Atualizado",
  "email": "joao.novo@example.com",
  "phone_number": "+5511999999999",
  "cep": "01310-100",
  "birthday": "15/05/1990",
  "biography": "Desenvolvedor Full Stack Sênior",
  "url_picture": "https://storage.example.com/new-avatar.jpg"
}
```

**Descrição**: Atualiza os dados de um usuário existente. O ID deve ser fornecido no body.

**Resposta de Sucesso**:
```json
{
  "id": 1,
  "name": "João Silva Atualizado",
  "email": "joao.novo@example.com",
  "phone_number": "+5511999999999",
  "cep": "01310-100",
  "birthday": "15/05/1990",
  "biography": "Desenvolvedor Full Stack Sênior",
  "url_picture": "https://storage.example.com/new-avatar.jpg"
}
```

**Exemplo cURL**:
```bash
curl -X PUT http://localhost:8080/users \
  -H "Content-Type: application/json" \
  -d '{
    "id": 1,
    "name": "João Silva Atualizado",
    "email": "joao.novo@example.com",
    "phone_number": "+5511999999999",
    "cep": "01310-100",
    "birthday": "15/05/1990",
    "biography": "Desenvolvedor Full Stack Sênior",
    "url_picture": "https://storage.example.com/new-avatar.jpg"
  }'
```

---

### 6. Deletar Usuário

```http
DELETE /users
```

**Headers**:
- `userId` (Long, obrigatório): ID do usuário a ser deletado

**Descrição**: Remove um usuário do sistema.

**Resposta de Sucesso**: Status 200 (sem body)

**Exemplo cURL**:
```bash
curl -X DELETE http://localhost:8080/users \
  -H "userId: 1"
```

**Exemplo JavaScript**:
```javascript
fetch('http://localhost:8080/users', {
  method: 'DELETE',
  headers: {
    'userId': '1'
  }
})
.then(response => {
  if (response.ok) {
    console.log('Usuário deletado com sucesso');
  }
});
```

---

## 📸 Endpoints de Fotos Gerais

Base URL: `/api/photos`

### 1. Upload de Foto

```http
POST /api/photos/upload
```

**Content-Type**: `multipart/form-data`

**Parâmetros**:
- `file` (File, obrigatório): Arquivo da foto
- `objectName` (String, opcional): Nome do objeto no storage

**Resposta de Sucesso**:
```json
{
  "message": "Foto enviada com sucesso",
  "objectName": "photo.jpg"
}
```

**Exemplo cURL**:
```bash
curl -X POST http://localhost:8080/api/photos/upload \
  -F "file=@photo.jpg" \
  -F "objectName=my-photo.jpg"
```

---

### 2. Download de Foto

```http
GET /api/photos/download/{photoName}
```

**Parâmetros de URL**:
- `photoName` (String): Nome da foto

**Resposta**: Arquivo binário da foto

**Exemplo cURL**:
```bash
curl -O http://localhost:8080/api/photos/download/photo.jpg
```

---

### 3. Obter URL Pré-assinada

```http
GET /api/photos/url/{photoName}
```

**Parâmetros de URL**:
- `photoName` (String): Nome da foto

**Query Parameters**:
- `expiryMinutes` (Integer, opcional, padrão: 60): Tempo de expiração em minutos

**Resposta de Sucesso**:
```json
{
  "downloadUrl": "https://storage.example.com/photo.jpg?token=xyz",
  "expiryMinutes": "60"
}
```

---

### 4. Listar Fotos

```http
GET /api/photos/list
```

**Query Parameters**:
- `prefix` (String, opcional): Prefixo para filtrar fotos

**Resposta de Sucesso**:
```json
[
  "photo1.jpg",
  "photo2.png",
  "users/123/avatar.jpg"
]
```

---

### 5. Verificar Existência de Foto

```http
GET /api/photos/exists/{photoName}
```

**Resposta de Sucesso**:
```json
{
  "exists": true
}
```

---

### 6. Obter Informações da Foto

```http
GET /api/photos/info/{photoName}
```

**Resposta de Sucesso**:
```json
{
  "name": "photo.jpg",
  "size": 245760,
  "contentType": "image/jpeg",
  "lastModified": "2024-01-15T10:30:00Z",
  "etag": "d41d8cd98f00b204e9800998ecf8427e"
}
```

---

## 👤 Endpoints de Fotos por Usuário

Base URL: `/api/users/{userId}/photos`

### 1. Upload de Foto do Usuário

```http
POST /api/users/{userId}/photos
```

**Content-Type**: `multipart/form-data`

**Parâmetros de URL**:
- `userId` (String): ID do usuário

**Parâmetros**:
- `file` (File, obrigatório): Arquivo da foto
- `photoName` (String, opcional): Nome da foto

**Resposta de Sucesso**:
```json
{
  "message": "Foto enviada com sucesso",
  "userId": "123",
  "photoName": "uuid-generated.jpg",
  "fullPath": "users/123/uuid-generated.jpg"
}
```

---

### 2. Upload de Avatar

```http
POST /api/users/{userId}/photos/avatar
```

**Content-Type**: `multipart/form-data`

**Parâmetros**:
- `file` (File, obrigatório): Arquivo do avatar

**Resposta de Sucesso**:
```json
{
  "message": "Avatar enviado com sucesso",
  "userId": "123",
  "avatarPath": "users/123/avatar.jpg"
}
```

---

### 3. Download de Foto do Usuário

```http
GET /api/users/{userId}/photos/{photoName}
```

**Resposta**: Arquivo binário da foto

---

### 4. Download de Avatar

```http
GET /api/users/{userId}/photos/avatar
```

**Resposta**: Arquivo binário do avatar

---

### 5. Listar Fotos do Usuário

```http
GET /api/users/{userId}/photos
```

**Resposta de Sucesso**:
```json
{
  "userId": "123",
  "totalPhotos": 3,
  "photos": [
    "avatar.jpg",
    "photo1.jpg",
    "photo2.png"
  ]
}
```

---

### 6. Obter URL de Foto

```http
GET /api/users/{userId}/photos/{photoName}/url
```

**Query Parameters**:
- `expiryMinutes` (Integer, opcional, padrão: 60)

**Resposta de Sucesso**:
```json
{
  "downloadUrl": "https://storage.example.com/photo.jpg?token=xyz",
  "expiryMinutes": "60",
  "userId": "123",
  "photoName": "photo.jpg"
}
```

---

### 7. Verificar Existência de Foto

```http
GET /api/users/{userId}/photos/{photoName}/exists
```

**Resposta de Sucesso**:
```json
{
  "userId": "123",
  "photoName": "photo.jpg",
  "exists": true
}
```

---

### 8. Obter Informações da Foto

```http
GET /api/users/{userId}/photos/{photoName}/info
```

**Resposta de Sucesso**:
```json
{
  "userId": "123",
  "photoName": "photo.jpg",
  "size": 245760,
  "contentType": "image/jpeg",
  "lastModified": "2024-01-15T10:30:00Z",
  "etag": "d41d8cd98f00b204e9800998ecf8427e"
}
```

---

### 9. Obter URLs de Todas as Fotos

```http
GET /api/users/{userId}/photos/urls
```

**Query Parameters**:
- `expiryMinutes` (Integer, opcional, padrão: 60)

**Resposta de Sucesso**:
```json
{
  "userId": "123",
  "totalPhotos": 2,
  "expiryMinutes": 60,
  "photos": [
    {
      "photoName": "avatar.jpg",
      "url": "https://storage.example.com/avatar.jpg?token=xyz"
    },
    {
      "photoName": "photo1.jpg",
      "url": "https://storage.example.com/photo1.jpg?token=abc"
    }
  ]
}
```

---

## 📊 Modelos de Dados

### UserDTO

```json
{
  "id": 1,
  "name": "João Silva",
  "email": "joao@example.com",
  "phone_number": "+5511999999999",
  "cep": "01310-100",
  "birthday": "15/05/1990",
  "biography": "Desenvolvedor Full Stack",
  "url_picture": "https://storage.example.com/avatar.jpg"
}
```

**Campos**:
- `id` (Long): ID único do usuário (gerado automaticamente)
- `name` (String): Nome completo do usuário (obrigatório)
- `email` (String): Email válido (obrigatório, único)
- `phone_number` (String): Número de telefone (obrigatório)
- `cep` (String): CEP do endereço (obrigatório)
- `birthday` (String): Data de nascimento no formato dd/MM/yyyy (obrigatório, deve ser no passado)
- `biography` (String): Biografia do usuário (opcional)
- `url_picture` (String): URL da foto de perfil (opcional)

### PhotoMetadata

```json
{
  "bucket": "photos",
  "object": "users/123/photo.jpg",
  "size": 245760,
  "contentType": "image/jpeg",
  "lastModified": "2024-01-15T10:30:00Z",
  "etag": "d41d8cd98f00b204e9800998ecf8427e"
}
```

---

## 🔢 Códigos de Status

| Código | Descrição |
|--------|-----------|
| 200 | OK - Requisição bem-sucedida |
| 201 | Created - Recurso criado com sucesso |
| 400 | Bad Request - Dados inválidos |
| 404 | Not Found - Recurso não encontrado |
| 500 | Internal Server Error - Erro no servidor |

---

## 💡 Exemplos de Uso Completos

### Criar Usuário e Upload de Avatar

```bash
# 1. Criar usuário
USER_RESPONSE=$(curl -X POST http://localhost:8080/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "phone_number": "+5511999999999",
    "cep": "01310-100",
    "birthday": "15/05/1990",
    "biography": "Desenvolvedor",
    "url_picture": null
  }')

# 2. Extrair ID do usuário
USER_ID=$(echo $USER_RESPONSE | jq -r '.id')

# 3. Upload do avatar
curl -X POST http://localhost:8080/api/users/$USER_ID/photos/avatar \
  -F "file=@avatar.jpg"

# 4. Obter URL do avatar
curl http://localhost:8080/api/users/$USER_ID/photos/avatar.jpg/url
```

### Atualizar Perfil com Nova Foto

```javascript
// 1. Upload da nova foto
const formData = new FormData();
formData.append('file', photoFile);

const uploadResponse = await fetch(`http://localhost:8080/api/users/${userId}/photos/avatar`, {
  method: 'POST',
  body: formData
});

const uploadData = await uploadResponse.json();

// 2. Atualizar usuário com nova URL
const updateResponse = await fetch('http://localhost:8080/users', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    ...userData,
    url_picture: uploadData.avatarPath
  })
});
```

---

## 🔐 Observações de Segurança

1. **Validação de Dados**: Todos os campos obrigatórios são validados
2. **Email Único**: O sistema não permite emails duplicados
3. **Data de Nascimento**: Deve ser uma data no passado
4. **Tamanho de Arquivo**: Limite de 10MB para uploads
5. **Tipos de Arquivo**: Apenas imagens são aceitas (jpg, png, gif, webp, bmp, svg)

---

## 📝 Notas Adicionais

- Todas as datas seguem o formato `dd/MM/yyyy`
- URLs pré-assinadas expiram após o tempo especificado
- Fotos são organizadas por usuário em `users/{userId}/`
- O campo `open_network` existe no modelo User mas não é exposto no DTO