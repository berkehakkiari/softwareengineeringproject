package com.stc.model;

public class LeaveRequest {
    private int leaveID;
    private int employeeID;
    private int supervisorID;
    private String startDate;
    private String endDate;
    private String type;
    private String status;

    public LeaveRequest() {}

    public LeaveRequest(int leaveID, int employeeID, int supervisorID, String startDate, String endDate, String type, String status) {
        this.leaveID = leaveID;
        this.employeeID = employeeID;
        this.supervisorID = supervisorID;
        this.startDate = startDate;
        this.endDate = endDate;
        this.type = type;
        this.status = status;
    }

    public int getLeaveID() { return leaveID; }
    public void setLeaveID(int leaveID) { this.leaveID = leaveID; }

    public int getEmployeeID() { return employeeID; }
    public void setEmployeeID(int employeeID) { this.employeeID = employeeID; }

    public int getSupervisorID() { return supervisorID; }
    public void setSupervisorID(int supervisorID) { this.supervisorID = supervisorID; }

    public String getStartDate() { return startDate; }
    public void setStartDate(String startDate) { this.startDate = startDate; }

    public String getEndDate() { return endDate; }
    public void setEndDate(String endDate) { this.endDate = endDate; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    @Override
    public String toString() {
        return "LeaveRequest{leaveID=" + leaveID + ", employeeID=" + employeeID + ", type=" + type + ", status=" + status + "}";
    }
}