package com.stc;

import com.stc.util.DatabaseConnection;
import java.sql.Connection;

public class Main {
    public static void main(String[] args) {
        Connection conn = DatabaseConnection.getConnection();
        if (conn != null) {
            System.out.println("SUCCESS - Database is connected!");
            DatabaseConnection.closeConnection();
        } else {
            System.out.println("FAILED - Could not connect to database.");
        }
    }
}