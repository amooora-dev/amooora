package br.com.amooora.users.service.dto;

import br.com.amooora.users.database.model.User;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;

import java.time.LocalDate;

public record UserDTO (
        Long id,
        @NotBlank String name,
        @Email @NotBlank String email,
        @NotBlank String phone_number,
        @NotBlank String cep,
        @Past @NotNull @JsonFormat(pattern = "dd/MM/yyyy") LocalDate birthday,
        String biography,
        String url_picture
) {
    public static UserDTO fromUser(User user){
        return new UserDTO(user.getId(), user.getName(), user.getEmail(),
                user.getPhone_number(), user.getCep(), user.getBirthday(),
                user.getBiography(), user.getUrl_picture()
        );
    }

    public static User toUser(UserDTO user){
        return new User(user.name, user.email,
                user.phone_number, user.cep, user.birthday,
                user.biography, user.url_picture
        );
    }
}
