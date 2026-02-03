// Exemplo de integração completa com entidade User

// ============================================
// 1. ENTIDADE USER
// ============================================

package br.com.amooora.users.database.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    @Column(name = "avatar_path")
    private String avatarPath; // Caminho do avatar no storage
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Transient
    private String avatarUrl; // URL temporária (não salva no banco)
    
    @Transient
    private Integer photoCount; // Contador de fotos (não salva no banco)
}

// ============================================
// 2. DTO COM AVATAR URL
// ============================================

package br.com.amooora.users.dto;

import lombok.Data;
import java.util.List;

@Data
public class UserProfileDto {
    private Long id;
    private String name;
    private String email;
    private String avatarUrl;
    private Integer photoCount;
    private List<PhotoDto> photos;
    
    @Data
    public static class PhotoDto {
        private String name;
        private String url;
        private Long size;
        private String contentType;
    }
}

// ============================================
// 3. SERVICE INTEGRADO
// ============================================

package br.com.amooora.users.service;

import br.com.amooora.users.database.entity.User;
import br.com.amooora.users.database.repository.UserRepository;
import br.com.amooora.users.dto.UserProfileDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;
    private final UserPhotoService userPhotoService;
    
    /**
     * Atualiza o avatar do usuário
     */
    @Transactional
    public User updateAvatar(Long userId, MultipartFile file) throws IOException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        // Upload do avatar
        String avatarPath = userPhotoService.uploadUserAvatar(
            user.getId().toString(), 
            file
        );
        
        // Atualiza no banco
        user.setAvatarPath(avatarPath);
        user.setUpdatedAt(LocalDateTime.now());
        
        return userRepository.save(user);
    }
    
    /**
     * Adiciona foto ao perfil do usuário
     */
    @Transactional
    public String addUserPhoto(Long userId, MultipartFile file) throws IOException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        return userPhotoService.uploadUserPhoto(user.getId().toString(), file);
    }
    
    /**
     * Obtém perfil completo do usuário com fotos
     */
    public UserProfileDto getUserProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        UserProfileDto dto = new UserProfileDto();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        
        String userIdStr = user.getId().toString();
        
        // Gera URL do avatar se existir
        if (userPhotoService.userHasAvatar(userIdStr)) {
            dto.setAvatarUrl(userPhotoService.getUserAvatarUrl(userIdStr, 60));
        }
        
        // Conta fotos
        dto.setPhotoCount(userPhotoService.countUserPhotos(userIdStr));
        
        // Lista fotos com URLs
        List<UserProfileDto.PhotoDto> photos = userPhotoService
                .getAllUserPhotoUrls(userIdStr, 60)
                .stream()
                .map(info -> {
                    UserProfileDto.PhotoDto photoDto = new UserProfileDto.PhotoDto();
                    photoDto.setName(info.photoName());
                    photoDto.setUrl(info.url());
                    return photoDto;
                })
                .toList();
        
        dto.setPhotos(photos);
        
        return dto;
    }
    
    /**
     * Cria usuário com avatar
     */
    @Transactional
    public User createUserWithAvatar(String name, String email, MultipartFile avatar) 
            throws IOException {
        
        // Cria usuário
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        
        user = userRepository.save(user);
        
        // Upload do avatar
        if (avatar != null && !avatar.isEmpty()) {
            String avatarPath = userPhotoService.uploadUserAvatar(
                user.getId().toString(), 
                avatar
            );
            user.setAvatarPath(avatarPath);
            user = userRepository.save(user);
        }
        
        return user;
    }
}

// ============================================
// 4. CONTROLLER COMPLETO
// ============================================

package br.com.amooora.users.controller;

import br.com.amooora.users.database.entity.User;
import br.com.amooora.users.dto.UserProfileDto;
import br.com.amooora.users.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    
    private final UserService userService;
    
    /**
     * Criar usuário com avatar
     */
    @PostMapping
    public ResponseEntity<User> createUser(
            @RequestParam String name,
            @RequestParam String email,
            @RequestParam(required = false) MultipartFile avatar) throws IOException {
        
        User user = userService.createUserWithAvatar(name, email, avatar);
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }
    
    /**
     * Obter perfil completo do usuário
     */
    @GetMapping("/{id}/profile")
    public ResponseEntity<UserProfileDto> getUserProfile(@PathVariable Long id) {
        UserProfileDto profile = userService.getUserProfile(id);
        return ResponseEntity.ok(profile);
    }
    
    /**
     * Atualizar avatar
     */
    @PutMapping("/{id}/avatar")
    public ResponseEntity<Map<String, String>> updateAvatar(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) throws IOException {
        
        User user = userService.updateAvatar(id, file);
        
        return ResponseEntity.ok(Map.of(
            "message", "Avatar atualizado com sucesso",
            "avatarPath", user.getAvatarPath()
        ));
    }
    
    /**
     * Adicionar foto ao perfil
     */
    @PostMapping("/{id}/photos")
    public ResponseEntity<Map<String, String>> addPhoto(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) throws IOException {
        
        String photoName = userService.addUserPhoto(id, file);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
            "message", "Foto adicionada com sucesso",
            "photoName", photoName
        ));
    }
}

// ============================================
// 5. REPOSITORY
// ============================================

package br.com.amooora.users.database.repository;

import br.com.amooora.users.database.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}

// ============================================
// 6. EXEMPLO DE USO
// ============================================

/*
// Criar usuário com avatar
POST /api/users
Content-Type: multipart/form-data

name=João Silva
email=joao@example.com
avatar=@avatar.jpg

// Obter perfil completo
GET /api/users/1/profile

Resposta:
{
  "id": 1,
  "name": "João Silva",
  "email": "joao@example.com",
  "avatarUrl": "https://...",
  "photoCount": 3,
  "photos": [
    {
      "name": "avatar.jpg",
      "url": "https://..."
    },
    {
      "name": "documento.jpg",
      "url": "https://..."
    }
  ]
}

// Atualizar avatar
PUT /api/users/1/avatar
Content-Type: multipart/form-data

file=@novo-avatar.jpg

// Adicionar foto
POST /api/users/1/photos
Content-Type: multipart/form-data

file=@foto.jpg
*/