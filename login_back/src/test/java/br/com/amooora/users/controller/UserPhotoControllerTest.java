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

@WebMvcTest(UserPhotoController.class)
class UserPhotoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private StorageService storageService;

    private static final String USER_ID = "123";
    private static final String BASE_URL = "/api/users/" + USER_ID + "/photos";

    @Test
    void uploadUserPhoto_WithValidFile_ShouldReturnCreated() throws Exception {
        // Arrange
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "test.jpg",
                MediaType.IMAGE_JPEG_VALUE,
                "test-data".getBytes()
        );

        when(storageService.uploadPhoto(anyString(), any(byte[].class), anyString()))
                .thenReturn("users/123/test.jpg");

        // Act & Assert
        mockMvc.perform(multipart(BASE_URL)
                        .file(file)
                        .param("photoName", "test.jpg"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.message").value("Foto enviada com sucesso"))
                .andExpect(jsonPath("$.userId").value(USER_ID))
                .andExpect(jsonPath("$.photoName").value("test.jpg"));

        verify(storageService).uploadPhoto(
                eq("users/123/test.jpg"),
                any(byte[].class),
                eq(MediaType.IMAGE_JPEG_VALUE)
        );
    }

    @Test
    void uploadUserPhoto_WithEmptyFile_ShouldReturnBadRequest() throws Exception {
        // Arrange
        MockMultipartFile emptyFile = new MockMultipartFile(
                "file",
                "test.jpg",
                MediaType.IMAGE_JPEG_VALUE,
                new byte[0]
        );

        // Act & Assert
        mockMvc.perform(multipart(BASE_URL)
                        .file(emptyFile))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Arquivo não pode estar vazio"));

        verify(storageService, never()).uploadPhoto(anyString(), any(byte[].class), anyString());
    }

    @Test
    void uploadAvatar_WithValidFile_ShouldReturnCreated() throws Exception {
        // Arrange
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "avatar.jpg",
                MediaType.IMAGE_JPEG_VALUE,
                "avatar-data".getBytes()
        );

        when(storageService.uploadPhoto(anyString(), any(byte[].class), anyString()))
                .thenReturn("users/123/avatar.jpg");

        // Act & Assert
        mockMvc.perform(multipart(BASE_URL + "/avatar")
                        .file(file))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.message").value("Avatar enviado com sucesso"))
                .andExpect(jsonPath("$.userId").value(USER_ID))
                .andExpect(jsonPath("$.avatarPath").value("users/123/avatar.jpg"));
    }

    @Test
    void downloadUserPhoto_WhenPhotoExists_ShouldReturnPhoto() throws Exception {
        // Arrange
        byte[] photoData = "photo-content".getBytes();
        InputStreamResource resource = new InputStreamResource(new ByteArrayInputStream(photoData));
        
        ResponseEntity<InputStreamResource> response = ResponseEntity.ok()
                .contentType(MediaType.IMAGE_JPEG)
                .contentLength(photoData.length)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"test.jpg\"")
                .body(resource);

        when(storageService.downloadPhoto("users/123/test.jpg")).thenReturn(response);

        // Act & Assert
        mockMvc.perform(get(BASE_URL + "/test.jpg"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.IMAGE_JPEG));

        verify(storageService).downloadPhoto("users/123/test.jpg");
    }

    @Test
    void getUserPhotoUrl_WhenPhotoExists_ShouldReturnUrl() throws Exception {
        // Arrange
        when(storageService.photoExists("users/123/test.jpg")).thenReturn(true);
        when(storageService.getPresignedDownloadUrl("users/123/test.jpg", 60))
                .thenReturn("https://storage.example.com/test.jpg?token=xyz");

        // Act & Assert
        mockMvc.perform(get(BASE_URL + "/test.jpg/url")
                        .param("expiryMinutes", "60"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.downloadUrl").value("https://storage.example.com/test.jpg?token=xyz"))
                .andExpect(jsonPath("$.expiryMinutes").value("60"))
                .andExpect(jsonPath("$.userId").value(USER_ID))
                .andExpect(jsonPath("$.photoName").value("test.jpg"));
    }

    @Test
    void getUserPhotoUrl_WhenPhotoDoesNotExist_ShouldReturnNotFound() throws Exception {
        // Arrange
        when(storageService.photoExists("users/123/test.jpg")).thenReturn(false);

        // Act & Assert
        mockMvc.perform(get(BASE_URL + "/test.jpg/url"))
                .andExpect(status().isNotFound());

        verify(storageService, never()).getPresignedDownloadUrl(anyString(), anyInt());
    }

    @Test
    void listUserPhotos_ShouldReturnPhotoList() throws Exception {
        // Arrange
        List<String> photos = Arrays.asList(
                "users/123/photo1.jpg",
                "users/123/photo2.jpg",
                "users/123/avatar.jpg"
        );
        when(storageService.listPhotos("users/123/")).thenReturn(photos);

        // Act & Assert
        mockMvc.perform(get(BASE_URL))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId").value(USER_ID))
                .andExpect(jsonPath("$.totalPhotos").value(3))
                .andExpect(jsonPath("$.photos[0]").value("photo1.jpg"))
                .andExpect(jsonPath("$.photos[1]").value("photo2.jpg"))
                .andExpect(jsonPath("$.photos[2]").value("avatar.jpg"));
    }

    @Test
    void userPhotoExists_WhenPhotoExists_ShouldReturnTrue() throws Exception {
        // Arrange
        when(storageService.photoExists("users/123/test.jpg")).thenReturn(true);

        // Act & Assert
        mockMvc.perform(get(BASE_URL + "/test.jpg/exists"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId").value(USER_ID))
                .andExpect(jsonPath("$.photoName").value("test.jpg"))
                .andExpect(jsonPath("$.exists").value(true));
    }

    @Test
    void userPhotoExists_WhenPhotoDoesNotExist_ShouldReturnFalse() throws Exception {
        // Arrange
        when(storageService.photoExists("users/123/test.jpg")).thenReturn(false);

        // Act & Assert
        mockMvc.perform(get(BASE_URL + "/test.jpg/exists"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.exists").value(false));
    }

    @Test
    void getUserPhotoInfo_WhenPhotoExists_ShouldReturnInfo() throws Exception {
        // Arrange
        PhotoMetadata metadata = new PhotoMetadata(
                "photos",
                "users/123/test.jpg",
                1024L,
                "image/jpeg",
                ZonedDateTime.now(),
                "etag123"
        );

        when(storageService.photoExists("users/123/test.jpg")).thenReturn(true);
        when(storageService.getPhotoInfo("users/123/test.jpg")).thenReturn(metadata);

        // Act & Assert
        mockMvc.perform(get(BASE_URL + "/test.jpg/info"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId").value(USER_ID))
                .andExpect(jsonPath("$.photoName").value("test.jpg"))
                .andExpect(jsonPath("$.size").value(1024))
                .andExpect(jsonPath("$.contentType").value("image/jpeg"))
                .andExpect(jsonPath("$.etag").value("etag123"));
    }

    @Test
    void getUserPhotoInfo_WhenPhotoDoesNotExist_ShouldReturnNotFound() throws Exception {
        // Arrange
        when(storageService.photoExists("users/123/test.jpg")).thenReturn(false);

        // Act & Assert
        mockMvc.perform(get(BASE_URL + "/test.jpg/info"))
                .andExpect(status().isNotFound());

        verify(storageService, never()).getPhotoInfo(anyString());
    }

    @Test
    void getAllUserPhotoUrls_ShouldReturnUrlsForAllPhotos() throws Exception {
        // Arrange
        List<String> photos = Arrays.asList(
                "users/123/photo1.jpg",
                "users/123/photo2.jpg"
        );
        when(storageService.listPhotos("users/123/")).thenReturn(photos);
        when(storageService.getPresignedDownloadUrl(anyString(), eq(60)))
                .thenReturn("https://storage.example.com/photo.jpg?token=xyz");

        // Act & Assert
        mockMvc.perform(get(BASE_URL + "/urls")
                        .param("expiryMinutes", "60"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId").value(USER_ID))
                .andExpect(jsonPath("$.totalPhotos").value(2))
                .andExpect(jsonPath("$.expiryMinutes").value(60))
                .andExpect(jsonPath("$.photos[0].photoName").value("photo1.jpg"))
                .andExpect(jsonPath("$.photos[1].photoName").value("photo2.jpg"));

        verify(storageService, times(2)).getPresignedDownloadUrl(anyString(), eq(60));
    }
}