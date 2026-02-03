package br.com.amooora.users.service;

import br.com.amooora.users.service.dto.UserDTO;

import java.util.List;

public interface UserService {

    List<UserDTO> findAll();
    UserDTO findUserById(Long id);
    UserDTO findUserByEmail(String email);
    UserDTO saveUser(UserDTO userDTO);
    UserDTO updateUser(UserDTO userDTO);
    void deleteUser(Long id);

}
