package com.stc.controller;

import com.stc.service.TimesheetService;

public class TimesheetController {

    private TimesheetService service = new TimesheetService();

    public void submit(int employeeId, int supervisorId, int month, int year, double hours) {
        service.submitTimesheet(employeeId, supervisorId, month, year, hours);
    }

    public void approve(int sheetId) {
        service.approveTimesheet(sheetId);
    }

    public void reject(int sheetId) {
        service.rejectTimesheet(sheetId);
    }
}