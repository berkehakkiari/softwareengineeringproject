package com.stc.util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DatabaseConnection {

private static final String URL = "jdbc:sqlite:C:/Users/angel/Desktop/STC/Database/STC_Attendance_System.db";  
private static Connection connection = null;

public static Connection getConnection() {
    try {
        Class.forName("org.sqlite.JDBC");
        if (connection == null || connection.isClosed()) {
            connection = DriverManager.getConnection(URL);
            System.out.println("Connected to database.");
        }
    } catch (ClassNotFoundException | SQLException e) {
        System.out.println("Connection failed: " + e.getMessage());
    }
    return connection;
}

    public static void closeConnection() {
        try {
            if (connection != null && !connection.isClosed()) {
                connection.close();
                System.out.println("Connection closed.");
            }
        } catch (SQLException e) {
            System.out.println("Error closing connection: " + e.getMessage());
        }
    }
}