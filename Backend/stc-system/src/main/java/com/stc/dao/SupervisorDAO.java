package com.stc.dao;

import com.stc.model.Supervisor;
import com.stc.util.DatabaseConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class SupervisorDAO {

    public void addSupervisor(Supervisor supervisor) {
        String sqlUser = "INSERT INTO User (UserID, Name, Email, Role) VALUES (?, ?, ?, ?)";
        String sqlSupervisor = "INSERT INTO Supervisor (UserID, Department) VALUES (?, ?)";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmtUser = conn.prepareStatement(sqlUser);
             PreparedStatement stmtSupervisor = conn.prepareStatement(sqlSupervisor)) {
            stmtUser.setInt(1, supervisor.getUserID());
            stmtUser.setString(2, supervisor.getName());
            stmtUser.setString(3, supervisor.getEmail());
            stmtUser.setString(4, supervisor.getRole());
            stmtUser.executeUpdate();
            stmtSupervisor.setInt(1, supervisor.getUserID());
            stmtSupervisor.setInt(2, supervisor.getDepartment());
            stmtSupervisor.executeUpdate();
            System.out.println("Supervisor added.");
        } catch (SQLException e) {
            System.out.println("Error adding supervisor: " + e.getMessage());
        }
    }

    public Supervisor getSupervisorByID(int userID) {
        String sql = "SELECT u.UserID, u.Name, u.Email, u.Role, s.Department " +
                     "FROM User u JOIN Supervisor s ON u.UserID = s.UserID WHERE u.UserID = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, userID);
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                return new Supervisor(
                    rs.getInt("UserID"),
                    rs.getString("Name"),
                    rs.getString("Email"),
                    rs.getString("Role"),
                    rs.getInt("Department")
                );
            }
        } catch (SQLException e) {
            System.out.println("Error getting supervisor: " + e.getMessage());
        }
        return null;
    }

    public List<Supervisor> getAllSupervisors() {
        List<Supervisor> supervisors = new ArrayList<>();
        String sql = "SELECT u.UserID, u.Name, u.Email, u.Role, s.Department " +
                     "FROM User u JOIN Supervisor s ON u.UserID = s.UserID";
        try (Connection conn = DatabaseConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                supervisors.add(new Supervisor(
                    rs.getInt("UserID"),
                    rs.getString("Name"),
                    rs.getString("Email"),
                    rs.getString("Role"),
                    rs.getInt("Department")
                ));
            }
        } catch (SQLException e) {
            System.out.println("Error getting supervisors: " + e.getMessage());
        }
        return supervisors;
    }
}