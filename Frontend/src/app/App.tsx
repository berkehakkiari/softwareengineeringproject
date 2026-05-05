import { useState } from 'react';
import { EmployeeDashboard } from './components/EmployeeDashboard';
import { SupervisoryBoard } from './components/SupervisoryBoard';
import { HRSpecialist } from './components/HRSpecialist';
import { LoginScreen } from './components/LoginScreen';

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
  } | null>(null);
  const [activeView, setActiveView] = useState<'employee' | 'supervisor' | 'hr'>('employee');

  const [timesheets, setTimesheets] = useState<Timesheet[]>([
    {
      id: 'TS-001',
      employeeName: 'Sarah Chen',
      employeeId: 'EMP-2901',
      weekPeriod: 'April 2026',
      hoursSubmitted: 180.0,
      standardHours: 160.0,
      submittedDate: 'Apr 13, 2026',
      status: 'pending',
      notes: 'Worked on Project Waterfall Phase 2 deployment',
    },
    {
      id: 'TS-002',
      employeeName: 'Marcus Johnson',
      employeeId: 'EMP-2745',
      weekPeriod: 'April 2026',
      hoursSubmitted: 152.0,
      standardHours: 160.0,
      submittedDate: 'Apr 13, 2026',
      status: 'pending',
    },
    {
      id: 'TS-003',
      employeeName: 'Sophie Harman',
      employeeId: 'EMP-2847',
      weekPeriod: 'March 2026',
      hoursSubmitted: 165.0,
      standardHours: 160.0,
      submittedDate: 'Apr 1, 2026',
      status: 'approved',
    },
  ]);

  const [vacationRequests, setVacationRequests] = useState<VacationRequest[]>([
    {
      id: 'VR-001',
      employeeName: 'Sophie Harman',
      employeeId: 'EMP-2847',
      startDate: 'Apr 21, 2026',
      endDate: 'Apr 25, 2026',
      vacationType: 'Annual Leave',
      totalDays: 5,
      submittedDate: 'Apr 13, 2026',
      status: 'pending',
      reason: 'Family vacation',
    },
    {
      id: 'VR-002',
      employeeName: 'Marcus Johnson',
      employeeId: 'EMP-2745',
      startDate: 'May 5, 2026',
      endDate: 'May 9, 2026',
      vacationType: 'Annual Leave',
      totalDays: 5,
      submittedDate: 'Apr 12, 2026',
      status: 'pending',
    },
  ]);

  const [sickLeaves, setSickLeaves] = useState<SickLeave[]>([
    {
      id: 'SL-001',
      employeeName: 'David Park',
      employeeId: 'EMP-2923',
      startDate: 'Apr 8, 2026',
      endDate: 'Apr 9, 2026',
      totalDays: 2,
      registeredDate: 'Apr 8, 2026',
    },
  ]);

  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: 'E-001',
      name: 'Sophie Harman',
      employeeId: 'EMP-2847',
      position: 'Software Engineer',
      department: 'Engineering',
      hireDate: 'Jan 15, 2024',
      status: 'active',
    },
    {
      id: 'E-002',
      name: 'Sarah Chen',
      employeeId: 'EMP-2901',
      position: 'Senior Developer',
      department: 'Engineering',
      hireDate: 'Mar 10, 2023',
      status: 'active',
    },
    {
      id: 'E-003',
      name: 'Marcus Johnson',
      employeeId: 'EMP-2745',
      position: 'Project Manager',
      department: 'Management',
      hireDate: 'Jun 20, 2022',
      status: 'active',
    },
    {
      id: 'E-004',
      name: 'Emily Zhang',
      employeeId: 'EMP-2654',
      position: 'QA Engineer',
      department: 'Quality Assurance',
      hireDate: 'Sep 5, 2023',
      status: 'active',
    },
    {
      id: 'E-005',
      name: 'David Park',
      employeeId: 'EMP-2923',
      position: 'DevOps Engineer',
      department: 'Engineering',
      hireDate: 'Nov 12, 2024',
      status: 'active',
    },
  ]);

  const handleLogin = (username: string, password: string): boolean => {
    const credentials = [
      { username: 'sophie', password: '12345', role: 'employee' as const },
      { username: 'harald', password: '12345', role: 'supervisor' as const },
      { username: 'marcus', password: '12345', role: 'hr' as const },
      { username: 'test', password: '12345', role: 'admin' as const },
    ];

    const user = credentials.find(
      (cred) => cred.username === username && cred.password === password
    );

    if (user) {
      setLoggedInUser({ username: user.username, role: user.role });
      if (user.role === 'admin') {
        setActiveView('employee');
      } else {
        setActiveView(user.role === 'employee' ? 'employee' : user.role === 'hr' ? 'hr' : 'supervisor');
      }
      return true;
    }

    return false;
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
        {activeView === 'employee' && (
          <EmployeeDashboard
            timesheets={timesheets.filter((ts) => ts.employeeId === 'EMP-2847')}
            vacationRequests={vacationRequests.filter((vr) => vr.employeeId === 'EMP-2847')}
            onSubmitTimesheet={(timesheet) => setTimesheets([...timesheets, timesheet])}
            onSubmitVacation={(vacation) => setVacationRequests([...vacationRequests, vacation])}
            onUpdateTimesheet={(id, updates) =>
              setTimesheets(timesheets.map((ts) => (ts.id === id ? { ...ts, ...updates } : ts)))
            }
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
      </main>
    </div>
  );
}