// API Client for communicating with the backend

const API_BASE_URL = 'http://localhost:8080/api';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user?: {
    userID: number;
    name: string;
    email: string;
    role: string;
  };
}

class ApiClient {
  async request<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    body?: unknown
  ): Promise<T> {
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  // Auth endpoints
  login(email: string, role: string) {
    return this.request<LoginResponse>('/auth/login', 'POST', { email, role });
  }

  register(userID: number, name: string, email: string, role: string) {
    return this.request<ApiResponse<void>>('/auth/register', 'POST', {
      userID,
      name,
      email,
      role,
    });
  }

  // Employee endpoints
  getAllEmployees() {
    return this.request('/employees', 'GET');
  }

  getEmployee(id: number) {
    return this.request(`/employees/${id}`, 'GET');
  }

  addEmployee(employee: any) {
    return this.request('/employees', 'POST', employee);
  }

  updateEmployee(id: number, employee: any) {
    return this.request(`/employees/${id}`, 'PUT', employee);
  }

  deleteEmployee(id: number) {
    return this.request(`/employees/${id}`, 'DELETE');
  }

  // Supervisor endpoints
  getAllSupervisors() {
    return this.request('/supervisors', 'GET');
  }

  getSupervisor(id: number) {
    return this.request(`/supervisors/${id}`, 'GET');
  }

  addSupervisor(supervisor: any) {
    return this.request('/supervisors', 'POST', supervisor);
  }

  updateSupervisor(id: number, supervisor: any) {
    return this.request(`/supervisors/${id}`, 'PUT', supervisor);
  }

  deleteSupervisor(id: number) {
    return this.request(`/supervisors/${id}`, 'DELETE');
  }

  // Timesheet endpoints
  getAllTimesheets() {
    return this.request('/timesheets', 'GET');
  }

  getTimesheet(id: number) {
    return this.request(`/timesheets/${id}`, 'GET');
  }

  createTimesheet(employeeID: number, supervisorID: number, month: number, year: number) {
    return this.request('/timesheets', 'POST', {
      employeeID,
      supervisorID,
      month,
      year,
    });
  }

  getEmployeeTimesheets(employeeID: number) {
    return this.request(`/timesheets/employee/${employeeID}`, 'GET');
  }

  getSupervisorTimesheets(supervisorID: number) {
    return this.request(`/timesheets/supervisor/${supervisorID}`, 'GET');
  }

  addWorkEntry(timesheetID: number, date: string, startTime: string, endTime: string, breakDuration: number) {
    return this.request(`/timesheets/${timesheetID}/work-entries`, 'POST', {
      date,
      startTime,
      endTime,
      breakDuration,
    });
  }

  getWorkEntries(timesheetID: number) {
    return this.request(`/timesheets/${timesheetID}/work-entries`, 'GET');
  }

  submitTimesheet(timesheetID: number) {
    return this.request(`/timesheets/${timesheetID}/submit`, 'POST');
  }

  approveTimesheet(timesheetID: number) {
    return this.request(`/timesheets/${timesheetID}/approve`, 'POST');
  }

  rejectTimesheet(timesheetID: number, reason: string) {
    return this.request(`/timesheets/${timesheetID}/reject`, 'POST', { reason });
  }

  // Leave Request endpoints
  getAllLeaveRequests() {
    return this.request('/leave-requests', 'GET');
  }

  getLeaveRequest(id: number) {
    return this.request(`/leave-requests/${id}`, 'GET');
  }

  submitLeaveRequest(
    employeeID: number,
    supervisorID: number,
    startDate: string,
    endDate: string,
    type: string
  ) {
    return this.request('/leave-requests', 'POST', {
      employeeID,
      supervisorID,
      startDate,
      endDate,
      type,
    });
  }

  getEmployeeLeaveRequests(employeeID: number) {
    return this.request(`/leave-requests/employee/${employeeID}`, 'GET');
  }

  getPendingLeaveRequests(supervisorID: number) {
    return this.request(`/leave-requests/supervisor/${supervisorID}/pending`, 'GET');
  }

  approveLeaveRequest(leaveID: number) {
    return this.request(`/leave-requests/${leaveID}/approve`, 'POST');
  }

  rejectLeaveRequest(leaveID: number, reason: string) {
    return this.request(`/leave-requests/${leaveID}/reject`, 'POST', { reason });
  }

  cancelLeaveRequest(leaveID: number) {
    return this.request(`/leave-requests/${leaveID}/cancel`, 'POST');
  }

  registerSickness(
    employeeID: number,
    supervisorID: number,
    startDate: string,
    endDate: string
  ) {
    return this.request('/leave-requests/sickness', 'POST', {
      employeeID,
      supervisorID,
      startDate,
      endDate,
    });
  }
}

export const apiClient = new ApiClient();
