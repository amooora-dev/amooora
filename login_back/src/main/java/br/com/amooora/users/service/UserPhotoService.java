package br.com.amooora.users.service;

import br.com.amooora.users.service.storage.StorageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserPhotoService {

    private final StorageService storageService;

    /**
     * Upload de foto para usuário com nome automático
     */
    public String uploadUserPhoto(String userId, MultipartFile file) throws IOException {
        String fileName = generateUniqueFileName(file.getOriginalFilename());
        String objectName = buildUserPhotoPath(userId, fileName);
        
        storageService.uploadPhoto(objectName, file.getBytes(), file.getContentType());
        log.info("Foto enviada para usuário {}: {}", userId, fileName);
        
        return fileName;
    }

    /**
     * Upload de foto para usuário com nome específico
     */
    public String uploadUserPhoto(String userId, String photoName, MultipartFile file) throws IOException {
        String objectName = buildUserPhotoPath(userId, photoName);
        
        storageService.uploadPhoto(objectName, file.getBytes(), file.getContentType());
        log.info("Foto enviada para usuário {}: {}", userId, photoName);
        
        return photoName;
    }

    /**
     * Upload de avatar do usuário (substitui o anterior)
     */
    public String uploadUserAvatar(String userId, MultipartFile file) throws IOException {
        String extension = getFileExtension(file.getOriginalFilename());
        String objectName = buildUserPhotoPath(userId, "avatar" + extension);
        
        storageService.uploadPhoto(objectName, file.getBytes(), file.getContentType());
        log.info("Avatar atualizado para usuário {}", userId);
        
        return objectName;
    }

    /**
     * Obter URL do avatar do usuário
     */
    public String getUserAvatarUrl(String userId, int expiryMinutes) {
        String[] extensions = {".jpg", ".jpeg", ".png", ".webp"};
        
        for (String ext : extensions) {
            String objectName = buildUserPhotoPath(userId, "avatar" + ext);
            if (storageService.photoExists(objectName)) {
                return storageService.getPresignedDownloadUrl(objectName, expiryMinutes);
            }
        }
        
        return null;
    }

    /**
     * Obter URL de foto específica do usuário
     */
    public String getUserPhotoUrl(String userId, String photoName, int expiryMinutes) {
        String objectName = buildUserPhotoPath(userId, photoName);
        
        if (!storageService.photoExists(objectName)) {
            return null;
        }
        
        return storageService.getPresignedDownloadUrl(objectName, expiryMinutes);
    }

    /**
     * Listar todas as fotos de um usuário
     */
    public List<String> listUserPhotos(String userId) {
        String prefix = "users/" + userId + "/";
        List<String> photos = storageService.listPhotos(prefix);
        
        // Remove o prefixo para retornar apenas os nomes dos arquivos
        return photos.stream()
                .map(path -> path.replace(prefix, ""))
                .toList();
    }

    /**
     * Verificar se usuário tem avatar
     */
    public boolean userHasAvatar(String userId) {
        String[] extensions = {".jpg", ".jpeg", ".png", ".webp"};
        
        for (String ext : extensions) {
            String objectName = buildUserPhotoPath(userId, "avatar" + ext);
            if (storageService.photoExists(objectName)) {
                return true;
            }
        }
        
        return false;
    }

    /**
     * Verificar se foto do usuário existe
     */
    public boolean userPhotoExists(String userId, String photoName) {
        String objectName = buildUserPhotoPath(userId, photoName);
        return storageService.photoExists(objectName);
    }

    /**
     * Contar fotos do usuário
     */
    public int countUserPhotos(String userId) {
        return listUserPhotos(userId).size();
    }

    /**
     * Obter URLs de todas as fotos do usuário
     */
    public List<PhotoUrlInfo> getAllUserPhotoUrls(String userId, int expiryMinutes) {
        String prefix = "users/" + userId + "/";
        List<String> photos = storageService.listPhotos(prefix);
        
        return photos.stream()
                .map(fullPath -> {
                    String photoName = fullPath.replace(prefix, "");
                    String url = storageService.getPresignedDownloadUrl(fullPath, expiryMinutes);
                    return new PhotoUrlInfo(photoName, url, fullPath);
                })
                .toList();
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

    // Classe interna para informações de URL
    public record PhotoUrlInfo(String photoName, String url, String fullPath) {}
}