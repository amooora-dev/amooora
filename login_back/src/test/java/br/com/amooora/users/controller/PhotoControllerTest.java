package br.com.amooora.users.controller;

import br.com.amooora.users.dto.PhotoMetadata;
import br.com.amooora.users.service.storage.StorageService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;

import java.io.ByteArrayInputStream;
import java.time.ZonedDateTime;
import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PhotoController.class)
class PhotoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private StorageService storageService;

    private static final String BASE_URL = "/api/photos";

    @Test
    void uploadPhoto_WithValidFile_ShouldReturnCreated() throws Exception {
        // Arrange
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "test.jpg",
                MediaType.IMAGE_JPEG_VALUE,
                "test-data".getBytes()
        );

        when(storageService.uploadPhoto(anyString(), any(byte[].class), anyString()))
                .thenReturn("test.jpg");

        // Act & Assert
        mockMvc.perform(multipart(BASE_URL + "/upload")
                        .file(file)
                        .param("objectName", "test.jpg"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.message").value("Foto enviada com sucesso"))
                .andExpect(jsonPath("$.objectName").value("test.jpg"));

        verify(storageService).uploadPhoto(
                eq("test.jpg"),
                any(byte[].class),
                eq(MediaType.IMAGE_JPEG_VALUE)
        );
    }

    @Test
    void uploadPhoto_WithEmptyFile_ShouldReturnBadRequest() throws Exception {
        // Arrange
        MockMultipartFile emptyFile = new MockMultipartFile(
                "file",
                "test.jpg",
                MediaType.IMAGE_JPEG_VALUE,
                new byte[0]
        );

        // Act & Assert
        mockMvc.perform(multipart(BASE_URL + "/upload")
                        .file(emptyFile))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Arquivo não pode estar vazio"));

        verify(storageService, never()).uploadPhoto(anyString(), any(byte[].class), anyString());
    }

    @Test
    void uploadPhoto_WithoutObjectName_ShouldUseOriginalFilename() throws Exception {
        // Arrange
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "original.jpg",
                MediaType.IMAGE_JPEG_VALUE,
                "test-data".getBytes()
        );

        when(storageService.uploadPhoto(anyString(), any(byte[].class), anyString()))
                .thenReturn("original.jpg");

        // Act & Assert
        mockMvc.perform(multipart(BASE_URL + "/upload")
                        .file(file))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.objectName").value("original.jpg"));
    }

    @Test
    void downloadPhoto_WhenPhotoExists_ShouldReturnPhoto() throws Exception {
        // Arrange
        byte[] photoData = "photo-content".getBytes();
        InputStreamResource resource = new InputStreamResource(new ByteArrayInputStream(photoData));
        
        ResponseEntity<InputStreamResource> response = ResponseEntity.ok()
                .contentType(MediaType.IMAGE_JPEG)
                .contentLength(photoData.length)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"test.jpg\"")
                .body(resource);

        when(storageService.downloadPhoto("test.jpg")).thenReturn(response);

        // Act & Assert
        mockMvc.perform(get(BASE_URL + "/download/test.jpg"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.IMAGE_JPEG));

        verify(storageService).downloadPhoto("test.jpg");
    }

    @Test
    void getDownloadUrl_ShouldReturnPresignedUrl() throws Exception {
        // Arrange
        when(storageService.getPresignedDownloadUrl("test.jpg", 60))
                .thenReturn("https://storage.example.com/test.jpg?token=xyz");

        // Act & Assert
        mockMvc.perform(get(BASE_URL + "/url/test.jpg")
                        .param("expiryMinutes", "60"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.downloadUrl").value("https://storage.example.com/test.jpg?token=xyz"))
                .andExpect(jsonPath("$.expiryMinutes").value("60"));

        verify(storageService).getPresignedDownloadUrl("test.jpg", 60);
    }

    @Test
    void getDownloadUrl_WithDefaultExpiry_ShouldUse60Minutes() throws Exception {
        // Arrange
        when(storageService.getPresignedDownloadUrl("test.jpg", 60))
                .thenReturn("https://storage.example.com/test.jpg?token=xyz");

        // Act & Assert
        mockMvc.perform(get(BASE_URL + "/url/test.jpg"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.expiryMinutes").value("60"));
    }

    @Test
    void listPhotos_WithoutPrefix_ShouldReturnAllPhotos() throws Exception {
        // Arrange
        List<String> photos = Arrays.asList("photo1.jpg", "photo2.jpg", "photo3.jpg");
        when(storageService.listPhotos("")).thenReturn(photos);

        // Act & Assert
        mockMvc.perform(get(BASE_URL + "/list"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0]").value("photo1.jpg"))
                .andExpect(jsonPath("$[1]").value("photo2.jpg"))
                .andExpect(jsonPath("$[2]").value("photo3.jpg"));

        verify(storageService).listPhotos("");
    }

    @Test
    void listPhotos_WithPrefix_ShouldReturnFilteredPhotos() throws Exception {
        // Arrange
        List<String> photos = Arrays.asList("users/photo1.jpg", "users/photo2.jpg");
        when(storageService.listPhotos("users/")).thenReturn(photos);

        // Act & Assert
        mockMvc.perform(get(BASE_URL + "/list")
                        .param("prefix", "users/"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0]").value("users/photo1.jpg"))
                .andExpect(jsonPath("$[1]").value("users/photo2.jpg"));

        verify(storageService).listPhotos("users/");
    }

    @Test
    void photoExists_WhenPhotoExists_ShouldReturnTrue() throws Exception {
        // Arrange
        when(storageService.photoExists("test.jpg")).thenReturn(true);

        // Act & Assert
        mockMvc.perform(get(BASE_URL + "/exists/test.jpg"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.exists").value(true));

        verify(storageService).photoExists("test.jpg");
    }

    @Test
    void photoExists_WhenPhotoDoesNotExist_ShouldReturnFalse() throws Exception {
        // Arrange
        when(storageService.photoExists("test.jpg")).thenReturn(false);

        // Act & Assert
        mockMvc.perform(get(BASE_URL + "/exists/test.jpg"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.exists").value(false));
    }

    @Test
    void getPhotoInfo_WhenPhotoExists_ShouldReturnMetadata() throws Exception {
        // Arrange
        PhotoMetadata metadata = new PhotoMetadata(
                "photos",
                "test.jpg",
                2048L,
                "image/jpeg",
                ZonedDateTime.now(),
                "etag456"
        );

        when(storageService.getPhotoInfo("test.jpg")).thenReturn(metadata);

        // Act & Assert
        mockMvc.perform(get(BASE_URL + "/info/test.jpg"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("test.jpg"))
                .andExpect(jsonPath("$.size").value(2048))
                .andExpect(jsonPath("$.contentType").value("image/jpeg"))
                .andExpect(jsonPath("$.etag").value("etag456"));

        verify(storageService).getPhotoInfo("test.jpg");
    }
}