package com.stc.service;

import com.stc.dao.TimesheetDAO;

public class TimesheetService {

private TimesheetDAO dao = new TimesheetDAO();

public void submitTimesheet(int employeeId, int supervisorId, int month, int year, double hours) {
dao.insertTimesheet(employeeId, supervisorId, month, year, hours);
}

public void approveTimesheet(int sheetId) {
dao.updateStatus(sheetId, "APPROVED");
}

public void rejectTimesheet(int sheetId) {
dao.updateStatus(sheetId, "REJECTED");
}
}