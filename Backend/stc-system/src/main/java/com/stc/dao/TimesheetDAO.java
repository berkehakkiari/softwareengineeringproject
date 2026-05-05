package com.stc.dao;

import com.stc.model.Timesheet;
import com.stc.util.DatabaseConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class TimesheetDAO {

    public void addTimesheet(Timesheet timeSheet) {
        String sql = "INSERT INTO TimeSheet (employeeID, supervisorID, month, year, totalHours, status) VALUES (?, ?, ?, ?, ?, ?)";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, timeSheet.getEmployeeID());
            stmt.setInt(2, timeSheet.getSupervisorID());
            stmt.setInt(3, timeSheet.getMonth());
            stmt.setInt(4, timeSheet.getYear());
            stmt.setDouble(5, timeSheet.getTotalHours());
            stmt.setString(6, "DRAFT");
            stmt.executeUpdate();
            System.out.println("TimeSheet created.");
        } catch (SQLException e) {
            System.out.println("Error creating timesheet: " + e.getMessage());
        }
    }

    public Timesheet getTimesheetByID(int sheetID) {
        String sql = "SELECT * FROM Timesheet WHERE sheetID = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, sheetID);
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                return new Timesheet(
                    rs.getInt("sheetID"),
                    rs.getInt("employeeID"),
                    rs.getInt("supervisorID"),
                    rs.getInt("month"),
                    rs.getInt("year"),
                    rs.getDouble("totalHours"),
                    rs.getString("status")
                );
            }
        } catch (SQLException e) {
            System.out.println("Error getting Timesheet: " + e.getMessage());
        }
        return null;
    }

    public List<Timesheet> getTimesheetsByEmployee(int employeeID) {
        List<Timesheet> sheets = new ArrayList<>();
        String sql = "SELECT * FROM Timesheet WHERE employeeID = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, employeeID);
            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                sheets.add(new Timesheet(
                    rs.getInt("sheetID"),
                    rs.getInt("employeeID"),
                    rs.getInt("supervisorID"),
                    rs.getInt("month"),
                    rs.getInt("year"),
                    rs.getDouble("totalHours"),
                    rs.getString("status")
                ));
            }
        } catch (SQLException e) {
            System.out.println("Error getting Timesheets: " + e.getMessage());
        }
        return sheets;
    }

    // Alias for REST API compatibility
    public List<Timesheet> getTimesheetsByEmployeeID(int employeeID) {
        return getTimesheetsByEmployee(employeeID);
    }

    public List<Timesheet> getTimesheetsBySupervisor(int supervisorID) {
        List<Timesheet> sheets = new ArrayList<>();
        String sql = "SELECT * FROM Timesheet WHERE supervisorID = ? AND status = 'LOCKED'";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, supervisorID);
            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                sheets.add(new Timesheet(
                    rs.getInt("sheetID"),
                    rs.getInt("employeeID"),
                    rs.getInt("supervisorID"),
                    rs.getInt("month"),
                    rs.getInt("year"),
                    rs.getDouble("totalHours"),
                    rs.getString("status")
                ));
            }
        } catch (SQLException e) {
            System.out.println("Error getting Timesheets: " + e.getMessage());
        }
        return sheets;
    }

    // Alias for REST API compatibility
    public List<Timesheet> getTimesheetsBySupervisorID(int supervisorID) {
        return getTimesheetsBySupervisor(supervisorID);
    }

    public List<Timesheet> getAllTimesheets() {
        List<Timesheet> sheets = new ArrayList<>();
        String sql = "SELECT * FROM Timesheet";
        try (Connection conn = DatabaseConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                sheets.add(new Timesheet(
                    rs.getInt("sheetID"),
                    rs.getInt("employeeID"),
                    rs.getInt("supervisorID"),
                    rs.getInt("month"),
                    rs.getInt("year"),
                    rs.getDouble("totalHours"),
                    rs.getString("status")
                ));
            }
        } catch (SQLException e) {
            System.out.println("Error getting all Timesheets: " + e.getMessage());
        }
        return sheets;
    }

    public void updateStatus(int sheetID, String status) {
        String sql = "UPDATE Timesheet SET status = ? WHERE sheetID = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, status);
            stmt.setInt(2, sheetID);
            stmt.executeUpdate();
            System.out.println("Timesheet status updated to: " + status);
        } catch (SQLException e) {
            System.out.println("Error updating status: " + e.getMessage());
        }
    }

    public void updateTotalHours(int sheetID, double totalHours) {
        String sql = "UPDATE Timesheet SET totalHours = ? WHERE sheetID = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setDouble(1, totalHours);
            stmt.setInt(2, sheetID);
            stmt.executeUpdate();
            System.out.println("Total hours updated.");
        } catch (SQLException e) {
            System.out.println("Error updating total hours: " + e.getMessage());
        }
    }
}