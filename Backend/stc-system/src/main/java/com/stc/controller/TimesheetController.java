package com.stc.controller;

import com.stc.model.Timesheet;
import com.stc.model.WorkEntry;
import com.stc.service.TimesheetService;
import java.util.List;

public class TimesheetController {
    private TimesheetService service = new TimesheetService();

    public void createTimesheet(int employeeID, int supervisorID, int month, int year) {
        service.createTimesheet(employeeID, supervisorID, month, year);
    }

    public void addWorkEntry(int sheetID, String date, String startTime, String endTime, int breakDuration) {
        WorkEntry entry = new WorkEntry(0, sheetID, date, startTime, endTime, breakDuration);
        service.addWorkEntry(entry);
    }

    public void submit(int sheetID) {
        service.submitTimesheet(sheetID);
    }

    public void approve(int sheetID) {
        service.approveTimesheet(sheetID);
    }

    public void reject(int sheetID, String reason) {
        service.rejectTimesheet(sheetID, reason);
    }

    public void viewTimesheet(int sheetID) {
        Timesheet ts = service.getTimesheet(sheetID);
        if (ts != null) System.out.println(ts);
        else System.out.println("Timesheet not found.");
    }

    public void viewEmployeeTimesheets(int employeeID) {
        List<Timesheet> sheets = service.getTimesheetsForEmployee(employeeID);
        sheets.forEach(System.out::println);
    }

    public void viewSupervisorTimesheets(int supervisorID) {
        List<Timesheet> sheets = service.getTimesheetsForSupervisor(supervisorID);
        sheets.forEach(System.out::println);
    }
}