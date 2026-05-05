package com.stc.api;

import com.stc.controller.TimesheetController;
import com.stc.dao.TimesheetDAO;
import com.stc.dao.WorkEntryDAO;
import com.stc.model.Timesheet;
import com.stc.model.WorkEntry;
import com.stc.service.TimesheetService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/timesheets")
public class TimesheetRestController {
    private TimesheetService timesheetService = new TimesheetService();
    private TimesheetDAO timesheetDAO = new TimesheetDAO();
    private WorkEntryDAO workEntryDAO = new WorkEntryDAO();

    @PostMapping
    public ApiResponse createTimesheet(@RequestBody CreateTimesheetRequest request) {
        try {
            timesheetService.createTimesheet(request.employeeID, request.supervisorID, request.month, request.year);
            return new ApiResponse(true, "Timesheet created successfully");
        } catch (Exception e) {
            return new ApiResponse(false, "Failed to create timesheet: " + e.getMessage());
        }
    }

    @GetMapping
    public List<Timesheet> getAllTimesheets() {
        return timesheetDAO.getAllTimesheets();
    }

    @GetMapping("/{id}")
    public Timesheet getTimesheet(@PathVariable int id) {
        return timesheetDAO.getTimesheetByID(id);
    }

    @GetMapping("/employee/{employeeID}")
    public List<Timesheet> getEmployeeTimesheets(@PathVariable int employeeID) {
        return timesheetDAO.getTimesheetsByEmployeeID(employeeID);
    }

    @GetMapping("/supervisor/{supervisorID}")
    public List<Timesheet> getSupervisorTimesheets(@PathVariable int supervisorID) {
        return timesheetDAO.getTimesheetsBySupervisorID(supervisorID);
    }

    @PostMapping("/{id}/work-entries")
    public ApiResponse addWorkEntry(@PathVariable int id, @RequestBody WorkEntryRequest request) {
        try {
            WorkEntry entry = new WorkEntry(0, id, request.date, request.startTime, request.endTime, request.breakDuration);
            timesheetService.addWorkEntry(entry);
            return new ApiResponse(true, "Work entry added successfully");
        } catch (Exception e) {
            return new ApiResponse(false, "Failed to add work entry: " + e.getMessage());
        }
    }

    @GetMapping("/{id}/work-entries")
    public List<WorkEntry> getWorkEntries(@PathVariable int id) {
        return workEntryDAO.getEntriesBySheet(id);
    }

    @PostMapping("/{id}/submit")
    public ApiResponse submitTimesheet(@PathVariable int id) {
        try {
            timesheetService.submitTimesheet(id);
            return new ApiResponse(true, "Timesheet submitted successfully");
        } catch (Exception e) {
            return new ApiResponse(false, "Failed to submit timesheet: " + e.getMessage());
        }
    }

    @PostMapping("/{id}/approve")
    public ApiResponse approveTimesheet(@PathVariable int id) {
        try {
            timesheetService.approveTimesheet(id);
            return new ApiResponse(true, "Timesheet approved successfully");
        } catch (Exception e) {
            return new ApiResponse(false, "Failed to approve timesheet: " + e.getMessage());
        }
    }

    @PostMapping("/{id}/reject")
    public ApiResponse rejectTimesheet(@PathVariable int id, @RequestBody RejectRequest request) {
        try {
            timesheetService.rejectTimesheet(id, request.reason);
            return new ApiResponse(true, "Timesheet rejected successfully");
        } catch (Exception e) {
            return new ApiResponse(false, "Failed to reject timesheet: " + e.getMessage());
        }
    }

    // DTOs
    public static class CreateTimesheetRequest {
        public int employeeID;
        public int supervisorID;
        public int month;
        public int year;
    }

    public static class WorkEntryRequest {
        public String date;
        public String startTime;
        public String endTime;
        public int breakDuration;
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
