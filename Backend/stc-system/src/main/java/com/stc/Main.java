package com.stc;

import com.stc.dao.UserDAO;
import com.stc.model.User;

public class Main {
    public static void main(String[] args) {
        UserDAO UserDAO = new UserDAO();

        // Add a test user
        User user = new User(1, "Angel", "angel@stc.com", "EMPLOYEE");
        UserDAO.addUser(user);

        // Retrieve and print it
        User retrieved = UserDAO.getUserByID(1);
        System.out.println(retrieved);
    }
}