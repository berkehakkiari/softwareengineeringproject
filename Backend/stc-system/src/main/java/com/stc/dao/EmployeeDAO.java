package com.stc.dao;

import com.stc.model.Employee;
import com.stc.util.DatabaseConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class EmployeeDAO {

    public void addEmployee(Employee employee) {
        String sqlUser = "INSERT INTO User (UserID, Name, Email, Role) VALUES (?, ?, ?, ?)";
        String sqlEmployee = "INSERT INTO Employee (UserID, flexTimeBalance, vacationDays) VALUES (?, ?, ?)";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmtUser = conn.prepareStatement(sqlUser);
             PreparedStatement stmtEmployee = conn.prepareStatement(sqlEmployee)) {
            stmtUser.setInt(1, employee.getUserID());
            stmtUser.setString(2, employee.getName());
            stmtUser.setString(3, employee.getEmail());
            stmtUser.setString(4, employee.getRole());
            stmtUser.executeUpdate();
            stmtEmployee.setInt(1, employee.getUserID());
            stmtEmployee.setDouble(2, employee.getFlexTimeBalance());
            stmtEmployee.setInt(3, employee.getVacationDays());
            stmtEmployee.executeUpdate();
            System.out.println("Employee added.");
        } catch (SQLException e) {
            System.out.println("Error adding employee: " + e.getMessage());
        }
    }

    public Employee getEmployeeByID(int userID) {
        String sql = "SELECT u.UserID, u.Name, u.Email, u.Role, e.flexTimeBalance, e.vacationDays " +
                     "FROM User u JOIN Employee e ON u.UserID = e.UserID WHERE u.UserID = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, userID);
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                return new Employee(
                    rs.getInt("UserID"),
                    rs.getString("Name"),
                    rs.getString("Email"),
                    rs.getString("Role"),
                    rs.getDouble("flexTimeBalance"),
                    rs.getInt("vacationDays")
                );
            }
        } catch (SQLException e) {
            System.out.println("Error getting employee: " + e.getMessage());
        }
        return null;
    }

    public List<Employee> getAllEmployees() {
        List<Employee> employees = new ArrayList<>();
        String sql = "SELECT u.UserID, u.Name, u.Email, u.Role, e.flexTimeBalance, e.vacationDays " +
                     "FROM User u JOIN Employee e ON u.UserID = e.UserID";
        try (Connection conn = DatabaseConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                employees.add(new Employee(
                    rs.getInt("UserID"),
                    rs.getString("Name"),
                    rs.getString("Email"),
                    rs.getString("Role"),
                    rs.getDouble("flexTimeBalance"),
                    rs.getInt("vacationDays")
                ));
            }
        } catch (SQLException e) {
            System.out.println("Error getting employees: " + e.getMessage());
        }
        return employees;
    }

    public void updateEmployee(Employee employee) {
        String sqlUser = "UPDATE User SET Name = ?, Email = ? WHERE UserID = ?";
        String sqlEmployee = "UPDATE Employee SET flexTimeBalance = ?, vacationDays = ? WHERE UserID = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmtUser = conn.prepareStatement(sqlUser);
             PreparedStatement stmtEmployee = conn.prepareStatement(sqlEmployee)) {
            stmtUser.setString(1, employee.getName());
            stmtUser.setString(2, employee.getEmail());
            stmtUser.setInt(3, employee.getUserID());
            stmtUser.executeUpdate();
            stmtEmployee.setDouble(1, employee.getFlexTimeBalance());
            stmtEmployee.setInt(2, employee.getVacationDays());
            stmtEmployee.setInt(3, employee.getUserID());
            stmtEmployee.executeUpdate();
            System.out.println("Employee updated.");
        } catch (SQLException e) {
            System.out.println("Error updating employee: " + e.getMessage());
        }
    }
}