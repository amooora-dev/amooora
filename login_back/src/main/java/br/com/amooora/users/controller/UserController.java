package br.com.amooora.users.controller;

import br.com.amooora.users.service.UserService;
import br.com.amooora.users.service.dto.UserDTO;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    private UserService userService;

    public UserController(UserService userService){
        this.userService = userService;
    }

    @GetMapping("")
    public List<UserDTO> findAll(){
        return userService.findAll();
    }

    @GetMapping("/id")
    public UserDTO findUserById(@RequestHeader("userId") Long id){
        return userService.findUserById(id);
    }

    @GetMapping("/email")
    public UserDTO findUserByEmail(@RequestHeader("email") String email){
        return userService.findUserByEmail(email);
    }

    @PostMapping("")
    public UserDTO saveUser(@RequestBody UserDTO user){
        return userService.saveUser(user);
    }

    @PutMapping("")
    public UserDTO updateUser(@RequestBody UserDTO userDTO){
        return userService.updateUser(userDTO);
    }

    @DeleteMapping("")
    public void deleteUser(@RequestHeader("userId") Long id){
        userService.deleteUser(id);
    }
}
