package br.com.amooora.users.service.storage;

import br.com.amooora.users.dto.PhotoMetadata;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface StorageService {
    
    ResponseEntity<InputStreamResource> downloadPhoto(String objectName);
    
    String getPresignedDownloadUrl(String objectName, int expiryInMinutes);
    
    List<String> listPhotos(String prefix);
    
    boolean photoExists(String objectName);
    
    PhotoMetadata getPhotoInfo(String objectName);
    
    String uploadPhoto(String objectName, byte[] photoData, String contentType);
}