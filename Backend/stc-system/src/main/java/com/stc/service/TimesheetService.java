package com.stc.service;

import com.stc.dao.TimesheetDAO;
import com.stc.dao.WorkEntryDAO;
import com.stc.model.Timesheet;
import com.stc.model.WorkEntry;
import java.util.List;

public class TimesheetService {
    private TimesheetDAO timesheetDAO = new TimesheetDAO();
    private WorkEntryDAO workEntryDAO = new WorkEntryDAO();

    public void createTimesheet(int employeeID, int supervisorID, int month, int year) {
        Timesheet ts = new Timesheet(0, employeeID, supervisorID, month, year, 0.0, "DRAFT");
        timesheetDAO.addTimesheet(ts);
        System.out.println("Timesheet created in DRAFT state.");
    }

    public void addWorkEntry(WorkEntry entry) {
        Timesheet ts = timesheetDAO.getTimesheetByID(entry.getSheetID());
        if (ts == null) {
            System.out.println("Timesheet not found.");
            return;
        }
        if (!ts.getStatus().equals("DRAFT")) {
            System.out.println("Cannot edit. Timesheet is " + ts.getStatus());
            return;
        }
        workEntryDAO.addWorkEntry(entry);
        recalculateTotalHours(entry.getSheetID());
    }

    public void submitTimesheet(int sheetID) {
        Timesheet ts = timesheetDAO.getTimesheetByID(sheetID);
        if (ts == null) {
            System.out.println("Timesheet not found.");
            return;
        }
        if (!ts.getStatus().equals("DRAFT")) {
            System.out.println("Only DRAFT timesheets can be submitted.");
            return;
        }
        timesheetDAO.updateStatus(sheetID, "LOCKED");
        System.out.println("Timesheet submitted and locked. Supervisor notified.");
    }

    public void approveTimesheet(int sheetID) {
        Timesheet ts = timesheetDAO.getTimesheetByID(sheetID);
        if (ts == null) {
            System.out.println("Timesheet not found.");
            return;
        }
        if (!ts.getStatus().equals("LOCKED")) {
            System.out.println("Only LOCKED timesheets can be approved.");
            return;
        }
        timesheetDAO.updateStatus(sheetID, "APPROVED");
        System.out.println("Timesheet approved. Employee notified.");
    }

    public void rejectTimesheet(int sheetID, String reason) {
        Timesheet ts = timesheetDAO.getTimesheetByID(sheetID);
        if (ts == null) {
            System.out.println("Timesheet not found.");
            return;
        }
        if (!ts.getStatus().equals("LOCKED")) {
            System.out.println("Only LOCKED timesheets can be rejected.");
            return;
        }
        timesheetDAO.updateStatus(sheetID, "DRAFT");
        System.out.println("Timesheet rejected. Reason: " + reason + ". Employee can now edit.");
    }

    public Timesheet getTimesheet(int sheetID) {
        return timesheetDAO.getTimesheetByID(sheetID);
    }

    public List<Timesheet> getTimesheetsForEmployee(int employeeID) {
        return timesheetDAO.getTimesheetsByEmployee(employeeID);
    }

    public List<Timesheet> getTimesheetsForSupervisor(int supervisorID) {
        return timesheetDAO.getTimesheetsBySupervisor(supervisorID);
    }

    private void recalculateTotalHours(int sheetID) {
        List<WorkEntry> entries = workEntryDAO.getEntriesBySheet(sheetID);
        double total = 0.0;
        for (WorkEntry e : entries) {
            total += calculateHours(e.getStartTime(), e.getEndTime(), e.getBreakDuration());
        }
        timesheetDAO.updateTotalHours(sheetID, total);
    }

    private double calculateHours(String start, String end, int breakMinutes) {
        String[] s = start.split(":");
        String[] e = end.split(":");
        int startMins = Integer.parseInt(s[0]) * 60 + Integer.parseInt(s[1]);
        int endMins = Integer.parseInt(e[0]) * 60 + Integer.parseInt(e[1]);
        return (endMins - startMins - breakMinutes) / 60.0;
    }
}