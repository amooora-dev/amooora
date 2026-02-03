# Sistema de Armazenamento de Fotos

Este projeto suporta dois provedores de armazenamento de fotos: **MinIO** e **AWS S3**.

## 🎯 Características

- ✅ Upload de fotos
- ✅ Download direto de fotos
- ✅ Geração de URLs pré-assinadas
- ✅ Listagem de fotos
- ✅ Verificação de existência
- ✅ Informações detalhadas dos arquivos
- ✅ Suporte a múltiplos formatos de imagem (JPG, PNG, GIF, WebP, BMP, SVG)
- ✅ Alternância fácil entre MinIO e S3

## 🔧 Configuração

### 1. Escolher o Provedor

Edite o arquivo `.env` e defina a variável `STORAGE_PROVIDER`:

```properties
# Para usar MinIO (desenvolvimento local)
STORAGE_PROVIDER=minio

# Para usar AWS S3 (produção)
STORAGE_PROVIDER=s3
```

### 2. Configurar MinIO

```properties
MINIO_URL=http://localhost:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET_NAME=photos
```

**Executar MinIO com Docker:**
```bash
docker run -p 9000:9000 -p 9001:9001 \
  -e MINIO_ROOT_USER=minioadmin \
  -e MINIO_ROOT_PASSWORD=minioadmin \
  minio/minio server /data --console-address ":9001"
```

Acesse o console em: http://localhost:9001

### 3. Configurar AWS S3

```properties
AWS_S3_REGION=us-east-1
AWS_S3_ACCESS_KEY=sua-access-key-aqui
AWS_S3_SECRET_KEY=sua-secret-key-aqui
AWS_S3_BUCKET_NAME=photos
```

**Criar bucket no S3:**
```bash
aws s3 mb s3://photos --region us-east-1
```

## 📡 API Endpoints

### Endpoints Gerais (PhotoController)

#### Upload de Foto
```http
POST /api/photos/upload
Content-Type: multipart/form-data

Parâmetros:
- file: arquivo da foto (obrigatório)
- objectName: nome do objeto (opcional)
```

**Exemplo:**
```bash
curl -X POST http://localhost:8080/api/photos/upload \
  -F "file=@foto.jpg" \
  -F "objectName=users/avatar-123.jpg"
```

### Download de Foto
```http
GET /api/photos/download/{photoName}
```

**Exemplo:**
```bash
curl -O http://localhost:8080/api/photos/download/users/avatar-123.jpg
```

### URL Pré-assinada
```http
GET /api/photos/url/{photoName}?expiryMinutes=60
```

### Listar Fotos
```http
GET /api/photos/list?prefix=users/
```

### Verificar Existência
```http
GET /api/photos/exists/{photoName}
```

#### Informações da Foto
```http
GET /api/photos/info/{photoName}
```

---

### Endpoints por Usuário (UserPhotoController)

As fotos são organizadas automaticamente em pastas por usuário: `users/{userId}/`

#### Upload de Foto do Usuário
```http
POST /api/users/{userId}/photos
```
**Exemplo:**
```bash
curl -X POST http://localhost:8080/api/users/123/photos \
  -F "file=@foto.jpg" \
  -F "photoName=documento.jpg"
```

#### Upload de Avatar
```http
POST /api/users/{userId}/photos/avatar
```

#### Download de Foto do Usuário
```http
GET /api/users/{userId}/photos/{photoName}
```

#### Download de Avatar
```http
GET /api/users/{userId}/photos/avatar
```

#### Listar Fotos do Usuário
```http
GET /api/users/{userId}/photos
```

#### Obter URLs de Todas as Fotos
```http
GET /api/users/{userId}/photos/urls?expiryMinutes=60
```

**Veja mais exemplos em:** `src/main/resources/user-photo-integration-example.md`

---

## 💻 Uso no Código

### Opção 1: Usar StorageService Diretamente

```java
@Service
public class MyService {
    
    @Autowired
    private StorageService storageService; // Injeta automaticamente MinIO ou S3
    
    public String uploadPhoto(String userId, MultipartFile file) throws IOException {
        String objectName = "users/" + userId + "/photo.jpg";
        return storageService.uploadPhoto(
            objectName, 
            file.getBytes(), 
            file.getContentType()
        );
    }
}
```

### Opção 2: Usar UserPhotoService (Recomendado)

```java
@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserPhotoService userPhotoService;
    
    // Upload de avatar
    public String updateAvatar(String userId, MultipartFile file) throws IOException {
        return userPhotoService.uploadUserAvatar(userId, file);
    }
    
    // Upload de foto com nome automático
    public String addPhoto(String userId, MultipartFile file) throws IOException {
        return userPhotoService.uploadUserPhoto(userId, file);
    }
    
    // Obter URL do avatar
    public String getAvatarUrl(String userId) {
        return userPhotoService.getUserAvatarUrl(userId, 60);
    }
    
    // Listar fotos do usuário
    public List<String> getUserPhotos(String userId) {
        return userPhotoService.listUserPhotos(userId);
    }
}
```

## 🔄 Como Funciona

O sistema usa o padrão **Strategy** com injeção de dependência do Spring:

1. A interface `StorageService` define o contrato
2. `MinioService` implementa para MinIO
3. `AwsS3Service` implementa para AWS S3
4. Spring injeta automaticamente a implementação correta baseado em `storage.provider`
5. `UserPhotoService` fornece métodos específicos para organização por usuário

```
┌──────────────────┐     ┌──────────────────┐
│ PhotoController  │     │UserPhotoController│
└────────┬─────────┘     └────────┬──────────┘
         │                        │
         │                        ▼
         │              ┌──────────────────┐
         │              │ UserPhotoService │
         │              └────────┬─────────┘
         │                       │
         └───────────┬───────────┘
                     ▼
           ┌─────────────────┐
           │ StorageService  │ (interface)
           └────────┬────────┘
                    │ implementado por
               ┌────┴────┐
               ▼         ▼
          ┌──────────┐ ┌──────────┐
          │  MinIO   │ │   S3     │
          │ Service  │ │ Service  │
          └──────────┘ └──────────┘
```

### Estrutura de Pastas

```
bucket/
└── users/
    ├── user-123/
    │   ├── avatar.jpg
    │   ├── photo-uuid-1.jpg
    │   └── documento.pdf
    └── user-456/
        └── avatar.png
```

## 🚀 Vantagens

- **Flexibilidade**: Troque entre MinIO e S3 sem alterar código
- **Desenvolvimento Local**: Use MinIO localmente sem custos
- **Produção**: Use S3 em produção com alta disponibilidade
- **Testabilidade**: Fácil criar mocks da interface
- **Manutenibilidade**: Código desacoplado e organizado

## 📝 Notas

- Tamanho máximo de upload: 10MB (configurável em `application.properties`)
- URLs pré-assinadas expiram após o tempo especificado
- Apenas arquivos de imagem são listados automaticamente
- Certifique-se de que o bucket existe antes de usar