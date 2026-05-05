package com.stc.service;

import com.stc.dao.LeaveRequestDAO;
import com.stc.dao.EmployeeDAO;
import com.stc.model.LeaveRequest;
import com.stc.model.Employee;

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

    public void cancelLeaveRequest(int leaveID) {
        LeaveRequest request = dao.getLeaveRequestByID(leaveID);
        if (request == null) {
            System.out.println("Leave request not found.");
            return;
        }
        if (request.getStatus().equals("APPROVED") || request.getStatus().equals("PENDING")) {
            dao.updateStatus(leaveID, "CANCELLED");
            System.out.println("Leave request cancelled successfully.");
        } else {
            System.out.println("Only PENDING or APPROVED requests can be cancelled.");
        }
    }
    
    public void registerSickness(int employeeID, int supervisorID, String startDate, String endDate) {
        LeaveRequest sickness = new LeaveRequest(0, employeeID, supervisorID, startDate, endDate, "SICK", "APPROVED");
        dao.addLeaveRequest(sickness);
        System.out.println("Sickness registered for employee " + employeeID + ". Supervisor notified via email.");
        sendEmailNotification(supervisorID, "Sickness registered for employee " + employeeID +
            " from " + startDate + " to " + endDate);
    }
    
    public void convertVacationToSick(int leaveID) {
        LeaveRequest request = dao.getLeaveRequestByID(leaveID);
        if (request == null) {
            System.out.println("Leave request not found.");
            return;
        }
        if (!request.getType().equals("VACATION")) {
            System.out.println("Only vacation requests can be converted to sick leave.");
            return;
        }
        dao.updateType(leaveID, "SICK");
        System.out.println("Vacation converted to sick leave for request " + leaveID);
    }
    
    public void carryOverVacationDays(int employeeID) {
        EmployeeDAO employeeDAO = new EmployeeDAO();
        Employee emp = employeeDAO.getEmployeeByID(employeeID);
        if (emp == null) return;
        int remaining = emp.getVacationDays();
        int carryOver = Math.min(remaining, 5);
        emp.setVacationDays(carryOver);
        employeeDAO.updateEmployee(emp);
        System.out.println("Carry-over applied: " + carryOver + " days carried into new year for employee " + employeeID);
    }
    
    private void sendEmailNotification(int supervisorID, String message) {
        System.out.println("EMAIL NOTIFICATION to supervisor " + supervisorID + ": " + message);
    }

    public List<LeaveRequest> getEmployeeRequests(int employeeID) {
        return dao.getLeaveRequestsByEmployee(employeeID);
    }

    public List<LeaveRequest> getPendingRequestsForSupervisor(int supervisorID) {
        return dao.getPendingRequestsBySupervisor(supervisorID);
    }
}