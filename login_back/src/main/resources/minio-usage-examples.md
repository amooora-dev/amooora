# Storage Service - Exemplos de Uso (MinIO ou AWS S3)

## Configuração

O sistema suporta dois provedores de armazenamento: **MinIO** e **AWS S3**.

### Escolher o Provedor

Configure a variável `STORAGE_PROVIDER` no seu `.env`:

```properties
# Para usar MinIO
STORAGE_PROVIDER=minio

# Para usar AWS S3
STORAGE_PROVIDER=s3
```

### Configuração MinIO

```properties
MINIO_URL=http://localhost:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET_NAME=photos
```

### Configuração AWS S3

```properties
AWS_S3_REGION=us-east-1
AWS_S3_ACCESS_KEY=sua-access-key-aqui
AWS_S3_SECRET_KEY=sua-secret-key-aqui
AWS_S3_BUCKET_NAME=photos
```

## Endpoints Disponíveis

### 1. Upload de Foto
```http
POST /api/photos/upload
Content-Type: multipart/form-data
```
**Parâmetros:**
- `file`: arquivo da foto (obrigatório)
- `objectName`: nome do objeto no storage (opcional, usa o nome original se não fornecido)

**Exemplo com cURL:**
```bash
curl -X POST http://localhost:8080/api/photos/upload \
  -F "file=@/caminho/para/foto.jpg" \
  -F "objectName=users/avatar-123.jpg"
```

**Resposta:**
```json
{
  "message": "Foto enviada com sucesso",
  "objectName": "users/avatar-123.jpg"
}
```

### 2. Download Direto de Foto
```http
GET /api/photos/download/{photoName}
```
**Exemplo:**
```bash
curl -O http://localhost:8080/api/photos/download/user-avatar.jpg
```

### 3. Obter URL Pré-assinada
```http
GET /api/photos/url/{photoName}?expiryMinutes=60
```
**Exemplo:**
```bash
curl http://localhost:8080/api/photos/url/user-avatar.jpg?expiryMinutes=30
```
**Resposta:**
```json
{
  "downloadUrl": "http://localhost:9000/photos/user-avatar.jpg?X-Amz-Algorithm=...",
  "expiryMinutes": "30"
}
```

### 4. Listar Fotos
```http
GET /api/photos/list?prefix=users/
```
**Exemplo:**
```bash
curl http://localhost:8080/api/photos/list
```
**Resposta:**
```json
[
  "user-avatar.jpg",
  "profile-pic.png",
  "users/john-doe.jpg"
]
```

### 5. Verificar se Foto Existe
```http
GET /api/photos/exists/{photoName}
```
**Exemplo:**
```bash
curl http://localhost:8080/api/photos/exists/user-avatar.jpg
```
**Resposta:**
```json
{
  "exists": true
}
```

### 6. Obter Informações da Foto
```http
GET /api/photos/info/{photoName}
```
**Exemplo:**
```bash
curl http://localhost:8080/api/photos/info/user-avatar.jpg
```
**Resposta:**
```json
{
  "name": "user-avatar.jpg",
  "size": 245760,
  "contentType": "image/jpeg",
  "lastModified": "2024-01-15T10:30:00Z",
  "etag": "d41d8cd98f00b204e9800998ecf8427e"
}
```

## Uso Programático

### Injeção do Serviço
```java
@Service
public class UserService {
    
    @Autowired
    private StorageService storageService; // Injeta automaticamente MinIO ou S3
    
    public String uploadUserAvatar(String userId, byte[] photoData) {
        String photoName = "users/" + userId + "-avatar.jpg";
        return storageService.uploadPhoto(photoName, photoData, "image/jpeg");
    }
    
    public String getUserAvatarUrl(String userId) {
        String photoName = "users/" + userId + "-avatar.jpg";
        return storageService.getPresignedDownloadUrl(photoName, 60);
    }
}
```

### Upload e Download em Controller
```java
@PostMapping("/users/{id}/avatar")
public ResponseEntity<Map<String, String>> uploadUserAvatar(
        @PathVariable String id,
        @RequestParam("file") MultipartFile file) throws IOException {
    
    String photoName = "users/" + id + "-avatar.jpg";
    storageService.uploadPhoto(photoName, file.getBytes(), file.getContentType());
    
    return ResponseEntity.ok(Map.of("message", "Avatar enviado com sucesso"));
}

@GetMapping("/users/{id}/avatar")
public ResponseEntity<InputStreamResource> getUserAvatar(@PathVariable String id) {
    String photoName = "users/" + id + "-avatar.jpg";
    return storageService.downloadPhoto(photoName);
}
```

## Mudando entre MinIO e S3

Para alternar entre os provedores, basta mudar a variável de ambiente:

```bash
# Usar MinIO
STORAGE_PROVIDER=minio

# Usar AWS S3
STORAGE_PROVIDER=s3
```

O Spring Boot automaticamente injeta a implementação correta baseado nessa configuração.

## Tipos de Arquivo Suportados

- JPG/JPEG
- PNG
- GIF
- WebP
- BMP
- SVG

## Tratamento de Erros

O serviço lança `RuntimeException` em caso de erro. Considere implementar um `@ControllerAdvice` para tratamento global de exceções.