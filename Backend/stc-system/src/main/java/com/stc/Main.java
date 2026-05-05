package com.stc;

import com.stc.controller.TimesheetController;
import com.stc.controller.LeaveRequestController;
import com.stc.dao.EmployeeDAO;
import com.stc.dao.SupervisorDAO;
import com.stc.model.Employee;
import com.stc.model.Supervisor;

public class Main {
    public static void main(String[] args) {

        EmployeeDAO employeeDAO = new EmployeeDAO();
        SupervisorDAO supervisorDAO = new SupervisorDAO();
        TimesheetController timesheetController = new TimesheetController();
        LeaveRequestController leaveController = new LeaveRequestController();

        // 1. Create test employee and supervisor
        Employee emp = new Employee(10, "Sophie", "sophie@stc.com", "EMPLOYEE", 0.0, 20);
        Supervisor sup = new Supervisor(20, "Harald", "harald@stc.com", "SUPERVISOR", 1);
        employeeDAO.addEmployee(emp);
        supervisorDAO.addSupervisor(sup);
        System.out.println("--- Users created ---");

        // 2. Create timesheet
        timesheetController.createTimesheet(10, 20, 4, 2026);
        System.out.println("--- Timesheet created ---");

        // 3. Add work entries
        timesheetController.addWorkEntry(1, "2026-04-01", "08:00", "17:00", 30);
        timesheetController.addWorkEntry(1, "2026-04-02", "08:00", "19:30", 30);
        System.out.println("--- Work entries added ---");

        // 4. Submit timesheet
        timesheetController.submit(1);
        System.out.println("--- Timesheet submitted ---");

        // 5. Approve timesheet (triggers flex calc + overtime check)
        timesheetController.approve(1);
        System.out.println("--- Timesheet approved ---");

        // 6. Submit leave request
        leaveController.submitRequest(10, 20, "2026-05-01", "2026-05-05", "VACATION");
        System.out.println("--- Leave request submitted ---");

        // 7. Approve leave request
        leaveController.approve(1);
        System.out.println("--- Leave request approved ---");

        // 8. Cancel leave request
        leaveController.cancel(1);
        System.out.println("--- Leave request cancelled ---");

        // 9. Register sickness
        leaveController.registerSickness(10, 20, "2026-05-10", "2026-05-12");
        System.out.println("--- Sickness registered ---");
    }
}