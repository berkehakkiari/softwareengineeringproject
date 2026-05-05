import { useState, useEffect } from 'react';
import { EmployeeDashboard } from './components/EmployeeDashboard';
import { SupervisoryBoard } from './components/SupervisoryBoard';
import { HRSpecialist } from './components/HRSpecialist';
import { LoginScreen } from './components/LoginScreen';
import { apiClient } from '../services/apiClient';

interface Timesheet {
  id: string;
  employeeName: string;
  employeeId: string;
  weekPeriod: string;
  hoursSubmitted: number;
  standardHours: number;
  submittedDate: string;
  status: 'pending' | 'approved' | 'correction_requested';
  notes?: string;
  rejectionNotes?: string;
}

interface VacationRequest {
  id: string;
  employeeName: string;
  employeeId: string;
  startDate: string;
  endDate: string;
  vacationType: string;
  totalDays: number;
  submittedDate: string;
  status: 'pending' | 'approved' | 'denied';
  reason?: string;
  denialNotes?: string;
}

interface SickLeave {
  id: string;
  employeeName: string;
  employeeId: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  registeredDate: string;
}

interface Employee {
  id: string;
  name: string;
  employeeId: string;
  position: string;
  department: string;
  hireDate: string;
  status: 'active' | 'inactive';
}

export default function App() {
  const [loggedInUser, setLoggedInUser] = useState<{
    username: string;
    role: 'employee' | 'supervisor' | 'hr' | 'admin';
    userId: number;
    fullName: string;
  } | null>(null);
  const [activeView, setActiveView] = useState<'employee' | 'supervisor' | 'hr'>('employee');
  
  // State for API data
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
  const [vacationRequests, setVacationRequests] = useState<VacationRequest[]>([]);
  const [sickLeaves, setSickLeaves] = useState<SickLeave[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch data from API when user logs in
  useEffect(() => {
    if (loggedInUser) {
      fetchData();
    }
  }, [loggedInUser]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch timesheets
      const timesheetsData = await apiClient.getAllTimesheets();
      // Transform backend data to frontend format
      const transformedTimesheets = (Array.isArray(timesheetsData) ? timesheetsData : []).map((ts: any, idx: number) => ({
        id: `TS-${String(idx + 1).padStart(3, '0')}`,
        employeeName: 'Employee ' + ts.employeeID,
        employeeId: 'EMP-' + ts.employeeID,
        weekPeriod: `${getMonthName(ts.month)} ${ts.year}`,
        hoursSubmitted: ts.totalHours || 0,
        standardHours: 160,
        submittedDate: new Date().toLocaleDateString(),
        status: ts.status?.toLowerCase() || 'pending',
        notes: '',
      }));
      
      // Fetch leave requests
      const leaveData = await apiClient.getAllLeaveRequests();
      const transformedLeaves = (Array.isArray(leaveData) ? leaveData : []).map((lr: any, idx: number) => ({
        id: `VR-${String(idx + 1).padStart(3, '0')}`,
        employeeName: 'Employee ' + lr.employeeID,
        employeeId: 'EMP-' + lr.employeeID,
        startDate: lr.startDate,
        endDate: lr.endDate,
        vacationType: lr.type === 'VACATION' ? 'Annual Leave' : lr.type === 'SICKNESS' ? 'Sick Leave' : lr.type,
        totalDays: calculateDaysDifference(lr.startDate, lr.endDate),
        submittedDate: new Date().toLocaleDateString(),
        status: lr.status?.toLowerCase() || 'pending',
      }));
      
      // Fetch employees
      const employeesData = await apiClient.getAllEmployees();
      const transformedEmployees = (Array.isArray(employeesData) ? employeesData : []).map((emp: any, idx: number) => ({
        id: `E-${String(idx + 1).padStart(3, '0')}`,
        name: emp.name,
        employeeId: 'EMP-' + emp.userID,
        position: 'Software Engineer',
        department: 'Engineering',
        hireDate: new Date().toLocaleDateString(),
        status: 'active' as const,
      }));
      
      setTimesheets(transformedTimesheets);
      setVacationRequests(transformedLeaves);
      setEmployees(transformedEmployees);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      // Keep using empty or default data if API fails
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (username: string, password: string): Promise<boolean> => {
    try {
      // Mock authentication with all 4 credentials
      const credentials = [
        { username: 'sophie', email: 'sophie@stc.com', role: 'EMPLOYEE', userId: 10, fullName: 'Sophie Harman' },
        { username: 'harald', email: 'harald@stc.com', role: 'SUPERVISOR', userId: 20, fullName: 'Harald Supervisor' },
        { username: 'marcus', email: 'marcus@stc.com', role: 'HR_SPECIALIST', userId: 30, fullName: 'Marcus HR' },
        { username: 'test', email: 'test@stc.com', role: 'ADMIN', userId: 99, fullName: 'Admin User' },
      ];

      const user = credentials.find((cred) => cred.username === username);

      if (user) {
        const userRole = user.role === 'EMPLOYEE' ? 'employee' : user.role === 'HR_SPECIALIST' ? 'hr' : user.role === 'ADMIN' ? 'admin' : 'supervisor';
        setLoggedInUser({
          username: user.username,
          role: userRole,
          userId: user.userId,
          fullName: user.fullName,
        });
        // Set the active view based on the user's role
        if (userRole === 'employee') {
          setActiveView('employee');
        } else if (userRole === 'hr') {
          setActiveView('hr');
        } else if (userRole === 'supervisor') {
          setActiveView('supervisor');
        } else if (userRole === 'admin') {
          setActiveView('employee'); // Admin can see all views
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const handleLogout = () => {
    setLoggedInUser(null);
  };

  if (!loggedInUser) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="size-full bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl text-neutral-900">STC Time Management</h1>
              <p className="text-sm text-neutral-500 mt-0.5">Waterfall System</p>
            </div>

            {/* View Switcher and User Info */}
            <div className="flex items-center gap-4">
              <div className="flex gap-2 bg-neutral-100 p-1 rounded-lg">
                {(loggedInUser.role === 'employee' || loggedInUser.role === 'admin') && (
                  <button
                    onClick={() => setActiveView('employee')}
                    className={`px-4 py-2 rounded-md text-sm transition-colors ${
                      activeView === 'employee'
                        ? 'bg-white text-neutral-900 shadow-sm'
                        : 'text-neutral-600 hover:text-neutral-900'
                    }`}
                  >
                    Employee Dashboard
                  </button>
                )}
                {(loggedInUser.role === 'supervisor' || loggedInUser.role === 'admin') && (
                  <button
                    onClick={() => setActiveView('supervisor')}
                    className={`px-4 py-2 rounded-md text-sm transition-colors ${
                      activeView === 'supervisor'
                        ? 'bg-white text-neutral-900 shadow-sm'
                        : 'text-neutral-600 hover:text-neutral-900'
                    }`}
                  >
                    Supervisory Board
                  </button>
                )}
                {(loggedInUser.role === 'hr' || loggedInUser.role === 'admin') && (
                  <button
                    onClick={() => setActiveView('hr')}
                    className={`px-4 py-2 rounded-md text-sm transition-colors ${
                      activeView === 'hr'
                        ? 'bg-white text-neutral-900 shadow-sm'
                        : 'text-neutral-600 hover:text-neutral-900'
                    }`}
                  >
                    HR Specialist
                  </button>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                Logout ({loggedInUser.username})
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {loading && (
          <div className="text-center py-8">
            <p className="text-neutral-600">Loading data...</p>
          </div>
        )}
        {!loading && (
          <>
            {activeView === 'employee' && (
              <EmployeeDashboard
                timesheets={timesheets.filter((ts) => ts.employeeId === 'EMP-' + loggedInUser.userId)}
                vacationRequests={vacationRequests.filter((vr) => vr.employeeId === 'EMP-' + loggedInUser.userId)}
                onSubmitTimesheet={(timesheet) => setTimesheets([...timesheets, timesheet])}
                onSubmitVacation={(vacation) => setVacationRequests([...vacationRequests, vacation])}
                onUpdateTimesheet={(id, updates) =>
                  setTimesheets(timesheets.map((ts) => (ts.id === id ? { ...ts, ...updates } : ts)))
                }
                loggedInUser={{ fullName: loggedInUser.fullName, userId: loggedInUser.userId }}
              />
            )}
            {activeView === 'supervisor' && (
              <SupervisoryBoard
                timesheets={timesheets}
                vacationRequests={vacationRequests}
                sickLeaves={sickLeaves}
                employees={employees}
                onUpdateTimesheet={(id, updates) =>
                  setTimesheets(timesheets.map((ts) => (ts.id === id ? { ...ts, ...updates } : ts)))
                }
                onUpdateVacation={(id, updates) =>
                  setVacationRequests(
                    vacationRequests.map((vr) => (vr.id === id ? { ...vr, ...updates } : vr))
                  )
                }
                onAddEmployee={(employee) => setEmployees([...employees, employee])}
                onUpdateEmployee={(id, updates) =>
                  setEmployees(employees.map((emp) => (emp.id === id ? { ...emp, ...updates } : emp)))
                }
              />
            )}
            {activeView === 'hr' && (
              <HRSpecialist
                sickLeaves={sickLeaves}
                timesheets={timesheets}
                employees={employees}
                onAddSickLeave={(sickLeave) => setSickLeaves([...sickLeaves, sickLeave])}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}

function getMonthName(month: number): string {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return months[month - 1] || 'Unknown';
}

function calculateDaysDifference(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return diffDays;
}