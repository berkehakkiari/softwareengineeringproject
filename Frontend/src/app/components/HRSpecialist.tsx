import { Activity, Plus, User, Calendar, Shield, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { useState } from 'react';

interface SickLeave {
  id: string;
  employeeName: string;
  employeeId: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  registeredDate: string;
}

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

interface Employee {
  id: string;
  name: string;
  employeeId: string;
  position: string;
  department: string;
  hireDate: string;
  status: 'active' | 'inactive';
}

interface Props {
  sickLeaves: SickLeave[];
  timesheets: Timesheet[];
  employees: Employee[];
  onAddSickLeave: (sickLeave: SickLeave) => void;
}

export function HRSpecialist({ sickLeaves, timesheets, employees, onAddSickLeave }: Props) {
  const [activeTab, setActiveTab] = useState<'sickleave' | 'compliance'>('sickleave');
  const [showAddModal, setShowAddModal] = useState(false);
  const [employeeName, setEmployeeName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSubmit = () => {
    if (!employeeName || !employeeId || !startDate || !endDate) {
      alert('Please fill in all required fields');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) {
      alert('End date must be after start date');
      return;
    }

    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const newSickLeave: SickLeave = {
      id: `SL-${Date.now()}`,
      employeeName,
      employeeId,
      startDate,
      endDate,
      totalDays: diffDays,
      registeredDate: 'Apr 13, 2026',
    };

    onAddSickLeave(newSickLeave);
    setShowAddModal(false);
    setEmployeeName('');
    setEmployeeId('');
    setStartDate('');
    setEndDate('');
    alert('Sick leave registered successfully!');
  };

  const totalSickDays = sickLeaves.reduce((sum, sl) => sum + sl.totalDays, 0);
  const employeesOnSickLeave = new Set(sickLeaves.map((sl) => sl.employeeId)).size;

  // Compliance calculations
  const getEmployeeCompliance = () => {
    const activeEmployees = employees.filter((emp) => emp.status === 'active');

    return activeEmployees.map((employee) => {
      const employeeTimesheets = timesheets.filter(
        (ts) => ts.employeeId === employee.employeeId && ts.status === 'approved'
      );

      // Calculate weekly hours (current week - Week 15)
      const currentWeekTimesheets = employeeTimesheets.filter((ts) =>
        ts.weekPeriod.includes('Week 15')
      );
      const weeklyHours = currentWeekTimesheets.reduce((sum, ts) => sum + ts.hoursSubmitted, 0);

      // Calculate average daily hours (assuming 5 work days)
      const dailyHours = weeklyHours / 5;

      // Compliance checks
      const isOvertime = weeklyHours > 48; // EU Working Time Directive: max 48 hours/week
      const isUndertime = weeklyHours < 35 && weeklyHours > 0; // Less than standard work week
      const excessiveOvertime = weeklyHours > 60; // Excessive overtime
      const dailyExcessive = dailyHours > 10; // Daily limit exceeded

      let complianceStatus: 'compliant' | 'warning' | 'violation' = 'compliant';
      let complianceIssues: string[] = [];

      if (excessiveOvertime) {
        complianceStatus = 'violation';
        complianceIssues.push(`Excessive overtime: ${weeklyHours} hrs/week (max 60)`);
      } else if (isOvertime) {
        complianceStatus = 'warning';
        complianceIssues.push(`Overtime detected: ${weeklyHours} hrs/week (recommended max 48)`);
      }

      if (dailyExcessive) {
        complianceStatus = complianceStatus === 'violation' ? 'violation' : 'warning';
        complianceIssues.push(`Daily hours excessive: ${dailyHours.toFixed(1)} hrs/day (max 10)`);
      }

      if (isUndertime) {
        complianceStatus = complianceStatus === 'violation' ? 'violation' : 'warning';
        complianceIssues.push(`Undertime: ${weeklyHours} hrs/week`);
      }

      // Check rest periods (11 hours between shifts - simplified check)
      const hasInsufficientRest = weeklyHours > 55;
      if (hasInsufficientRest) {
        complianceStatus = 'warning';
        complianceIssues.push('Potential insufficient rest periods');
      }

      return {
        employee,
        weeklyHours,
        dailyHours,
        complianceStatus,
        complianceIssues,
        totalTimesheets: employeeTimesheets.length,
      };
    });
  };

  const complianceData = getEmployeeCompliance();
  const violationCount = complianceData.filter((data) => data.complianceStatus === 'violation').length;
  const warningCount = complianceData.filter((data) => data.complianceStatus === 'warning').length;
  const compliantCount = complianceData.filter((data) => data.complianceStatus === 'compliant').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl text-neutral-900">HR Specialist Dashboard</h2>
        <p className="text-neutral-600 mt-1">Manage sick leave and monitor compliance</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-neutral-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('sickleave')}
          className={`px-6 py-2.5 rounded-md text-sm transition-colors flex items-center gap-2 ${
            activeTab === 'sickleave'
              ? 'bg-white text-neutral-900 shadow-sm'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          <Activity className="w-4 h-4" />
          Sick Leave
        </button>
        <button
          onClick={() => setActiveTab('compliance')}
          className={`px-6 py-2.5 rounded-md text-sm transition-colors flex items-center gap-2 ${
            activeTab === 'compliance'
              ? 'bg-white text-neutral-900 shadow-sm'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          <Shield className="w-4 h-4" />
          Compliance Monitoring
          {(violationCount > 0 || warningCount > 0) && (
            <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">
              {violationCount + warningCount}
            </span>
          )}
        </button>
      </div>

      {activeTab === 'sickleave' ? (
        <>
          {/* Statistics */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-lg border border-neutral-200 p-6">
              <div className="flex items-center gap-2 text-neutral-600 mb-2">
                <Activity className="w-5 h-5" />
                <span className="text-sm">Total Sick Days (YTD)</span>
              </div>
              <p className="text-3xl text-neutral-900">{totalSickDays}</p>
            </div>
            <div className="bg-white rounded-lg border border-neutral-200 p-6">
              <div className="flex items-center gap-2 text-neutral-600 mb-2">
                <User className="w-5 h-5" />
                <span className="text-sm">Employees with Sick Leave</span>
              </div>
              <p className="text-3xl text-neutral-900">{employeesOnSickLeave}</p>
            </div>
            <div className="bg-white rounded-lg border border-neutral-200 p-6">
              <div className="flex items-center gap-2 text-neutral-600 mb-2">
                <Calendar className="w-5 h-5" />
                <span className="text-sm">Total Records</span>
              </div>
              <p className="text-3xl text-neutral-900">{sickLeaves.length}</p>
            </div>
          </div>

          {/* Register Button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Register Sick Leave
          </button>

          {/* Sick Leave Records */}
          <div className="bg-white rounded-lg border border-neutral-200">
            <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50">
              <h3 className="text-lg text-neutral-900">Sick Leave Records</h3>
            </div>

            {sickLeaves.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <Activity className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                <p className="text-neutral-600">No sick leave records</p>
              </div>
            ) : (
              <div className="divide-y divide-neutral-100">
                {sickLeaves.map((sickLeave) => (
                  <div key={sickLeave.id} className="px-6 py-4 hover:bg-neutral-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-neutral-200 flex items-center justify-center">
                          <User className="w-6 h-6 text-neutral-600" />
                        </div>
                        <div>
                          <p className="text-neutral-900 font-medium">{sickLeave.employeeName}</p>
                          <p className="text-sm text-neutral-500">{sickLeave.employeeId}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-neutral-600">
                          {sickLeave.startDate} - {sickLeave.endDate}
                        </p>
                        <p className="text-sm text-neutral-900 mt-1">
                          {sickLeave.totalDays} {sickLeave.totalDays === 1 ? 'day' : 'days'}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 ml-[60px]">
                      <p className="text-xs text-neutral-500">
                        Registered on {sickLeave.registeredDate}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          {/* Compliance Statistics */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white rounded-lg border border-neutral-200 p-6">
              <div className="flex items-center gap-2 text-neutral-600 mb-2">
                <User className="w-5 h-5" />
                <span className="text-sm">Total Employees</span>
              </div>
              <p className="text-3xl text-neutral-900">{complianceData.length}</p>
            </div>
            <div className="bg-white rounded-lg border border-neutral-200 p-6">
              <div className="flex items-center gap-2 text-green-600 mb-2">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm">Compliant</span>
              </div>
              <p className="text-3xl text-green-700">{compliantCount}</p>
            </div>
            <div className="bg-white rounded-lg border border-neutral-200 p-6">
              <div className="flex items-center gap-2 text-yellow-600 mb-2">
                <AlertTriangle className="w-5 h-5" />
                <span className="text-sm">Warnings</span>
              </div>
              <p className="text-3xl text-yellow-700">{warningCount}</p>
            </div>
            <div className="bg-white rounded-lg border border-neutral-200 p-6">
              <div className="flex items-center gap-2 text-red-600 mb-2">
                <AlertTriangle className="w-5 h-5" />
                <span className="text-sm">Violations</span>
              </div>
              <p className="text-3xl text-red-700">{violationCount}</p>
            </div>
          </div>

          {/* Compliance Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-3">
              <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-medium mb-1">Labor Law Compliance Standards</p>
                <ul className="list-disc list-inside space-y-1 text-blue-800">
                  <li>Maximum weekly hours: 48 hours (EU Working Time Directive)</li>
                  <li>Maximum daily hours: 10 hours</li>
                  <li>Minimum rest period: 11 hours between shifts</li>
                  <li>Standard work week: 35-40 hours</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Employee Compliance Table */}
          <div className="bg-white rounded-lg border border-neutral-200">
            <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50">
              <h3 className="text-lg text-neutral-900">Employee Working Hours Compliance</h3>
            </div>

            {complianceData.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <Shield className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                <p className="text-neutral-600">No compliance data available</p>
              </div>
            ) : (
              <div className="divide-y divide-neutral-100">
                {complianceData.map((data) => (
                  <div key={data.employee.id} className="px-6 py-4 hover:bg-neutral-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-12 h-12 rounded-full bg-neutral-200 flex items-center justify-center">
                          <User className="w-6 h-6 text-neutral-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <p className="text-neutral-900 font-medium">{data.employee.name}</p>
                            <span
                              className={`px-3 py-1 text-xs rounded-full ${
                                data.complianceStatus === 'compliant'
                                  ? 'bg-green-50 text-green-700'
                                  : data.complianceStatus === 'warning'
                                  ? 'bg-yellow-50 text-yellow-700'
                                  : 'bg-red-50 text-red-700'
                              }`}
                            >
                              {data.complianceStatus === 'compliant'
                                ? 'Compliant'
                                : data.complianceStatus === 'warning'
                                ? 'Warning'
                                : 'Violation'}
                            </span>
                          </div>
                          <p className="text-sm text-neutral-500 mt-1">
                            {data.employee.employeeId} • {data.employee.department}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Hours Breakdown */}
                    <div className="mt-4 grid grid-cols-3 gap-4 ml-[60px]">
                      <div className="bg-neutral-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-neutral-600 mb-1">
                          <Clock className="w-4 h-4" />
                          <p className="text-xs">Weekly Hours</p>
                        </div>
                        <p className="text-lg text-neutral-900">{data.weeklyHours} hrs</p>
                        <p className="text-xs text-neutral-500 mt-1">Week 15 (Current)</p>
                      </div>
                      <div className="bg-neutral-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-neutral-600 mb-1">
                          <Calendar className="w-4 h-4" />
                          <p className="text-xs">Avg. Daily Hours</p>
                        </div>
                        <p className="text-lg text-neutral-900">{data.dailyHours.toFixed(1)} hrs</p>
                        <p className="text-xs text-neutral-500 mt-1">Per work day</p>
                      </div>
                      <div className="bg-neutral-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-neutral-600 mb-1">
                          <Activity className="w-4 h-4" />
                          <p className="text-xs">Timesheets</p>
                        </div>
                        <p className="text-lg text-neutral-900">{data.totalTimesheets}</p>
                        <p className="text-xs text-neutral-500 mt-1">Total submitted</p>
                      </div>
                    </div>

                    {/* Compliance Issues */}
                    {data.complianceIssues.length > 0 && (
                      <div className="mt-4 ml-[60px]">
                        <div
                          className={`rounded-lg p-3 ${
                            data.complianceStatus === 'violation'
                              ? 'bg-red-50 border border-red-200'
                              : 'bg-yellow-50 border border-yellow-200'
                          }`}
                        >
                          <p
                            className={`text-sm font-medium mb-2 ${
                              data.complianceStatus === 'violation'
                                ? 'text-red-800'
                                : 'text-yellow-800'
                            }`}
                          >
                            Compliance Issues:
                          </p>
                          <ul className="space-y-1">
                            {data.complianceIssues.map((issue, index) => (
                              <li
                                key={index}
                                className={`text-sm flex items-start gap-2 ${
                                  data.complianceStatus === 'violation'
                                    ? 'text-red-700'
                                    : 'text-yellow-700'
                                }`}
                              >
                                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                {issue}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Add Sick Leave Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl text-neutral-900">Register Sick Leave</h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEmployeeName('');
                  setEmployeeId('');
                  setStartDate('');
                  setEndDate('');
                }}
                className="text-neutral-400 hover:text-neutral-600"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-neutral-700 mb-2">
                  Employee Name *
                </label>
                <input
                  type="text"
                  value={employeeName}
                  onChange={(e) => setEmployeeName(e.target.value)}
                  placeholder="Enter employee name"
                  className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-neutral-700 mb-2">
                  Employee ID *
                </label>
                <input
                  type="text"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  placeholder="e.g., EMP-2847"
                  className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-neutral-700 mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-neutral-700 mb-2">
                  End Date *
                </label>
                <input
                  type="date"
                  value={endDate}
                  min={startDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEmployeeName('');
                    setEmployeeId('');
                    setStartDate('');
                    setEndDate('');
                  }}
                  className="flex-1 px-4 py-3 border border-neutral-200 rounded-lg text-neutral-700 hover:bg-neutral-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Register Sick Leave
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}