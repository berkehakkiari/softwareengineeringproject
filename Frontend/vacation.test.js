import { describe, it, expect, vi } from 'vitest';

// 1. Create a mock database to simulate our data layer
const mockDatabase = {
  getEmployee: vi.fn(),
  saveRequest: vi.fn()
};

// 2. Imitate the VacationService that uses the mock database
class VacationService {
  constructor(db) {
    this.db = db;
  }

  requestVacation(employeeId, requestedDays) {
    const employee = this.db.getEmployee(employeeId);
    
    if (employee.vacationBalance >= requestedDays) {
      employee.vacationBalance -= requestedDays;
      this.db.saveRequest({ employeeId, requestedDays, status: 'Approved' });
      return true; // Success
    }
    return false; // failure due to insufficient balance
  }
}

describe('Vacation Request System Test', () => {
  it('should approve vacation if balance is sufficient', () => {
    // SETTING UP THE MOCK: We tell the system that when it asks for Sophie,
    // The database should return a fake object with a balance of 30 days.
    const fakeSophie = { name: 'Sophie', vacationBalance: 30 };
    mockDatabase.getEmployee.mockReturnValue(fakeSophie);

    const service = new VacationService(mockDatabase);

    // ACT: We simulate Sophie requesting 5 days of vacation.
    const result = service.requestVacation('EMP-2847', 5);

    // ASSERTIONS: We ensure the logic worked correctly
    expect(result).toBe(true); // The request should be approved
    expect(fakeSophie.vacationBalance).toBe(25); // The balance should decrease to 25
    
    // CHECK: We verify that the system attempted to "save" the data in our fake database
    expect(mockDatabase.saveRequest).toHaveBeenCalled();
  });
});