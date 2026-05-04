package com.stc.dao;

import com.stc.util.DatabaseConnection;

import java.sql.*;


public class TimesheetDAO {

    public void insertTimesheet(int employeeId, int supervisorId, int month, int year, double hours) {
        String sql = "INSERT INTO TimeSheet (employeeID, supervisorID, month, year, totalHours, status) VALUES (?, ?, ?, ?, ?, 'PENDING')";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, employeeId);
            stmt.setInt(2, supervisorId);
            stmt.setInt(3, month);
            stmt.setInt(4, year);
            stmt.setDouble(5, hours);

            stmt.executeUpdate();
            System.out.println("Timesheet submitted!");

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public void updateStatus(int sheetId, String status) {
        String sql = "UPDATE TimeSheet SET status=? WHERE sheetID=?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, status);
            stmt.setInt(2, sheetId);

            stmt.executeUpdate();
            System.out.println("Timesheet updated: " + status);

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}