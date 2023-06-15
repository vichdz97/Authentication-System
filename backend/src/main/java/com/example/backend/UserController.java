package com.example.backend;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;

@CrossOrigin(origins = "http://authentication-system.s3-website.us-east-2.amazonaws.com")
@RestController
@RequestMapping("/api/v1/users")
public class UserController {
    
    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.OK)
    public void createUser(@RequestBody User user) {
        userRepository.save(user);
    }

    @GetMapping("/{id}")
    public Optional<User> getUser(@PathVariable("id") int id) {
        return userRepository.findById(id);
    }

    @PutMapping("/{id}")
    public User updateUser(@RequestBody User newUser, @PathVariable("id") int id) {
        return userRepository.findById(id)
        .map( user -> {
            user.setUsername(newUser.getUsername());
            user.setPassword(newUser.getPassword());
            user.setRole(newUser.getRole());
            return userRepository.save(user);
        })
        .orElseGet(() -> {
            newUser.setId(id);
            return userRepository.save(newUser);
        });
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable("id") int id) {
        userRepository.deleteById(id);
    }

}
