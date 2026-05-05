package com.stc.api;

import com.stc.model.User;
import com.stc.service.UserService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private UserService userService = new UserService();

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        User user = userService.login(request.getEmail(), request.getRole());
        if (user != null) {
            return new LoginResponse(true, "Login successful", user);
        } else {
            return new LoginResponse(false, "Invalid credentials", null);
        }
    }

    @PostMapping("/register")
    public ApiResponse register(@RequestBody RegisterRequest request) {
        try {
            userService.registerUser(request.getUserID(), request.getName(), request.getEmail(), request.getRole());
            return new ApiResponse(true, "User registered successfully");
        } catch (Exception e) {
            return new ApiResponse(false, "Registration failed: " + e.getMessage());
        }
    }

    // DTO Classes
    public static class LoginRequest {
        public String email;
        public String role;

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
    }

    public static class LoginResponse {
        public boolean success;
        public String message;
        public User user;

        public LoginResponse(boolean success, String message, User user) {
            this.success = success;
            this.message = message;
            this.user = user;
        }
    }

    public static class RegisterRequest {
        public int userID;
        public String name;
        public String email;
        public String role;

        public int getUserID() { return userID; }
        public void setUserID(int userID) { this.userID = userID; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
    }

    public static class ApiResponse {
        public boolean success;
        public String message;

        public ApiResponse(boolean success, String message) {
            this.success = success;
            this.message = message;
        }
    }
}
