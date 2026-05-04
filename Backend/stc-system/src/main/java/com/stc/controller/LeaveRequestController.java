package com.stc.controller;

import com.stc.model.LeaveRequest;
import com.stc.service.LeaveRequestService;
import java.util.List;

public class LeaveRequestController {
    private LeaveRequestService service = new LeaveRequestService();

    public void submitRequest(int employeeID, int supervisorID, String startDate, String endDate, String type) {
        service.submitLeaveRequest(employeeID, supervisorID, startDate, endDate, type);
    }

    public void approve(int leaveID) {
        service.approveLeaveRequest(leaveID);
    }

    public void reject(int leaveID, String reason) {
        service.rejectLeaveRequest(leaveID, reason);
    }

    public void viewEmployeeRequests(int employeeID) {
        List<LeaveRequest> requests = service.getEmployeeRequests(employeeID);
        requests.forEach(System.out::println);
    }

    public void viewPendingRequests(int supervisorID) {
        List<LeaveRequest> requests = service.getPendingRequestsForSupervisor(supervisorID);
        requests.forEach(System.out::println);
    }
}