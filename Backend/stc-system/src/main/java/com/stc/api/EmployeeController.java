package com.stc.api;

import com.stc.dao.EmployeeDAO;
import com.stc.dao.SupervisorDAO;
import com.stc.model.Employee;
import com.stc.model.Supervisor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {
    private EmployeeDAO employeeDAO = new EmployeeDAO();

    @GetMapping
    public List<Employee> getAllEmployees() {
        return employeeDAO.getAllEmployees();
    }

    @GetMapping("/{id}")
    public Employee getEmployee(@PathVariable int id) {
        return employeeDAO.getEmployeeByID(id);
    }

    @PostMapping
    public ApiResponse addEmployee(@RequestBody Employee employee) {
        try {
            employeeDAO.addEmployee(employee);
            return new ApiResponse(true, "Employee added successfully");
        } catch (Exception e) {
            return new ApiResponse(false, "Failed to add employee: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ApiResponse updateEmployee(@PathVariable int id, @RequestBody Employee employee) {
        try {
            employee.setUserID(id);
            employeeDAO.updateEmployee(employee);
            return new ApiResponse(true, "Employee updated successfully");
        } catch (Exception e) {
            return new ApiResponse(false, "Failed to update employee: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ApiResponse deleteEmployee(@PathVariable int id) {
        try {
            employeeDAO.deleteEmployee(id);
            return new ApiResponse(true, "Employee deleted successfully");
        } catch (Exception e) {
            return new ApiResponse(false, "Failed to delete employee: " + e.getMessage());
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
