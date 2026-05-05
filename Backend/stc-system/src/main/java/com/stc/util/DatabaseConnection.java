package com.stc.util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DatabaseConnection {

    // Dynamically construct the database path based on the project location
    private static final String URL = constructDatabaseURL();
    private static Connection connection = null;

    private static String constructDatabaseURL() {
        String userDir = System.getProperty("user.dir");
        // Assuming the database is in Database/schema.db relative to the project root
        String dbPath = userDir.replace("\\", "/");
        if (dbPath.contains("/Backend/stc-system")) {
            dbPath = dbPath.substring(0, dbPath.indexOf("/Backend/stc-system"));
        }
        return "jdbc:sqlite:" + dbPath + "/Database/STC_Attendance_System.db";
    }

    public static Connection getConnection() {
        try {
            Class.forName("org.sqlite.JDBC");
            if (connection == null || connection.isClosed()) {
                connection = DriverManager.getConnection(URL);
                System.out.println("Connected to database: " + URL);
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