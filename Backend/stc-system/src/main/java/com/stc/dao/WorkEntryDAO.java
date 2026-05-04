package com.stc.dao;

import com.stc.model.WorkEntry;
import com.stc.util.DatabaseConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class WorkEntryDAO {

    public void addWorkEntry(WorkEntry entry) {
        String sql = "INSERT INTO WorkEntry (sheetID, Date, startTime, endTime, breakDuration) VALUES (?, ?, ?, ?, ?)";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, entry.getSheetID());
            stmt.setString(2, entry.getDate());
            stmt.setString(3, entry.getStartTime());
            stmt.setString(4, entry.getEndTime());
            stmt.setInt(5, entry.getBreakDuration());
            stmt.executeUpdate();
            System.out.println("Work entry added.");
        } catch (SQLException e) {
            System.out.println("Error adding work entry: " + e.getMessage());
        }
    }

    public List<WorkEntry> getEntriesBySheet(int sheetID) {
        List<WorkEntry> entries = new ArrayList<>();
        String sql = "SELECT * FROM WorkEntry WHERE sheetID = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, sheetID);
            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                entries.add(new WorkEntry(
                    rs.getInt("entryID"),
                    rs.getInt("sheetID"),
                    rs.getString("Date"),
                    rs.getString("startTime"),
                    rs.getString("endTime"),
                    rs.getInt("breakDuration")
                ));
            }
        } catch (SQLException e) {
            System.out.println("Error getting work entries: " + e.getMessage());
        }
        return entries;
    }

    public void deleteEntry(int entryID) {
        String sql = "DELETE FROM WorkEntry WHERE entryID = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, entryID);
            stmt.executeUpdate();
            System.out.println("Work entry deleted.");
        } catch (SQLException e) {
            System.out.println("Error deleting work entry: " + e.getMessage());
        }
    }

    public void deleteEntriesBySheet(int sheetID) {
        String sql = "DELETE FROM WorkEntry WHERE sheetID = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, sheetID);
            stmt.executeUpdate();
            System.out.println("All entries deleted for sheet: " + sheetID);
        } catch (SQLException e) {
            System.out.println("Error deleting entries: " + e.getMessage());
        }
    }
}