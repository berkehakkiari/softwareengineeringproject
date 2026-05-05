package com.stc.service;

import com.stc.dao.EmployeeDAO;
import com.stc.dao.TimesheetDAO;
import com.stc.dao.WorkEntryDAO;
import com.stc.model.Employee;
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
        checkOvertimeAlerts(sheetID);
        checkRestPeriods(sheetID);
        timesheetDAO.updateStatus(sheetID, "APPROVED");
        updateEmployeeFlexBalance(ts.getEmployeeID(), sheetID);
        checkFlexThresholds(ts.getEmployeeID());
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


    private static final double STANDARD_HOURS = 8.0;
    private static final double OVERTIME_LIMIT = 10.0;
    private static final double MIN_REST_HOURS = 11.0;

    public double calculateFlexTime(int sheetID) {
        Timesheet ts = timesheetDAO.getTimesheetByID(sheetID);
        if (ts == null) return 0.0;
        List<WorkEntry> entries = workEntryDAO.getEntriesBySheet(sheetID);
        int workDays = entries.size();
        double expectedHours = workDays * STANDARD_HOURS;
        double flexTime = ts.getTotalHours() - expectedHours;
        System.out.println("Flex time for sheet " + sheetID + ": " + flexTime + " hours");
        return flexTime;
    }

    public void updateEmployeeFlexBalance(int employeeID, int sheetID) {
        double flex = calculateFlexTime(sheetID);
        EmployeeDAO employeeDAO = new EmployeeDAO();
        Employee emp = employeeDAO.getEmployeeByID(employeeID);
        if (emp == null) return;
        double newBalance = emp.getFlexTimeBalance() + flex;
        if (newBalance > 100) {
            System.out.println("WARNING: Flex time exceeds +100 hours for employee " + employeeID);
            newBalance = 100;
        }
        if (newBalance < -100) {
            System.out.println("WARNING: Flex time below -100 hours for employee " + employeeID);
            newBalance = -100;
        }
        emp.setFlexTimeBalance(newBalance);
        employeeDAO.updateEmployee(emp);
        System.out.println("Flex balance updated to: " + newBalance);
    }

    public void checkOvertimeAlerts(int sheetID) {
        List<WorkEntry> entries = workEntryDAO.getEntriesBySheet(sheetID);
        for (WorkEntry e : entries) {
            double hours = calculateHours(e.getStartTime(), e.getEndTime(), e.getBreakDuration());
            if (hours > OVERTIME_LIMIT) {
                System.out.println("OVERTIME ALERT: Entry on " + e.getDate() + " exceeds 10 hours (" + hours + "h). Supervisor notified.");
            }
        }
    }

    public void checkRestPeriods(int sheetID) {
        List<WorkEntry> entries = workEntryDAO.getEntriesBySheet(sheetID);
        for (int i = 1; i < entries.size(); i++) {
            WorkEntry prev = entries.get(i - 1);
            WorkEntry curr = entries.get(i);
            double prevEndMins = timeToMinutes(prev.getEndTime());
            double currStartMins = timeToMinutes(curr.getStartTime());
            double restHours = (currStartMins - prevEndMins) / 60.0;
            if (restHours < MIN_REST_HOURS) {
                System.out.println("REST PERIOD WARNING: Less than 11 hours rest between "
                    + prev.getDate() + " and " + curr.getDate() + " (" + restHours + "h rest)");
            }
        }
    }

    public void checkFlexThresholds(int employeeID) {
        EmployeeDAO employeeDAO = new EmployeeDAO();
        Employee emp = employeeDAO.getEmployeeByID(employeeID);
        if (emp == null) return;
        double balance = emp.getFlexTimeBalance();
        if (balance >= 80) {
            System.out.println("FLEX ALERT: Employee " + employeeID + " approaching +100h limit. Current: " + balance);
        }
        if (balance <= -80) {
            System.out.println("FLEX ALERT: Employee " + employeeID + " approaching -100h limit. Current: " + balance);
        }
    }

    private int timeToMinutes(String time) {
        String[] parts = time.split(":");
        return Integer.parseInt(parts[0]) * 60 + Integer.parseInt(parts[1]);
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