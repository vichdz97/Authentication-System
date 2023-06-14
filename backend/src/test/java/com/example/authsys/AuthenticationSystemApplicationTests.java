package com.example.authsys;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;
import org.springframework.boot.SpringBootConfiguration;
import org.springframework.boot.test.context.SpringBootTest;

import com.example.backend.User;

@SpringBootTest
@SpringBootConfiguration
class AuthenticationSystemApplicationTests {

	User user = new User(0, "user2023", "User!2023", "User");

	@Test
	void correctUsername() {
		assertEquals("user2023", user.getUsername());
	}

	@Test
	void correctPassword() {
		assertEquals("User!2023", user.getPassword());
	}
	
	@Test
	void correctRole() {
		assertEquals("User", user.getRole());
	}
}
