package br.com.amooora.users.service;

import br.com.amooora.users.dto.PhotoMetadata;
import br.com.amooora.users.service.storage.StorageService;
import io.minio.GetObjectArgs;
import io.minio.GetPresignedObjectUrlArgs;
import io.minio.ListObjectsArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.Result;
import io.minio.StatObjectArgs;
import io.minio.StatObjectResponse;
import io.minio.http.Method;
import io.minio.messages.Item;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Service
@ConditionalOnProperty(name = "storage.provider", havingValue = "minio")
@RequiredArgsConstructor
@Slf4j
public class MinioService implements StorageService {

    private final MinioClient minioClient;

    @Value("${minio.bucket-name}")
    private String bucketName;

    /**
     * Faz upload de uma foto para o MinIO
     */
    @Override
    public String uploadPhoto(String objectName, byte[] photoData, String contentType) {
        try {
            ByteArrayInputStream inputStream = new ByteArrayInputStream(photoData);
            
            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(bucketName)
                            .object(objectName)
                            .stream(inputStream, photoData.length, -1)
                            .contentType(contentType)
                            .build()
            );
            
            log.info("Foto enviada com sucesso para MinIO: {}", objectName);
            return objectName;
            
        } catch (Exception e) {
            log.error("Erro ao fazer upload da foto: {}", objectName, e);
            throw new RuntimeException("Erro ao fazer upload da foto: " + e.getMessage());
        }
    }

    /**
     * Faz download direto de uma foto do MinIO
     */
    @Override
    public ResponseEntity<InputStreamResource> downloadPhoto(String objectName) {
        try {
            // Verifica se o objeto existe
            StatObjectResponse stat = minioClient.statObject(
                    StatObjectArgs.builder()
                            .bucket(bucketName)
                            .object(objectName)
                            .build()
            );

            // Obtém o stream do objeto
            InputStream stream = minioClient.getObject(
                    GetObjectArgs.builder()
                            .bucket(bucketName)
                            .object(objectName)
                            .build()
            );

            // Determina o tipo de conteúdo baseado na extensão
            String contentType = determineContentType(objectName);

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .contentLength(stat.size())
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + objectName + "\"")
                    .body(new InputStreamResource(stream));

        } catch (Exception e) {
            log.error("Erro ao fazer download da foto: {}", objectName, e);
            throw new RuntimeException("Erro ao fazer download da foto: " + e.getMessage());
        }
    }

    /**
     * Gera URL pré-assinada para download da foto (válida por tempo limitado)
     */
    @Override
    public String getPresignedDownloadUrl(String objectName, int expiryInMinutes) {
        try {
            return minioClient.getPresignedObjectUrl(
                    GetPresignedObjectUrlArgs.builder()
                            .method(Method.GET)
                            .bucket(bucketName)
                            .object(objectName)
                            .expiry(expiryInMinutes, TimeUnit.MINUTES)
                            .build()
            );
        } catch (Exception e) {
            log.error("Erro ao gerar URL pré-assinada para: {}", objectName, e);
            throw new RuntimeException("Erro ao gerar URL de download: " + e.getMessage());
        }
    }

    /**
     * Lista fotos com prefixo específico (ex: pasta)
     */
    @Override
    public List<String> listPhotos(String prefix) {
        List<String> photoNames = new ArrayList<>();
        
        try {
            Iterable<Result<Item>> results = minioClient.listObjects(
                    ListObjectsArgs.builder()
                            .bucket(bucketName)
                            .prefix(prefix)
                            .build()
            );

            for (Result<Item> result : results) {
                Item item = result.get();
                String objectName = item.objectName();
                
                // Filtra apenas arquivos de imagem
                if (isImageFile(objectName)) {
                    photoNames.add(objectName);
                }
            }
        } catch (Exception e) {
            log.error("Erro ao listar fotos", e);
            throw new RuntimeException("Erro ao listar fotos: " + e.getMessage());
        }

        return photoNames;
    }

    /**
     * Verifica se o arquivo existe no MinIO
     */
    @Override
    public boolean photoExists(String objectName) {
        try {
            minioClient.statObject(
                    StatObjectArgs.builder()
                            .bucket(bucketName)
                            .object(objectName)
                            .build()
            );
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Obtém informações sobre a foto
     */
    @Override
    public PhotoMetadata getPhotoInfo(String objectName) {
        try {
            StatObjectResponse stat = minioClient.statObject(
                    StatObjectArgs.builder()
                            .bucket(bucketName)
                            .object(objectName)
                            .build()
            );
            
            return new PhotoMetadata(
                    bucketName,
                    objectName,
                    stat.size(),
                    stat.contentType(),
                    stat.lastModified(),
                    stat.etag()
            );
        } catch (Exception e) {
            log.error("Erro ao obter informações da foto: {}", objectName, e);
            throw new RuntimeException("Erro ao obter informações da foto: " + e.getMessage());
        }
    }

    private String determineContentType(String objectName) {
        String extension = objectName.substring(objectName.lastIndexOf('.') + 1).toLowerCase();
        
        return switch (extension) {
            case "jpg", "jpeg" -> "image/jpeg";
            case "png" -> "image/png";
            case "gif" -> "image/gif";
            case "webp" -> "image/webp";
            case "bmp" -> "image/bmp";
            case "svg" -> "image/svg+xml";
            default -> "application/octet-stream";
        };
    }

    private boolean isImageFile(String objectName) {
        String extension = objectName.substring(objectName.lastIndexOf('.') + 1).toLowerCase();
        return List.of("jpg", "jpeg", "png", "gif", "webp", "bmp", "svg").contains(extension);
    }
}