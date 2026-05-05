package com.stc.api;

import com.stc.dao.SupervisorDAO;
import com.stc.model.Supervisor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/supervisors")
public class SupervisorController {
    private SupervisorDAO supervisorDAO = new SupervisorDAO();

    @GetMapping
    public List<Supervisor> getAllSupervisors() {
        return supervisorDAO.getAllSupervisors();
    }

    @GetMapping("/{id}")
    public Supervisor getSupervisor(@PathVariable int id) {
        return supervisorDAO.getSupervisorByID(id);
    }

    @PostMapping
    public ApiResponse addSupervisor(@RequestBody Supervisor supervisor) {
        try {
            supervisorDAO.addSupervisor(supervisor);
            return new ApiResponse(true, "Supervisor added successfully");
        } catch (Exception e) {
            return new ApiResponse(false, "Failed to add supervisor: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ApiResponse updateSupervisor(@PathVariable int id, @RequestBody Supervisor supervisor) {
        try {
            supervisor.setUserID(id);
            supervisorDAO.updateSupervisor(supervisor);
            return new ApiResponse(true, "Supervisor updated successfully");
        } catch (Exception e) {
            return new ApiResponse(false, "Failed to update supervisor: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ApiResponse deleteSupervisor(@PathVariable int id) {
        try {
            supervisorDAO.deleteSupervisor(id);
            return new ApiResponse(true, "Supervisor deleted successfully");
        } catch (Exception e) {
            return new ApiResponse(false, "Failed to delete supervisor: " + e.getMessage());
        }
    }

    // API Response DTO
    public static class ApiResponse {
        public boolean success;
        public String message;

        public ApiResponse(boolean success, String message) {
            this.success = success;
            this.message = message;
        }
    }
}
