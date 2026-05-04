package com.stc.controller;

import com.stc.model.User;
import com.stc.service.UserService;

public class UserController {
    private UserService service = new UserService();

    public User login(String email, String role) {
        return service.login(email, role);
    }

    public void register(int userID, String name, String email, String role) {
        service.registerUser(userID, name, email, role);
    }
}