package com.stc.service;

import com.stc.dao.LeaveRequestDAO;
import com.stc.model.LeaveRequest;
import java.util.List;

public class LeaveRequestService {
    private LeaveRequestDAO dao = new LeaveRequestDAO();

    public void submitLeaveRequest(int employeeID, int supervisorID, String startDate, String endDate, String type) {
        LeaveRequest request = new LeaveRequest(0, employeeID, supervisorID, startDate, endDate, type, "PENDING");
        dao.addLeaveRequest(request);
        System.out.println("Leave request submitted.");
    }

    public void approveLeaveRequest(int leaveID) {
        LeaveRequest request = dao.getLeaveRequestByID(leaveID);
        if (request == null) {
            System.out.println("Leave request not found.");
            return;
        }
        if (!request.getStatus().equals("PENDING")) {
            System.out.println("Only PENDING requests can be approved.");
            return;
        }
        dao.updateStatus(leaveID, "APPROVED");
        System.out.println("Leave request approved. Employee notified.");
    }

    public void rejectLeaveRequest(int leaveID, String reason) {
        LeaveRequest request = dao.getLeaveRequestByID(leaveID);
        if (request == null) {
            System.out.println("Leave request not found.");
            return;
        }
        if (!request.getStatus().equals("PENDING")) {
            System.out.println("Only PENDING requests can be rejected.");
            return;
        }
        dao.updateStatus(leaveID, "REJECTED");
        System.out.println("Leave request rejected. Reason: " + reason);
    }

    public List<LeaveRequest> getEmployeeRequests(int employeeID) {
        return dao.getLeaveRequestsByEmployee(employeeID);
    }

    public List<LeaveRequest> getPendingRequestsForSupervisor(int supervisorID) {
        return dao.getPendingRequestsBySupervisor(supervisorID);
    }
}