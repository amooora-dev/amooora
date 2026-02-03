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

@RestController
@RequestMapping("/api/photos")
@RequiredArgsConstructor
public class PhotoController {

    private final StorageService storageService;

    /**
     * Faz upload de uma foto
     * POST /api/photos/upload
     */
    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadPhoto(
            @RequestParam("file") MultipartFile file,
            @RequestParam(required = false) String objectName) throws IOException {
        
        if (file.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Arquivo não pode estar vazio"));
        }

        // Se não fornecer nome, usa o nome original do arquivo
        String finalObjectName = objectName != null ? objectName : file.getOriginalFilename();
        
        String uploadedName = storageService.uploadPhoto(
                finalObjectName,
                file.getBytes(),
                file.getContentType()
        );
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of(
                        "message", "Foto enviada com sucesso",
                        "objectName", uploadedName
                ));
    }

    /**
     * Faz download direto de uma foto
     * GET /api/photos/download/{photoName}
     */
    @GetMapping("/download/{photoName}")
    public ResponseEntity<InputStreamResource> downloadPhoto(@PathVariable String photoName) {
        return storageService.downloadPhoto(photoName);
    }

    /**
     * Gera URL pré-assinada para download (válida por 60 minutos por padrão)
     * GET /api/photos/url/{photoName}
     */
    @GetMapping("/url/{photoName}")
    public ResponseEntity<Map<String, String>> getDownloadUrl(
            @PathVariable String photoName,
            @RequestParam(defaultValue = "60") int expiryMinutes) {
        
        String url = storageService.getPresignedDownloadUrl(photoName, expiryMinutes);
        return ResponseEntity.ok(Map.of("downloadUrl", url, "expiryMinutes", String.valueOf(expiryMinutes)));
    }

    /**
     * Lista todas as fotos disponíveis
     * GET /api/photos/list
     */
    @GetMapping("/list")
    public ResponseEntity<List<String>> listPhotos(@RequestParam(required = false, defaultValue = "") String prefix) {
        List<String> photos = storageService.listPhotos(prefix);
        return ResponseEntity.ok(photos);
    }

    /**
     * Verifica se uma foto existe
     * GET /api/photos/exists/{photoName}
     */
    @GetMapping("/exists/{photoName}")
    public ResponseEntity<Map<String, Boolean>> photoExists(@PathVariable String photoName) {
        boolean exists = storageService.photoExists(photoName);
        return ResponseEntity.ok(Map.of("exists", exists));
    }

    /**
     * Obtém informações sobre uma foto
     * GET /api/photos/info/{photoName}
     */
    @GetMapping("/info/{photoName}")
    public ResponseEntity<Map<String, Object>> getPhotoInfo(@PathVariable String photoName) {
        PhotoMetadata info = storageService.getPhotoInfo(photoName);
        
        Map<String, Object> photoInfo = Map.of(
                "name", photoName,
                "size", info.getSize(),
                "contentType", info.getContentType(),
                "lastModified", info.getLastModified(),
                "etag", info.getEtag()
        );
        
        return ResponseEntity.ok(photoInfo);
    }
}