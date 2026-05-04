package com.stc.model;

public class Timesheet {
    private int sheetID;
    private int employeeID;
    private int supervisorID;
    private int month;
    private int year;
    private double totalHours;
    private String status;

    public Timesheet() {}

    public Timesheet(int sheetID, int employeeID, int supervisorID, int month, int year, double totalHours, String status) {
        this.sheetID = sheetID;
        this.employeeID = employeeID;
        this.supervisorID = supervisorID;
        this.month = month;
        this.year = year;
        this.totalHours = totalHours;
        this.status = status;
    }

    public int getSheetID() { return sheetID; }
    public void setSheetID(int sheetID) { this.sheetID = sheetID; }

    public int getEmployeeID() { return employeeID; }
    public void setEmployeeID(int employeeID) { this.employeeID = employeeID; }

    public int getSupervisorID() { return supervisorID; }
    public void setSupervisorID(int supervisorID) { this.supervisorID = supervisorID; }

    public int getMonth() { return month; }
    public void setMonth(int month) { this.month = month; }

    public int getYear() { return year; }
    public void setYear(int year) { this.year = year; }

    public double getTotalHours() { return totalHours; }
    public void setTotalHours(double totalHours) { this.totalHours = totalHours; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    @Override
    public String toString() {
        return "TimeSheet{sheetID=" + sheetID + ", employeeID=" + employeeID + ", month=" + month + ", year=" + year + ", totalHours=" + totalHours + ", status=" + status + "}";
    }
}