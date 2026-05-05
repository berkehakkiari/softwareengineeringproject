package com.stc.api;

import com.stc.controller.LeaveRequestController;
import com.stc.dao.LeaveRequestDAO;
import com.stc.model.LeaveRequest;
import com.stc.service.LeaveRequestService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/leave-requests")
public class LeaveRequestRestController {
    private LeaveRequestService leaveRequestService = new LeaveRequestService();
    private LeaveRequestDAO leaveRequestDAO = new LeaveRequestDAO();

    @PostMapping
    public ApiResponse submitLeaveRequest(@RequestBody SubmitLeaveRequest request) {
        try {
            leaveRequestService.submitLeaveRequest(request.employeeID, request.supervisorID, request.startDate, request.endDate, request.type);
            return new ApiResponse(true, "Leave request submitted successfully");
        } catch (Exception e) {
            return new ApiResponse(false, "Failed to submit leave request: " + e.getMessage());
        }
    }

    @GetMapping
    public List<LeaveRequest> getAllLeaveRequests() {
        return leaveRequestDAO.getAllLeaveRequests();
    }

    @GetMapping("/{id}")
    public LeaveRequest getLeaveRequest(@PathVariable int id) {
        return leaveRequestDAO.getLeaveRequestByID(id);
    }

    @GetMapping("/employee/{employeeID}")
    public List<LeaveRequest> getEmployeeLeaveRequests(@PathVariable int employeeID) {
        return leaveRequestDAO.getRequestsByEmployeeID(employeeID);
    }

    @GetMapping("/supervisor/{supervisorID}/pending")
    public List<LeaveRequest> getPendingRequests(@PathVariable int supervisorID) {
        return leaveRequestDAO.getPendingRequestsBySupervisorID(supervisorID);
    }

    @PostMapping("/{id}/approve")
    public ApiResponse approveLeaveRequest(@PathVariable int id) {
        try {
            leaveRequestService.approveLeaveRequest(id);
            return new ApiResponse(true, "Leave request approved successfully");
        } catch (Exception e) {
            return new ApiResponse(false, "Failed to approve leave request: " + e.getMessage());
        }
    }

    @PostMapping("/{id}/reject")
    public ApiResponse rejectLeaveRequest(@PathVariable int id, @RequestBody RejectRequest request) {
        try {
            leaveRequestService.rejectLeaveRequest(id, request.reason);
            return new ApiResponse(true, "Leave request rejected successfully");
        } catch (Exception e) {
            return new ApiResponse(false, "Failed to reject leave request: " + e.getMessage());
        }
    }

    @PostMapping("/{id}/cancel")
    public ApiResponse cancelLeaveRequest(@PathVariable int id) {
        try {
            leaveRequestService.cancelLeaveRequest(id);
            return new ApiResponse(true, "Leave request cancelled successfully");
        } catch (Exception e) {
            return new ApiResponse(false, "Failed to cancel leave request: " + e.getMessage());
        }
    }

    @PostMapping("/sickness")
    public ApiResponse registerSickness(@RequestBody SicknessRequest request) {
        try {
            leaveRequestService.registerSickness(request.employeeID, request.supervisorID, request.startDate, request.endDate);
            return new ApiResponse(true, "Sickness registered successfully");
        } catch (Exception e) {
            return new ApiResponse(false, "Failed to register sickness: " + e.getMessage());
        }
    }

    // DTOs
    public static class SubmitLeaveRequest {
        public int employeeID;
        public int supervisorID;
        public String startDate;
        public String endDate;
        public String type;
    }

    public static class SicknessRequest {
        public int employeeID;
        public int supervisorID;
        public String startDate;
        public String endDate;
    }

    public static class RejectRequest {
        public String reason;
    }

    public static class ApiResponse {
        public boolean success;
        public String message;

        public ApiResponse(boolean success, String message) {
            this.success = success;
            this.message = message;
        }
    }
}
