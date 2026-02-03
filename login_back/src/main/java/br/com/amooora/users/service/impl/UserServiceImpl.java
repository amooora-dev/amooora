package br.com.amooora.users.service.impl;

import br.com.amooora.users.database.model.User;
import br.com.amooora.users.database.repository.UserRepository;
import br.com.amooora.users.service.UserService;
import br.com.amooora.users.service.dto.UserDTO;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    private UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository){
        this.userRepository = userRepository;
    }

    @Override
    public List<UserDTO> findAll() {
        var result = userRepository.findAll();
        return result.stream()
                .map(UserDTO::fromUser)
                .collect(Collectors.toList());
    }

    @Override
    public UserDTO findUserById(Long id) {
        var result = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        return UserDTO.fromUser(result);
    }

    @Override
    public UserDTO findUserByEmail(String email){

        var result = userRepository.findUserByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));;
        return UserDTO.fromUser(result);
    }

    @Override
    public UserDTO saveUser(UserDTO userDTO) {
        var result = userRepository.save(UserDTO.toUser(userDTO));
        return UserDTO.fromUser(result);
    }

    @Override
    public UserDTO updateUser(UserDTO userDTO) {
        UserDTO user = findUserById(userDTO.id());
        User userToUpdate = UserDTO.toUser(userDTO);
        userToUpdate.setId(user.id());
        var result = userRepository.save(userToUpdate);
        return UserDTO.fromUser(result);
    }

    @Override
    public void deleteUser(Long id) {
        if( !userRepository.existsById(id)) throw new RuntimeException("Usuário não encontrado");
        userRepository.deleteById(id);
    }
}
