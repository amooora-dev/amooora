package br.com.amooora.users.controller;

import br.com.amooora.users.dto.PhotoMetadata;
import br.com.amooora.users.service.storage.StorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/users/{userId}/photos")
@RequiredArgsConstructor
public class UserPhotoController {

    private final StorageService storageService;

    /**
     * Upload de foto para um usuário específico
     * POST /api/users/{userId}/photos
     */
    @PostMapping
    public ResponseEntity<Map<String, String>> uploadUserPhoto(
            @PathVariable String userId,
            @RequestParam("file") MultipartFile file,
            @RequestParam(required = false) String photoName) throws IOException {
        
        if (file.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Arquivo não pode estar vazio"));
        }

        // Gera nome único se não fornecido
        String fileName = photoName != null ? photoName : generateUniqueFileName(file.getOriginalFilename());
        
        // Cria o caminho: users/{userId}/{fileName}
        String objectName = buildUserPhotoPath(userId, fileName);
        
        String uploadedName = storageService.uploadPhoto(
                objectName,
                file.getBytes(),
                file.getContentType()
        );
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of(
                        "message", "Foto enviada com sucesso",
                        "userId", userId,
                        "photoName", fileName,
                        "fullPath", uploadedName
                ));
    }

    /**
     * Upload de avatar do usuário (substitui o anterior)
     * POST /api/users/{userId}/photos/avatar
     */
    @PostMapping("/avatar")
    public ResponseEntity<Map<String, String>> uploadAvatar(
            @PathVariable String userId,
            @RequestParam("file") MultipartFile file) throws IOException {
        
        if (file.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Arquivo não pode estar vazio"));
        }

        // Nome fixo para avatar
        String extension = getFileExtension(file.getOriginalFilename());
        String objectName = buildUserPhotoPath(userId, "avatar" + extension);
        
        String uploadedName = storageService.uploadPhoto(
                objectName,
                file.getBytes(),
                file.getContentType()
        );
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of(
                        "message", "Avatar enviado com sucesso",
                        "userId", userId,
                        "avatarPath", uploadedName
                ));
    }

    /**
     * Download de foto específica do usuário
     * GET /api/users/{userId}/photos/{photoName}
     */
    @GetMapping("/{photoName}")
    public ResponseEntity<InputStreamResource> downloadUserPhoto(
            @PathVariable String userId,
            @PathVariable String photoName) {
        
        String objectName = buildUserPhotoPath(userId, photoName);
        return storageService.downloadPhoto(objectName);
    }

    /**
     * Download do avatar do usuário
     * GET /api/users/{userId}/photos/avatar
     */
    @GetMapping("/avatar")
    public ResponseEntity<InputStreamResource> downloadAvatar(@PathVariable String userId) {
        // Tenta encontrar avatar com diferentes extensões
        String[] extensions = {".jpg", ".jpeg", ".png", ".webp"};
        
        for (String ext : extensions) {
            String objectName = buildUserPhotoPath(userId, "avatar" + ext);
            if (storageService.photoExists(objectName)) {
                return storageService.downloadPhoto(objectName);
            }
        }
        
        return ResponseEntity.notFound().build();
    }

    /**
     * Obter URL pré-assinada para foto do usuário
     * GET /api/users/{userId}/photos/{photoName}/url
     */
    @GetMapping("/{photoName}/url")
    public ResponseEntity<Map<String, String>> getUserPhotoUrl(
            @PathVariable String userId,
            @PathVariable String photoName,
            @RequestParam(defaultValue = "60") int expiryMinutes) {
        
        String objectName = buildUserPhotoPath(userId, photoName);
        
        if (!storageService.photoExists(objectName)) {
            return ResponseEntity.notFound().build();
        }
        
        String url = storageService.getPresignedDownloadUrl(objectName, expiryMinutes);
        return ResponseEntity.ok(Map.of(
                "downloadUrl", url,
                "expiryMinutes", String.valueOf(expiryMinutes),
                "userId", userId,
                "photoName", photoName
        ));
    }

    /**
     * Listar todas as fotos de um usuário
     * GET /api/users/{userId}/photos
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> listUserPhotos(@PathVariable String userId) {
        String prefix = "users/" + userId + "/";
        List<String> photos = storageService.listPhotos(prefix);
        
        // Remove o prefixo para retornar apenas os nomes dos arquivos
        List<String> photoNames = photos.stream()
                .map(path -> path.replace(prefix, ""))
                .toList();
        
        return ResponseEntity.ok(Map.of(
                "userId", userId,
                "totalPhotos", photoNames.size(),
                "photos", photoNames
        ));
    }

    /**
     * Verificar se foto do usuário existe
     * GET /api/users/{userId}/photos/{photoName}/exists
     */
    @GetMapping("/{photoName}/exists")
    public ResponseEntity<Map<String, Object>> userPhotoExists(
            @PathVariable String userId,
            @PathVariable String photoName) {
        
        String objectName = buildUserPhotoPath(userId, photoName);
        boolean exists = storageService.photoExists(objectName);
        
        return ResponseEntity.ok(Map.of(
                "userId", userId,
                "photoName", photoName,
                "exists", exists
        ));
    }

    /**
     * Obter informações de foto do usuário
     * GET /api/users/{userId}/photos/{photoName}/info
     */
    @GetMapping("/{photoName}/info")
    public ResponseEntity<Map<String, Object>> getUserPhotoInfo(
            @PathVariable String userId,
            @PathVariable String photoName) {
        
        String objectName = buildUserPhotoPath(userId, photoName);
        
        if (!storageService.photoExists(objectName)) {
            return ResponseEntity.notFound().build();
        }
        
        PhotoMetadata info = storageService.getPhotoInfo(objectName);
        
        return ResponseEntity.ok(Map.of(
                "userId", userId,
                "photoName", photoName,
                "size", info.getSize(),
                "contentType", info.getContentType(),
                "lastModified", info.getLastModified(),
                "etag", info.getEtag()
        ));
    }

    /**
     * Obter URLs de todas as fotos do usuário
     * GET /api/users/{userId}/photos/urls
     */
    @GetMapping("/urls")
    public ResponseEntity<Map<String, Object>> getAllUserPhotoUrls(
            @PathVariable String userId,
            @RequestParam(defaultValue = "60") int expiryMinutes) {
        
        String prefix = "users/" + userId + "/";
        List<String> photos = storageService.listPhotos(prefix);
        
        List<Map<String, String>> photoUrls = photos.stream()
                .map(fullPath -> {
                    String photoName = fullPath.replace(prefix, "");
                    String url = storageService.getPresignedDownloadUrl(fullPath, expiryMinutes);
                    return Map.of(
                            "photoName", photoName,
                            "url", url
                    );
                })
                .toList();
        
        return ResponseEntity.ok(Map.of(
                "userId", userId,
                "totalPhotos", photoUrls.size(),
                "expiryMinutes", expiryMinutes,
                "photos", photoUrls
        ));
    }

    // Métodos auxiliares

    private String buildUserPhotoPath(String userId, String photoName) {
        return String.format("users/%s/%s", userId, photoName);
    }

    private String generateUniqueFileName(String originalFilename) {
        String extension = getFileExtension(originalFilename);
        return UUID.randomUUID().toString() + extension;
    }

    private String getFileExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return ".jpg";
        }
        return filename.substring(filename.lastIndexOf('.'));
    }
}