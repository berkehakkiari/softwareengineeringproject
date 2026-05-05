package com.stc.dao;

import com.stc.model.LeaveRequest;
import com.stc.util.DatabaseConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class LeaveRequestDAO {

    public void addLeaveRequest(LeaveRequest request) {
        String sql = "INSERT INTO LeaveRequest (employeeID, supervisorID, startDate, endDate, type, status) VALUES (?, ?, ?, ?, ?, ?)";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, request.getEmployeeID());
            stmt.setInt(2, request.getSupervisorID());
            stmt.setString(3, request.getStartDate());
            stmt.setString(4, request.getEndDate());
            stmt.setString(5, request.getType());
            stmt.setString(6, "PENDING");
            stmt.executeUpdate();
            System.out.println("Leave request submitted.");
        } catch (SQLException e) {
            System.out.println("Error submitting leave request: " + e.getMessage());
        }
    }

    public LeaveRequest getLeaveRequestByID(int leaveID) {
        String sql = "SELECT * FROM LeaveRequest WHERE leaveID = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, leaveID);
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                return new LeaveRequest(
                    rs.getInt("leaveID"),
                    rs.getInt("employeeID"),
                    rs.getInt("supervisorID"),
                    rs.getString("startDate"),
                    rs.getString("endDate"),
                    rs.getString("type"),
                    rs.getString("status")
                );
            }
        } catch (SQLException e) {
            System.out.println("Error getting leave request: " + e.getMessage());
        }
        return null;
    }

    public List<LeaveRequest> getLeaveRequestsByEmployee(int employeeID) {
        List<LeaveRequest> requests = new ArrayList<>();
        String sql = "SELECT * FROM LeaveRequest WHERE employeeID = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, employeeID);
            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                requests.add(new LeaveRequest(
                    rs.getInt("leaveID"),
                    rs.getInt("employeeID"),
                    rs.getInt("supervisorID"),
                    rs.getString("startDate"),
                    rs.getString("endDate"),
                    rs.getString("type"),
                    rs.getString("status")
                ));
            }
        } catch (SQLException e) {
            System.out.println("Error getting leave requests: " + e.getMessage());
        }
        return requests;
    }

    // Alias for REST API compatibility
    public List<LeaveRequest> getRequestsByEmployeeID(int employeeID) {
        return getLeaveRequestsByEmployee(employeeID);
    }

    public List<LeaveRequest> getPendingRequestsBySupervisor(int supervisorID) {
        List<LeaveRequest> requests = new ArrayList<>();
        String sql = "SELECT * FROM LeaveRequest WHERE supervisorID = ? AND status = 'PENDING'";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, supervisorID);
            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                requests.add(new LeaveRequest(
                    rs.getInt("leaveID"),
                    rs.getInt("employeeID"),
                    rs.getInt("supervisorID"),
                    rs.getString("startDate"),
                    rs.getString("endDate"),
                    rs.getString("type"),
                    rs.getString("status")
                ));
            }
        } catch (SQLException e) {
            System.out.println("Error getting pending requests: " + e.getMessage());
        }
        return requests;
    }

    // Alias for REST API compatibility
    public List<LeaveRequest> getPendingRequestsBySupervisorID(int supervisorID) {
        return getPendingRequestsBySupervisor(supervisorID);
    }

    public List<LeaveRequest> getAllLeaveRequests() {
        List<LeaveRequest> requests = new ArrayList<>();
        String sql = "SELECT * FROM LeaveRequest";
        try (Connection conn = DatabaseConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                requests.add(new LeaveRequest(
                    rs.getInt("leaveID"),
                    rs.getInt("employeeID"),
                    rs.getInt("supervisorID"),
                    rs.getString("startDate"),
                    rs.getString("endDate"),
                    rs.getString("type"),
                    rs.getString("status")
                ));
            }
        } catch (SQLException e) {
            System.out.println("Error getting all leave requests: " + e.getMessage());
        }
        return requests;
    }

    public void updateType(int leaveID, String type) {
        String sql = "UPDATE LeaveRequest SET type = ? WHERE leaveID = ?";
        try (Connection conn = DatabaseConnection.getConnection();
            PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, type);
            stmt.setInt(2, leaveID);
            stmt.executeUpdate();
            System.out.println("Leave type updated to: " + type);
        } catch (SQLException e) {
            System.out.println("Error updating leave type: " + e.getMessage());
        }
    }

    public void updateStatus(int leaveID, String status) {
        String sql = "UPDATE LeaveRequest SET status = ? WHERE leaveID = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, status);
            stmt.setInt(2, leaveID);
            stmt.executeUpdate();
            System.out.println("Leave request status updated to: " + status);
        } catch (SQLException e) {
            System.out.println("Error updating leave request: " + e.getMessage());
        }
    }
}