package com.stc.service;

import com.stc.dao.UserDAO;
import com.stc.model.User;

public class UserService {
    private UserDAO dao = new UserDAO();

    public User login(String email, String role) {
        User user = dao.getUserByEmail(email);
        if (user == null) {
            System.out.println("User not found.");
            return null;
        }
        if (!user.getRole().equals(role)) {
            System.out.println("Invalid role.");
            return null;
        }
        System.out.println("Login successful. Welcome " + user.getName());
        return user;
    }

    public void registerUser(int userID, String name, String email, String role) {
        User user = new User(userID, name, email, role);
        dao.addUser(user);
    }
}