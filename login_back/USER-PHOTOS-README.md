# 📸 Sistema de Fotos por Usuário

Sistema completo para gerenciamento de fotos organizadas por usuário, com suporte a MinIO e AWS S3.

## 🎯 Características Principais

✅ **Organização Automática**: Fotos separadas por usuário em `users/{userId}/`
✅ **Avatar Dedicado**: Endpoint específico para avatar do usuário
✅ **Múltiplas Fotos**: Suporte a galeria de fotos por usuário
✅ **Nomes Únicos**: Geração automática de UUID para evitar conflitos
✅ **URLs Temporárias**: Geração de URLs pré-assinadas com expiração
✅ **Listagem Rápida**: Listar apenas fotos de um usuário específico
✅ **Isolamento**: Fotos de diferentes usuários não se misturam

## 📁 Estrutura de Armazenamento

```
bucket/
└── users/
    ├── 123/
    │   ├── avatar.jpg              # Avatar do usuário
    │   ├── uuid-1234.jpg           # Foto com nome automático
    │   ├── documento-rg.jpg        # Foto com nome específico
    │   └── comprovante.pdf         # Outros arquivos
    ├── 456/
    │   ├── avatar.png
    │   └── foto-perfil.jpg
    └── 789/
        └── avatar.webp
```

## 🚀 Quick Start

### 1. Configuração

Edite o `.env`:

```properties
# Escolha o provedor
STORAGE_PROVIDER=minio  # ou s3

# Configuração MinIO
MINIO_URL=http://localhost:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET_NAME=photos
```

### 2. Executar MinIO (Docker)

```bash
docker run -p 9000:9000 -p 9001:9001 \
  -e MINIO_ROOT_USER=minioadmin \
  -e MINIO_ROOT_PASSWORD=minioadmin \
  minio/minio server /data --console-address ":9001"
```

### 3. Criar Bucket

Acesse http://localhost:9001 e crie o bucket `photos`

### 4. Testar

```bash
# Linux/Mac
chmod +x test-user-photos.sh
./test-user-photos.sh

# Windows
.\test-user-photos.ps1
```

## 📡 Endpoints Principais

### Upload de Avatar
```bash
curl -X POST http://localhost:8080/api/users/123/photos/avatar \
  -F "file=@avatar.jpg"
```

### Upload de Foto
```bash
# Nome automático (UUID)
curl -X POST http://localhost:8080/api/users/123/photos \
  -F "file=@foto.jpg"

# Nome específico
curl -X POST http://localhost:8080/api/users/123/photos \
  -F "file=@documento.jpg" \
  -F "photoName=documento-rg.jpg"
```

### Listar Fotos do Usuário
```bash
curl http://localhost:8080/api/users/123/photos
```

### Download de Avatar
```bash
curl -O http://localhost:8080/api/users/123/photos/avatar
```

### Obter URLs de Todas as Fotos
```bash
curl http://localhost:8080/api/users/123/photos/urls?expiryMinutes=60
```

## 💻 Uso no Código

### Opção 1: UserPhotoService (Recomendado)

```java
@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserPhotoService userPhotoService;
    
    // Upload de avatar
    public String updateAvatar(Long userId, MultipartFile file) throws IOException {
        return userPhotoService.uploadUserAvatar(userId.toString(), file);
    }
    
    // Upload de foto
    public String addPhoto(Long userId, MultipartFile file) throws IOException {
        return userPhotoService.uploadUserPhoto(userId.toString(), file);
    }
    
    // Obter URL do avatar
    public String getAvatarUrl(Long userId) {
        return userPhotoService.getUserAvatarUrl(userId.toString(), 60);
    }
    
    // Listar fotos
    public List<String> getPhotos(Long userId) {
        return userPhotoService.listUserPhotos(userId.toString());
    }
    
    // Verificar se tem avatar
    public boolean hasAvatar(Long userId) {
        return userPhotoService.userHasAvatar(userId.toString());
    }
}
```

### Opção 2: Endpoints REST Diretos

Use os endpoints do `UserPhotoController`:
- `POST /api/users/{userId}/photos/avatar`
- `POST /api/users/{userId}/photos`
- `GET /api/users/{userId}/photos`
- `GET /api/users/{userId}/photos/avatar`
- `GET /api/users/{userId}/photos/{photoName}`
- `GET /api/users/{userId}/photos/urls`

## 🔒 Segurança

### Validar Propriedade do Usuário

```java
@PostMapping("/{userId}/photos")
public ResponseEntity<?> uploadPhoto(
        @PathVariable String userId,
        @RequestParam("file") MultipartFile file,
        Authentication auth) throws IOException {
    
    // Verifica se o usuário autenticado pode fazer upload
    String authenticatedUserId = auth.getName();
    if (!userId.equals(authenticatedUserId)) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
            .body(Map.of("error", "Não autorizado"));
    }
    
    // Continua com o upload...
}
```

### Limitar Quantidade de Fotos

```java
private static final int MAX_PHOTOS_PER_USER = 10;

public String uploadUserPhoto(String userId, MultipartFile file) throws IOException {
    int currentCount = countUserPhotos(userId);
    if (currentCount >= MAX_PHOTOS_PER_USER) {
        throw new IllegalStateException("Limite de fotos atingido");
    }
    // Upload...
}
```

### Validar Tipo de Arquivo

```java
private void validateImageFile(MultipartFile file) {
    String contentType = file.getContentType();
    List<String> allowedTypes = List.of(
        "image/jpeg", "image/png", "image/gif", "image/webp"
    );
    
    if (!allowedTypes.contains(contentType)) {
        throw new IllegalArgumentException("Tipo de arquivo não permitido");
    }
}
```

## 📊 Casos de Uso

### 1. Avatar de Perfil
```java
// Upload
userPhotoService.uploadUserAvatar("123", avatarFile);

// Obter URL
String avatarUrl = userPhotoService.getUserAvatarUrl("123", 60);
```

### 2. Galeria de Fotos
```java
// Upload múltiplas fotos
for (MultipartFile photo : photos) {
    userPhotoService.uploadUserPhoto("123", photo);
}

// Listar todas
List<String> photoNames = userPhotoService.listUserPhotos("123");
```

### 3. Documentos do Usuário
```java
// Upload com nomes específicos
userPhotoService.uploadUserPhoto("123", "rg-frente.jpg", rgFrenteFile);
userPhotoService.uploadUserPhoto("123", "rg-verso.jpg", rgVersoFile);
userPhotoService.uploadUserPhoto("123", "comprovante.jpg", comprovanteFile);
```

### 4. Integração com Entidade User
```java
@Entity
public class User {
    @Id
    private Long id;
    private String name;
    private String avatarPath;
    
    @Transient
    private String avatarUrl; // Gerado sob demanda
}

// No service
public UserDto getUser(Long id) {
    User user = userRepository.findById(id).orElseThrow();
    
    UserDto dto = new UserDto(user);
    if (userPhotoService.userHasAvatar(id.toString())) {
        dto.setAvatarUrl(userPhotoService.getUserAvatarUrl(id.toString(), 60));
    }
    
    return dto;
}
```

## 🎨 Vantagens

| Vantagem | Descrição |
|----------|-----------|
| **Isolamento** | Fotos de cada usuário ficam separadas |
| **Organização** | Estrutura clara e fácil de navegar |
| **Escalabilidade** | Suporta milhões de usuários |
| **Performance** | Listagem rápida por usuário |
| **Segurança** | Controle de acesso por usuário |
| **Manutenção** | Fácil deletar todas as fotos de um usuário |
| **Flexibilidade** | Troca entre MinIO e S3 sem alterar código |

## 📚 Documentação Adicional

- **Exemplos de Integração**: `src/main/resources/user-photo-integration-example.md`
- **Exemplo com Entidade User**: `src/main/resources/user-entity-integration-example.java`
- **Documentação Geral**: `STORAGE-README.md`
- **Scripts de Teste**: `test-user-photos.sh` ou `test-user-photos.ps1`

## 🔄 Alternando entre MinIO e S3

Basta mudar uma variável:

```properties
# Desenvolvimento local
STORAGE_PROVIDER=minio

# Produção
STORAGE_PROVIDER=s3
```

O Spring Boot injeta automaticamente a implementação correta!

## 🛠️ Troubleshooting

### Erro: Bucket não existe
```bash
# MinIO
mc alias set local http://localhost:9000 minioadmin minioadmin
mc mb local/photos

# AWS S3
aws s3 mb s3://photos --region us-east-1
```

### Erro: Arquivo muito grande
Aumente o limite em `application.properties`:
```properties
spring.servlet.multipart.max-file-size=50MB
spring.servlet.multipart.max-request-size=50MB
```

### Erro: Permissão negada
Verifique as credenciais no `.env` e as permissões do bucket.