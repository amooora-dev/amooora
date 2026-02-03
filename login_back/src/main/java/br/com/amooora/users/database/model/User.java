package br.com.amooora.users.database.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "user")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String name;

    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String phone_number;

    private boolean open_network;

    @NotBlank
    private String cep;

    @Past
    @NotNull
    private LocalDate birthday;

    private String biography;

    private String url_picture;

    public User(String name, String email, String phone_number,
                String cep, LocalDate birthday, String biography, String url_picture) {
        this.name = name;
        this.email = email;
        this.phone_number = phone_number;
        this.cep = cep;
        this.birthday = birthday;
        this.biography = biography;
        this.url_picture = url_picture;
    }
}
