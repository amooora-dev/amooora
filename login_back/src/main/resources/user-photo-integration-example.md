# Integração de Fotos por Usuário - Exemplos

## 📁 Estrutura de Armazenamento

As fotos são organizadas automaticamente por usuário:

```
bucket/
└── users/
    ├── user-123/
    │   ├── avatar.jpg
    │   ├── photo-1.jpg
    │   ├── photo-2.png
    │   └── documento.jpg
    ├── user-456/
    │   ├── avatar.png
    │   └── perfil.jpg
    └── user-789/
        └── avatar.webp
```

## 🎯 Endpoints por Usuário

### 1. Upload de Foto do Usuário
```http
POST /api/users/{userId}/photos
Content-Type: multipart/form-data

Parâmetros:
- file: arquivo da foto (obrigatório)
- photoName: nome da foto (opcional, gera UUID se não fornecido)
```

**Exemplo:**
```bash
# Upload com nome automático (UUID)
curl -X POST http://localhost:8080/api/users/123/photos \
  -F "file=@foto.jpg"

# Upload com nome específico
curl -X POST http://localhost:8080/api/users/123/photos \
  -F "file=@documento.jpg" \
  -F "photoName=documento-identidade.jpg"
```

**Resposta:**
```json
{
  "message": "Foto enviada com sucesso",
  "userId": "123",
  "photoName": "a1b2c3d4-e5f6-7890-abcd-ef1234567890.jpg",
  "fullPath": "users/123/a1b2c3d4-e5f6-7890-abcd-ef1234567890.jpg"
}
```

### 2. Upload de Avatar
```http
POST /api/users/{userId}/photos/avatar
Content-Type: multipart/form-data
```

**Exemplo:**
```bash
curl -X POST http://localhost:8080/api/users/123/photos/avatar \
  -F "file=@avatar.jpg"
```

### 3. Download de Foto do Usuário
```http
GET /api/users/{userId}/photos/{photoName}
```

**Exemplo:**
```bash
curl -O http://localhost:8080/api/users/123/photos/documento-identidade.jpg
```

### 4. Download de Avatar
```http
GET /api/users/{userId}/photos/avatar
```

**Exemplo:**
```bash
curl -O http://localhost:8080/api/users/123/photos/avatar
```

### 5. Listar Fotos do Usuário
```http
GET /api/users/{userId}/photos
```

**Exemplo:**
```bash
curl http://localhost:8080/api/users/123/photos
```

**Resposta:**
```json
{
  "userId": "123",
  "totalPhotos": 3,
  "photos": [
    "avatar.jpg",
    "documento-identidade.jpg",
    "foto-perfil.png"
  ]
}
```

### 6. Obter URL de Foto
```http
GET /api/users/{userId}/photos/{photoName}/url?expiryMinutes=60
```

**Exemplo:**
```bash
curl http://localhost:8080/api/users/123/photos/documento-identidade.jpg/url
```

**Resposta:**
```json
{
  "downloadUrl": "https://...",
  "expiryMinutes": "60",
  "userId": "123",
  "photoName": "documento-identidade.jpg"
}
```

### 7. Obter URLs de Todas as Fotos
```http
GET /api/users/{userId}/photos/urls?expiryMinutes=60
```

**Exemplo:**
```bash
curl http://localhost:8080/api/users/123/photos/urls
```

**Resposta:**
```json
{
  "userId": "123",
  "totalPhotos": 3,
  "expiryMinutes": 60,
  "photos": [
    {
      "photoName": "avatar.jpg",
      "url": "https://..."
    },
    {
      "photoName": "documento-identidade.jpg",
      "url": "https://..."
    }
  ]
}
```

### 8. Verificar se Foto Existe
```http
GET /api/users/{userId}/photos/{photoName}/exists
```

### 9. Informações da Foto
```http
GET /api/users/{userId}/photos/{photoName}/info
```

## 💻 Uso Programático

### Exemplo 1: Controller de Usuário com Avatar

```java
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    
    private final UserService userService;
    private final UserPhotoService userPhotoService;
    
    @PostMapping("/{id}/avatar")
    public ResponseEntity<Map<String, String>> updateAvatar(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) throws IOException {
        
        // Verifica se usuário existe
        User user = userService.findById(id);
        
        // Upload do avatar
        String avatarPath = userPhotoService.uploadUserAvatar(
            user.getId().toString(), 
            file
        );
        
        // Atualiza no banco de dados
        user.setAvatarPath(avatarPath);
        userService.save(user);
        
        return ResponseEntity.ok(Map.of(
            "message", "Avatar atualizado com sucesso",
            "avatarPath", avatarPath
        ));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUser(@PathVariable Long id) {
        User user = userService.findById(id);
        
        // Gera URL do avatar se existir
        String avatarUrl = null;
        if (userPhotoService.userHasAvatar(user.getId().toString())) {
            avatarUrl = userPhotoService.getUserAvatarUrl(
                user.getId().toString(), 
                60
            );
        }
        
        UserDto dto = new UserDto(user, avatarUrl);
        return ResponseEntity.ok(dto);
    }
}
```

### Exemplo 2: Service com Múltiplas Fotos

```java
@Service
@RequiredArgsConstructor
public class DocumentService {
    
    private final UserPhotoService userPhotoService;
    
    public void uploadUserDocuments(String userId, List<MultipartFile> documents) 
            throws IOException {
        
        for (int i = 0; i < documents.size(); i++) {
            MultipartFile doc = documents.get(i);
            String photoName = "documento-" + (i + 1) + getExtension(doc);
            
            userPhotoService.uploadUserPhoto(userId, photoName, doc);
        }
    }
    
    public List<String> getUserDocumentUrls(String userId) {
        return userPhotoService.getAllUserPhotoUrls(userId, 120)
                .stream()
                .filter(info -> info.photoName().startsWith("documento-"))
                .map(UserPhotoService.PhotoUrlInfo::url)
                .toList();
    }
    
    private String getExtension(MultipartFile file) {
        String name = file.getOriginalFilename();
        return name != null && name.contains(".") 
            ? name.substring(name.lastIndexOf('.')) 
            : ".jpg";
    }
}
```

### Exemplo 3: Entidade User com Avatar

```java
@Entity
@Table(name = "users")
@Data
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String email;
    
    // Armazena o caminho do avatar
    private String avatarPath;
    
    @Transient
    private String avatarUrl; // URL temporária gerada sob demanda
}
```

### Exemplo 4: DTO com URLs das Fotos

```java
@Data
@AllArgsConstructor
public class UserProfileDto {
    private Long id;
    private String name;
    private String email;
    private String avatarUrl;
    private List<PhotoInfo> photos;
    
    @Data
    @AllArgsConstructor
    public static class PhotoInfo {
        private String name;
        private String url;
        private Long size;
    }
}
```

## 🔒 Segurança e Boas Práticas

### 1. Validação de Usuário

```java
@PostMapping("/{userId}/photos")
public ResponseEntity<?> uploadPhoto(
        @PathVariable String userId,
        @RequestParam("file") MultipartFile file,
        Authentication auth) throws IOException {
    
    // Verifica se o usuário autenticado pode fazer upload
    if (!isAuthorized(auth, userId)) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
            .body(Map.of("error", "Não autorizado"));
    }
    
    // Continua com o upload...
}
```

### 2. Limite de Fotos por Usuário

```java
@Service
public class UserPhotoService {
    
    private static final int MAX_PHOTOS_PER_USER = 10;
    
    public String uploadUserPhoto(String userId, MultipartFile file) 
            throws IOException {
        
        int currentCount = countUserPhotos(userId);
        if (currentCount >= MAX_PHOTOS_PER_USER) {
            throw new IllegalStateException(
                "Limite de fotos atingido: " + MAX_PHOTOS_PER_USER
            );
        }
        
        // Continua com o upload...
    }
}
```

### 3. Validação de Tipo de Arquivo

```java
private void validateImageFile(MultipartFile file) {
    String contentType = file.getContentType();
    List<String> allowedTypes = List.of(
        "image/jpeg", "image/png", "image/gif", "image/webp"
    );
    
    if (!allowedTypes.contains(contentType)) {
        throw new IllegalArgumentException(
            "Tipo de arquivo não permitido: " + contentType
        );
    }
}
```

## 🎨 Vantagens da Organização por Usuário

✅ **Isolamento**: Fotos de cada usuário ficam separadas
✅ **Organização**: Fácil encontrar e gerenciar fotos por usuário
✅ **Escalabilidade**: Estrutura suporta milhões de usuários
✅ **Segurança**: Controle de acesso por usuário
✅ **Performance**: Listagem rápida de fotos de um usuário específico
✅ **Manutenção**: Fácil deletar todas as fotos de um usuário

## 📊 Casos de Uso

1. **Avatar de Perfil**: Foto única que representa o usuário
2. **Galeria de Fotos**: Múltiplas fotos do usuário
3. **Documentos**: RG, CPF, comprovantes
4. **Fotos de Produtos**: Para marketplace
5. **Anexos**: Qualquer tipo de imagem relacionada ao usuário