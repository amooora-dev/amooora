package br.com.amooora.users.service;

import br.com.amooora.users.dto.PhotoMetadata;
import br.com.amooora.users.service.storage.StorageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedGetObjectRequest;

import java.time.Duration;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@ConditionalOnProperty(name = "storage.provider", havingValue = "s3")
@RequiredArgsConstructor
@Slf4j
public class AwsS3Service implements StorageService {

    private final S3Client s3Client;
    private final S3Presigner s3Presigner;

    @Value("${aws.s3.bucket-name}")
    private String bucketName;

    /**
     * Faz upload de uma foto para o S3
     */
    @Override
    public String uploadPhoto(String objectName, byte[] photoData, String contentType) {
        try {
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(objectName)
                    .contentType(contentType)
                    .build();

            s3Client.putObject(putObjectRequest, RequestBody.fromBytes(photoData));
            
            log.info("Foto enviada com sucesso para S3: {}", objectName);
            return objectName;
            
        } catch (S3Exception e) {
            log.error("Erro ao fazer upload da foto para S3: {}", objectName, e);
            throw new RuntimeException("Erro ao fazer upload da foto: " + e.getMessage());
        }
    }

    /**
     * Faz download direto de uma foto do S3
     */
    @Override
    public ResponseEntity<InputStreamResource> downloadPhoto(String objectName) {
        try {
            GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                    .bucket(bucketName)
                    .key(objectName)
                    .build();

            ResponseInputStream<GetObjectResponse> s3Object = s3Client.getObject(getObjectRequest);
            GetObjectResponse response = s3Object.response();

            String contentType = response.contentType() != null ? 
                    response.contentType() : determineContentType(objectName);

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .contentLength(response.contentLength())
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + objectName + "\"")
                    .body(new InputStreamResource(s3Object));

        } catch (S3Exception e) {
            log.error("Erro ao fazer download da foto do S3: {}", objectName, e);
            throw new RuntimeException("Erro ao fazer download da foto: " + e.getMessage());
        }
    }

    /**
     * Gera URL pré-assinada para download da foto (válida por tempo limitado)
     */
    @Override
    public String getPresignedDownloadUrl(String objectName, int expiryInMinutes) {
        try {
            GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                    .bucket(bucketName)
                    .key(objectName)
                    .build();

            GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                    .signatureDuration(Duration.ofMinutes(expiryInMinutes))
                    .getObjectRequest(getObjectRequest)
                    .build();

            PresignedGetObjectRequest presignedRequest = s3Presigner.presignGetObject(presignRequest);
            
            return presignedRequest.url().toString();
            
        } catch (S3Exception e) {
            log.error("Erro ao gerar URL pré-assinada para S3: {}", objectName, e);
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
            ListObjectsV2Request listRequest = ListObjectsV2Request.builder()
                    .bucket(bucketName)
                    .prefix(prefix)
                    .build();

            ListObjectsV2Response listResponse = s3Client.listObjectsV2(listRequest);

            for (S3Object s3Object : listResponse.contents()) {
                String objectName = s3Object.key();
                
                // Filtra apenas arquivos de imagem
                if (isImageFile(objectName)) {
                    photoNames.add(objectName);
                }
            }
        } catch (S3Exception e) {
            log.error("Erro ao listar fotos do S3", e);
            throw new RuntimeException("Erro ao listar fotos: " + e.getMessage());
        }

        return photoNames;
    }

    /**
     * Verifica se o arquivo existe no S3
     */
    @Override
    public boolean photoExists(String objectName) {
        try {
            HeadObjectRequest headObjectRequest = HeadObjectRequest.builder()
                    .bucket(bucketName)
                    .key(objectName)
                    .build();

            s3Client.headObject(headObjectRequest);
            return true;
            
        } catch (NoSuchKeyException e) {
            return false;
        } catch (S3Exception e) {
            log.error("Erro ao verificar existência da foto no S3: {}", objectName, e);
            return false;
        }
    }

    /**
     * Obtém informações sobre a foto
     */
    @Override
    public PhotoMetadata getPhotoInfo(String objectName) {
        try {
            HeadObjectRequest headObjectRequest = HeadObjectRequest.builder()
                    .bucket(bucketName)
                    .key(objectName)
                    .build();

            HeadObjectResponse headResponse = s3Client.headObject(headObjectRequest);

            // Converte Instant para ZonedDateTime
            ZonedDateTime lastModified = headResponse.lastModified() != null 
                    ? headResponse.lastModified().atZone(ZoneId.systemDefault())
                    : null;

            // Converte para PhotoMetadata
            return new PhotoMetadata(
                    bucketName,
                    objectName,
                    headResponse.contentLength(),
                    headResponse.contentType(),
                    lastModified,
                    headResponse.eTag()
            );
            
        } catch (S3Exception e) {
            log.error("Erro ao obter informações da foto do S3: {}", objectName, e);
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