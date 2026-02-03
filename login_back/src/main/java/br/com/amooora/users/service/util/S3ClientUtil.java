package br.com.amooora.users.service.util;

import io.minio.MinioClient;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.S3Configuration;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.ListObjectsV2Request;
import software.amazon.awssdk.services.s3.model.ListObjectsV2Response;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.net.URI;
import java.nio.file.Paths;

public class S3ClientUtil {

    private final S3Client s3;

    public S3ClientUtil(String endpoint, String accessKey, String secretKey, String region) {
        S3Configuration s3Config = S3Configuration.builder()
                .pathStyleAccessEnabled(true) // importante para MinIO
                .build();

        this.s3 = S3Client.builder()
                .endpointOverride(URI.create(endpoint))
                .region(Region.of(region))
                .serviceConfiguration(s3Config)
                .credentialsProvider(
                        StaticCredentialsProvider.create(AwsBasicCredentials.create(accessKey, secretKey))
                )
                .build();
    }

    // 📤 Upload de arquivo
    public void uploadFile(String bucket, String key, String filePath) {
        s3.putObject(
                PutObjectRequest.builder()
                        .bucket(bucket)
                        .key(key)
                        .build(),
                RequestBody.fromFile(Paths.get(filePath))
        );
        System.out.println("Upload concluído: " + key);
    }

    // 📥 Download de arquivo
    public void downloadFile(String bucket, String key, String outputPath) throws Exception {
        GetObjectRequest request = GetObjectRequest.builder()
                .bucket(bucket)
                .key(key)
                .build();

        try (InputStream inputStream = s3.getObject(request);
             FileOutputStream outputStream = new FileOutputStream(new File(outputPath))) {

            byte[] buffer = new byte[4096];
            int bytesRead;
            while((bytesRead = inputStream.read(buffer)) != -1){
                outputStream.write(buffer, 0, bytesRead);
            }
        }
        System.out.println("Download concluído: " + key);
    }

    // 🧾 Listar arquivos
    public void listFiles(String bucket) {
        ListObjectsV2Response response = s3.listObjectsV2(
                ListObjectsV2Request.builder()
                        .bucket(bucket)
                        .build()
        );
        response.contents().forEach(obj -> System.out.println("Arquivo: " + obj.key()));
    }

    public void close() {
        s3.close();
    }
}
