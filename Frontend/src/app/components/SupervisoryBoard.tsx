import { Check, X, User, Clock, Calendar, AlertCircle, Plane, Users, Activity, UserPlus, BarChart3 } from 'lucide-react';
import { useState } from 'react';

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
  notes?: string;
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
  timesheets: Timesheet[];
  vacationRequests: VacationRequest[];
  sickLeaves: SickLeave[];
  employees: Employee[];
  onUpdateTimesheet: (id: string, updates: Partial<Timesheet>) => void;
  onUpdateVacation: (id: string, updates: Partial<VacationRequest>) => void;
  onAddEmployee: (employee: Employee) => void;
  onUpdateEmployee: (id: string, updates: Partial<Employee>) => void;
}

export function SupervisoryBoard({
  timesheets,
  vacationRequests,
  sickLeaves,
  employees,
  onUpdateTimesheet,
  onUpdateVacation,
  onAddEmployee,
  onUpdateEmployee,
}: Props) {
  const [activeTab, setActiveTab] = useState<'timesheets' | 'vacations' | 'sickleave' | 'employees'>('timesheets');
  const [selectedTimesheet, setSelectedTimesheet] = useState<Timesheet | null>(null);
  const [selectedVacation, setSelectedVacation] = useState<VacationRequest | null>(null);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [rejectionNotes, setRejectionNotes] = useState('');
  const [showVacationDenialModal, setShowVacationDenialModal] = useState(false);
  const [vacationDenialNotes, setVacationDenialNotes] = useState('');
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [newEmployeeName, setNewEmployeeName] = useState('');
  const [newEmployeePosition, setNewEmployeePosition] = useState('');
  const [newEmployeeDepartment, setNewEmployeeDepartment] = useState('');

  const handleApprove = (timesheetId: string) => {
    onUpdateTimesheet(timesheetId, { status: 'approved' });
    setSelectedTimesheet(null);
  };

  const handleReject = (timesheetId: string, notes: string) => {
    onUpdateTimesheet(timesheetId, { status: 'correction_requested', rejectionNotes: notes });
    setSelectedTimesheet(null);
    setShowRejectionModal(false);
    setRejectionNotes('');
  };

  const handleApproveVacation = (vacationId: string) => {
    onUpdateVacation(vacationId, { status: 'approved' });
    setSelectedVacation(null);
  };

  const handleRejectVacation = (vacationId: string, notes: string) => {
    onUpdateVacation(vacationId, { status: 'denied', denialNotes: notes });
    setSelectedVacation(null);
    setShowVacationDenialModal(false);
    setVacationDenialNotes('');
  };

  const pendingTimesheetsCount = timesheets.filter((ts) => ts.status === 'pending').length;
  const pendingVacationsCount = vacationRequests.filter((vr) => vr.status === 'pending').length;
  const totalEmployees = new Set([
    ...timesheets.map((ts) => ts.employeeId),
    ...vacationRequests.map((vr) => vr.employeeId),
  ]).size;
  const totalHoursThisWeek = timesheets
    .filter((ts) => ts.weekPeriod.includes('Week 15'))
    .reduce((sum, ts) => sum + ts.hoursSubmitted, 0);
  const totalVacationDays = vacationRequests
    .filter((vr) => vr.status === 'approved')
    .reduce((sum, vr) => sum + vr.totalDays, 0);
  const totalSickDays = sickLeaves.reduce((sum, sl) => sum + sl.totalDays, 0);
  const activeEmployeesCount = employees.filter((emp) => emp.status === 'active').length;

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div>
        <h2 className="text-2xl text-neutral-900">Supervisory Board</h2>
        <p className="text-neutral-600 mt-1">Company-wide time management overview</p>
      </div>

      {/* Company Statistics */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-neutral-200 p-6">
          <div className="flex items-center gap-2 text-neutral-600 mb-2">
            <Users className="w-5 h-5" />
            <span className="text-sm">Active Employees</span>
          </div>
          <p className="text-3xl text-neutral-900">{activeEmployeesCount}</p>
        </div>
        <div className="bg-white rounded-lg border border-neutral-200 p-6">
          <div className="flex items-center gap-2 text-neutral-600 mb-2">
            <Clock className="w-5 h-5" />
            <span className="text-sm">Hours This Week</span>
          </div>
          <p className="text-3xl text-neutral-900">{totalHoursThisWeek}</p>
        </div>
        <div className="bg-white rounded-lg border border-neutral-200 p-6">
          <div className="flex items-center gap-2 text-yellow-600 mb-2">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm">Pending Approvals</span>
          </div>
          <p className="text-3xl text-neutral-900">
            {pendingTimesheetsCount + pendingVacationsCount}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-neutral-200 p-6">
          <div className="flex items-center gap-2 text-neutral-600 mb-2">
            <Plane className="w-5 h-5" />
            <span className="text-sm">Vacation Days (YTD)</span>
          </div>
          <p className="text-3xl text-neutral-900">{totalVacationDays}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-neutral-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('timesheets')}
          className={`px-6 py-2.5 rounded-md text-sm transition-colors flex items-center gap-2 ${
            activeTab === 'timesheets'
              ? 'bg-white text-neutral-900 shadow-sm'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          <Clock className="w-4 h-4" />
          Timesheets
          {pendingTimesheetsCount > 0 && (
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
              {pendingTimesheetsCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('vacations')}
          className={`px-6 py-2.5 rounded-md text-sm transition-colors flex items-center gap-2 ${
            activeTab === 'vacations'
              ? 'bg-white text-neutral-900 shadow-sm'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          <Plane className="w-4 h-4" />
          Vacation Requests
          {pendingVacationsCount > 0 && (
            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
              {pendingVacationsCount}
            </span>
          )}
        </button>
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
          <span className="px-2 py-0.5 bg-neutral-100 text-neutral-700 text-xs rounded-full">
            {totalSickDays} days
          </span>
        </button>
        <button
          onClick={() => setActiveTab('employees')}
          className={`px-6 py-2.5 rounded-md text-sm transition-colors flex items-center gap-2 ${
            activeTab === 'employees'
              ? 'bg-white text-neutral-900 shadow-sm'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          Employee Stats
        </button>
      </div>

      {/* Content */}
      {activeTab === 'timesheets' ? (
        <div className="bg-white rounded-lg border border-neutral-200">
          <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-neutral-200 bg-neutral-50 text-sm text-neutral-600">
            <div className="col-span-3">Employee</div>
            <div className="col-span-2">Week Period</div>
            <div className="col-span-2">Hours</div>
            <div className="col-span-2">Variance</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>

          {timesheets.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <Clock className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
              <p className="text-neutral-600">No timesheets found</p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {timesheets.map((timesheet) => {
                const variance = timesheet.hoursSubmitted - timesheet.standardHours;
                const hasVariance = variance !== 0;

                return (
                  <div
                    key={timesheet.id}
                    className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-neutral-50 transition-colors cursor-pointer"
                    onClick={() => setSelectedTimesheet(timesheet)}
                  >
                    <div className="col-span-3 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center">
                        <User className="w-5 h-5 text-neutral-600" />
                      </div>
                      <div>
                        <p className="text-neutral-900">{timesheet.employeeName}</p>
                        <p className="text-sm text-neutral-500">{timesheet.employeeId}</p>
                      </div>
                    </div>

                    <div className="col-span-2 flex items-center">
                      <div className="flex items-center gap-2 text-neutral-700">
                        <Calendar className="w-4 h-4 text-neutral-400" />
                        <span className="text-sm">{timesheet.weekPeriod}</span>
                      </div>
                    </div>

                    <div className="col-span-2 flex items-center">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-neutral-400" />
                        <span className="text-neutral-900">{timesheet.hoursSubmitted} hrs</span>
                      </div>
                    </div>

                    <div className="col-span-2 flex items-center">
                      {hasVariance ? (
                        <span
                          className={`px-2 py-1 rounded text-sm ${
                            variance > 0
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-blue-50 text-blue-700'
                          }`}
                        >
                          {variance > 0 ? '+' : ''}
                          {variance} hrs
                        </span>
                      ) : (
                        <span className="text-neutral-500 text-sm">Standard</span>
                      )}
                    </div>

                    <div className="col-span-2 flex items-center">
                      {timesheet.status === 'pending' && (
                        <span className="px-3 py-1 bg-yellow-50 text-yellow-700 text-sm rounded-full">
                          Pending
                        </span>
                      )}
                      {timesheet.status === 'approved' && (
                        <span className="px-3 py-1 bg-green-50 text-green-700 text-sm rounded-full">
                          Approved
                        </span>
                      )}
                      {timesheet.status === 'correction_requested' && (
                        <span className="px-3 py-1 bg-orange-50 text-orange-700 text-sm rounded-full">
                          Correction Requested
                        </span>
                      )}
                    </div>

                    <div className="col-span-1 flex items-center justify-end gap-2">
                      {timesheet.status === 'pending' ? (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleApprove(timesheet.id);
                            }}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Approve"
                          >
                            <Check className="w-5 h-5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTimesheet(timesheet);
                              setShowRejectionModal(true);
                            }}
                            className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                            title="Request Correction"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </>
                      ) : (
                        <span className="text-sm text-neutral-400">—</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : activeTab === 'vacations' ? (
        <div className="bg-white rounded-lg border border-neutral-200">
          <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-neutral-200 bg-neutral-50 text-sm text-neutral-600">
            <div className="col-span-3">Employee</div>
            <div className="col-span-2">Start Date</div>
            <div className="col-span-2">End Date</div>
            <div className="col-span-2">Type</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>

          {vacationRequests.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <Plane className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
              <p className="text-neutral-600">No vacation requests found</p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {vacationRequests.map((vacation) => (
                <div
                  key={vacation.id}
                  className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-neutral-50 transition-colors cursor-pointer"
                  onClick={() => setSelectedVacation(vacation)}
                >
                  <div className="col-span-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center">
                      <User className="w-5 h-5 text-neutral-600" />
                    </div>
                    <div>
                      <p className="text-neutral-900">{vacation.employeeName}</p>
                      <p className="text-sm text-neutral-500">{vacation.employeeId}</p>
                    </div>
                  </div>

                  <div className="col-span-2 flex items-center">
                    <span className="text-sm text-neutral-900">{vacation.startDate}</span>
                  </div>

                  <div className="col-span-2 flex items-center">
                    <span className="text-sm text-neutral-900">{vacation.endDate}</span>
                  </div>

                  <div className="col-span-2 flex items-center">
                    <div>
                      <p className="text-sm text-neutral-700">{vacation.vacationType}</p>
                      <p className="text-xs text-neutral-500">
                        {vacation.totalDays} {vacation.totalDays === 1 ? 'day' : 'days'}
                      </p>
                    </div>
                  </div>

                  <div className="col-span-2 flex items-center">
                    {vacation.status === 'pending' && (
                      <span className="px-3 py-1 bg-yellow-50 text-yellow-700 text-sm rounded-full">
                        Pending
                      </span>
                    )}
                    {vacation.status === 'approved' && (
                      <span className="px-3 py-1 bg-green-50 text-green-700 text-sm rounded-full">
                        Approved
                      </span>
                    )}
                    {vacation.status === 'denied' && (
                      <span className="px-3 py-1 bg-red-50 text-red-700 text-sm rounded-full">
                        Denied
                      </span>
                    )}
                  </div>

                  <div className="col-span-1 flex items-center justify-end gap-2">
                    {vacation.status === 'pending' ? (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApproveVacation(vacation.id);
                          }}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Approve"
                        >
                          <Check className="w-5 h-5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedVacation(vacation);
                            setShowVacationDenialModal(true);
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Deny"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </>
                    ) : (
                      <span className="text-sm text-neutral-400">—</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : activeTab === 'sickleave' ? (
        <div className="bg-white rounded-lg border border-neutral-200">
          <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-neutral-200 bg-neutral-50 text-sm text-neutral-600">
            <div className="col-span-3">Employee</div>
            <div className="col-span-2">Start Date</div>
            <div className="col-span-2">End Date</div>
            <div className="col-span-2">Duration</div>
            <div className="col-span-2">Registered</div>
            <div className="col-span-1">Notes</div>
          </div>

          {sickLeaves.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <Activity className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
              <p className="text-neutral-600">No sick leave records</p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {sickLeaves.map((sickLeave) => (
                <div
                  key={sickLeave.id}
                  className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-neutral-50 transition-colors"
                >
                  <div className="col-span-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center">
                      <User className="w-5 h-5 text-neutral-600" />
                    </div>
                    <div>
                      <p className="text-neutral-900">{sickLeave.employeeName}</p>
                      <p className="text-sm text-neutral-500">{sickLeave.employeeId}</p>
                    </div>
                  </div>

                  <div className="col-span-2 flex items-center">
                    <span className="text-sm text-neutral-900">{sickLeave.startDate}</span>
                  </div>

                  <div className="col-span-2 flex items-center">
                    <span className="text-sm text-neutral-900">{sickLeave.endDate}</span>
                  </div>

                  <div className="col-span-2 flex items-center">
                    <span className="text-neutral-900">
                      {sickLeave.totalDays} {sickLeave.totalDays === 1 ? 'day' : 'days'}
                    </span>
                  </div>

                  <div className="col-span-2 flex items-center">
                    <span className="text-sm text-neutral-600">{sickLeave.registeredDate}</span>
                  </div>

                  <div className="col-span-1 flex items-center">
                    {sickLeave.notes && (
                      <span className="text-xs text-neutral-500 truncate" title={sickLeave.notes}>
                        {sickLeave.notes}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Employee Stats */
        <div className="space-y-6">
          {/* Recruit Button */}
          <button
            onClick={() => setShowAddEmployeeModal(true)}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <UserPlus className="w-5 h-5" />
            Recruit New Employee
          </button>

          {/* Employee List */}
          <div className="bg-white rounded-lg border border-neutral-200">
            <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50">
              <h3 className="text-lg text-neutral-900">All Employees</h3>
            </div>

            {employees.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <Users className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                <p className="text-neutral-600">No employees found</p>
              </div>
            ) : (
              <div className="divide-y divide-neutral-100">
                {employees.map((employee) => {
                  const employeeTimesheets = timesheets.filter(
                    (ts) => ts.employeeId === employee.employeeId
                  );
                  const employeeVacations = vacationRequests.filter(
                    (vr) => vr.employeeId === employee.employeeId && vr.status === 'approved'
                  );
                  const employeeSickLeaves = sickLeaves.filter(
                    (sl) => sl.employeeId === employee.employeeId
                  );

                  const totalHours = employeeTimesheets
                    .filter((ts) => ts.status === 'approved')
                    .reduce((sum, ts) => sum + ts.hoursSubmitted, 0);
                  const totalVacationDays = employeeVacations.reduce(
                    (sum, vr) => sum + vr.totalDays,
                    0
                  );
                  const totalSickDaysEmployee = employeeSickLeaves.reduce(
                    (sum, sl) => sum + sl.totalDays,
                    0
                  );

                  return (
                    <div key={employee.id} className="px-6 py-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-12 h-12 rounded-full bg-neutral-200 flex items-center justify-center">
                            <User className="w-6 h-6 text-neutral-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <p className="text-neutral-900 font-medium">{employee.name}</p>
                              <span
                                className={`px-2 py-1 text-xs rounded-full ${
                                  employee.status === 'active'
                                    ? 'bg-green-50 text-green-700'
                                    : 'bg-red-50 text-red-700'
                                }`}
                              >
                                {employee.status}
                              </span>
                            </div>
                            <p className="text-sm text-neutral-500 mt-1">
                              {employee.employeeId} • {employee.position} • {employee.department}
                            </p>
                            <p className="text-xs text-neutral-400 mt-1">
                              Hired: {employee.hireDate}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          {employee.status === 'active' ? (
                            <button
                              onClick={() =>
                                onUpdateEmployee(employee.id, { status: 'inactive' })
                              }
                              className="px-3 py-1 text-sm border border-red-200 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
                            >
                              Remove
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                onUpdateEmployee(employee.id, { status: 'active' })
                              }
                              className="px-3 py-1 text-sm border border-green-200 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                            >
                              Reactivate
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Employee Stats */}
                      <div className="mt-4 grid grid-cols-4 gap-4 ml-[60px]">
                        <div className="bg-neutral-50 rounded-lg p-3 text-center">
                          <p className="text-xs text-neutral-500 mb-1">Total Hours</p>
                          <p className="text-lg text-neutral-900">{totalHours}</p>
                        </div>
                        <div className="bg-neutral-50 rounded-lg p-3 text-center">
                          <p className="text-xs text-neutral-500 mb-1">Timesheets</p>
                          <p className="text-lg text-neutral-900">{employeeTimesheets.length}</p>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-3 text-center">
                          <p className="text-xs text-blue-600 mb-1">Vacation Days</p>
                          <p className="text-lg text-blue-700">{totalVacationDays}</p>
                        </div>
                        <div className="bg-orange-50 rounded-lg p-3 text-center">
                          <p className="text-xs text-orange-600 mb-1">Sick Days</p>
                          <p className="text-lg text-orange-700">{totalSickDaysEmployee}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Timesheet Detail Modal */}
      {selectedTimesheet && !showRejectionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-xl text-neutral-900">Timesheet Details</h3>
                <p className="text-sm text-neutral-500 mt-1">{selectedTimesheet.id}</p>
              </div>
              <button
                onClick={() => setSelectedTimesheet(null)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-neutral-500 mb-1">Employee Name</p>
                  <p className="text-neutral-900">{selectedTimesheet.employeeName}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-500 mb-1">Employee ID</p>
                  <p className="text-neutral-900">{selectedTimesheet.employeeId}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-neutral-500 mb-1">Week Period</p>
                  <p className="text-neutral-900">{selectedTimesheet.weekPeriod}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-500 mb-1">Submitted On</p>
                  <p className="text-neutral-900">{selectedTimesheet.submittedDate}</p>
                </div>
              </div>

              <div className="bg-neutral-50 rounded-lg p-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-sm text-neutral-500 mb-1">Hours Submitted</p>
                    <p className="text-2xl text-neutral-900">{selectedTimesheet.hoursSubmitted}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500 mb-1">Standard Hours</p>
                    <p className="text-2xl text-neutral-900">{selectedTimesheet.standardHours}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500 mb-1">Variance</p>
                    <p
                      className={`text-2xl ${
                        selectedTimesheet.hoursSubmitted > selectedTimesheet.standardHours
                          ? 'text-amber-600'
                          : selectedTimesheet.hoursSubmitted < selectedTimesheet.standardHours
                          ? 'text-blue-600'
                          : 'text-neutral-900'
                      }`}
                    >
                      {selectedTimesheet.hoursSubmitted - selectedTimesheet.standardHours > 0
                        ? '+'
                        : ''}
                      {selectedTimesheet.hoursSubmitted - selectedTimesheet.standardHours}
                    </p>
                  </div>
                </div>
              </div>

              {selectedTimesheet.notes && (
                <div>
                  <p className="text-sm text-neutral-500 mb-2">Employee Notes</p>
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-neutral-700">{selectedTimesheet.notes}</p>
                  </div>
                </div>
              )}

              {selectedTimesheet.rejectionNotes && (
                <div>
                  <p className="text-sm text-neutral-500 mb-2">Correction Request Notes</p>
                  <div className="bg-orange-50 border border-orange-100 rounded-lg p-4 flex gap-3">
                    <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <p className="text-neutral-700">{selectedTimesheet.rejectionNotes}</p>
                  </div>
                </div>
              )}

              {selectedTimesheet.status === 'pending' && (
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowRejectionModal(true)}
                    className="flex-1 px-4 py-3 border border-orange-200 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <X className="w-5 h-5" />
                    Request Correction
                  </button>
                  <button
                    onClick={() => handleApprove(selectedTimesheet.id)}
                    className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Check className="w-5 h-5" />
                    Approve Timesheet
                  </button>
                </div>
              )}
              {selectedTimesheet.status !== 'pending' && (
                <div className="pt-4 text-center">
                  <p className="text-neutral-600">
                    This timesheet has been{' '}
                    <span
                      className={
                        selectedTimesheet.status === 'approved'
                          ? 'text-green-700 font-medium'
                          : 'text-orange-700 font-medium'
                      }
                    >
                      {selectedTimesheet.status === 'correction_requested'
                        ? 'sent back for correction'
                        : selectedTimesheet.status}
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Vacation Detail Modal */}
      {selectedVacation && !showVacationDenialModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-xl text-neutral-900">Vacation Request Details</h3>
                <p className="text-sm text-neutral-500 mt-1">{selectedVacation.id}</p>
              </div>
              <button
                onClick={() => setSelectedVacation(null)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-neutral-500 mb-1">Employee Name</p>
                  <p className="text-neutral-900">{selectedVacation.employeeName}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-500 mb-1">Employee ID</p>
                  <p className="text-neutral-900">{selectedVacation.employeeId}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-neutral-500 mb-1">Vacation Type</p>
                  <p className="text-neutral-900">{selectedVacation.vacationType}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-500 mb-1">Submitted On</p>
                  <p className="text-neutral-900">{selectedVacation.submittedDate}</p>
                </div>
              </div>

              <div className="bg-neutral-50 rounded-lg p-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-sm text-neutral-500 mb-1">Start Date</p>
                    <p className="text-lg text-neutral-900">{selectedVacation.startDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500 mb-1">End Date</p>
                    <p className="text-lg text-neutral-900">{selectedVacation.endDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500 mb-1">Total Days</p>
                    <p className="text-2xl text-neutral-900">{selectedVacation.totalDays}</p>
                  </div>
                </div>
              </div>

              {selectedVacation.reason && (
                <div>
                  <p className="text-sm text-neutral-500 mb-2">Employee Reason</p>
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-neutral-700">{selectedVacation.reason}</p>
                  </div>
                </div>
              )}

              {selectedVacation.denialNotes && (
                <div>
                  <p className="text-sm text-neutral-500 mb-2">Denial Reason</p>
                  <div className="bg-red-50 border border-red-100 rounded-lg p-4 flex gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-neutral-700">{selectedVacation.denialNotes}</p>
                  </div>
                </div>
              )}

              {selectedVacation.status === 'pending' && (
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowVacationDenialModal(true)}
                    className="flex-1 px-4 py-3 border border-red-200 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <X className="w-5 h-5" />
                    Deny Request
                  </button>
                  <button
                    onClick={() => handleApproveVacation(selectedVacation.id)}
                    className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Check className="w-5 h-5" />
                    Approve Request
                  </button>
                </div>
              )}
              {selectedVacation.status !== 'pending' && (
                <div className="pt-4 text-center">
                  <p className="text-neutral-600">
                    This vacation request has been{' '}
                    <span
                      className={
                        selectedVacation.status === 'approved'
                          ? 'text-green-700 font-medium'
                          : 'text-red-700 font-medium'
                      }
                    >
                      {selectedVacation.status}
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Timesheet Rejection Modal */}
      {showRejectionModal && selectedTimesheet && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-xl text-neutral-900">Request Correction</h3>
                <p className="text-sm text-neutral-500 mt-1">
                  {selectedTimesheet.employeeName} - {selectedTimesheet.id}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowRejectionModal(false);
                  setRejectionNotes('');
                }}
                className="text-neutral-400 hover:text-neutral-600"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-neutral-700 mb-2">
                  Please explain what needs to be corrected
                </label>
                <textarea
                  value={rejectionNotes}
                  onChange={(e) => setRejectionNotes(e.target.value)}
                  placeholder="e.g., Hours don't match project records, missing documentation, etc."
                  rows={4}
                  className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowRejectionModal(false);
                    setRejectionNotes('');
                  }}
                  className="flex-1 px-4 py-3 border border-neutral-200 rounded-lg text-neutral-700 hover:bg-neutral-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (!rejectionNotes.trim()) {
                      alert('Please provide notes explaining what needs to be corrected');
                      return;
                    }
                    handleReject(selectedTimesheet.id, rejectionNotes);
                  }}
                  className="flex-1 px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
                >
                  Send Back for Correction
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Vacation Denial Modal */}
      {showVacationDenialModal && selectedVacation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-xl text-neutral-900">Deny Vacation Request</h3>
                <p className="text-sm text-neutral-500 mt-1">
                  {selectedVacation.employeeName} - {selectedVacation.id}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowVacationDenialModal(false);
                  setVacationDenialNotes('');
                }}
                className="text-neutral-400 hover:text-neutral-600"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-neutral-700 mb-2">
                  Please explain why this request is being denied
                </label>
                <textarea
                  value={vacationDenialNotes}
                  onChange={(e) => setVacationDenialNotes(e.target.value)}
                  placeholder="e.g., Insufficient vacation days, conflicting team schedules, etc."
                  rows={4}
                  className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowVacationDenialModal(false);
                    setVacationDenialNotes('');
                  }}
                  className="flex-1 px-4 py-3 border border-neutral-200 rounded-lg text-neutral-700 hover:bg-neutral-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (!vacationDenialNotes.trim()) {
                      alert('Please provide a reason for denying this vacation request');
                      return;
                    }
                    handleRejectVacation(selectedVacation.id, vacationDenialNotes);
                  }}
                  className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Deny Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Employee Modal */}
      {showAddEmployeeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl text-neutral-900">Recruit New Employee</h3>
              <button
                onClick={() => {
                  setShowAddEmployeeModal(false);
                  setNewEmployeeName('');
                  setNewEmployeePosition('');
                  setNewEmployeeDepartment('');
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
                  value={newEmployeeName}
                  onChange={(e) => setNewEmployeeName(e.target.value)}
                  placeholder="Enter full name"
                  className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm text-neutral-700 mb-2">
                  Position *
                </label>
                <input
                  type="text"
                  value={newEmployeePosition}
                  onChange={(e) => setNewEmployeePosition(e.target.value)}
                  placeholder="e.g., Software Engineer"
                  className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm text-neutral-700 mb-2">
                  Department *
                </label>
                <select
                  value={newEmployeeDepartment}
                  onChange={(e) => setNewEmployeeDepartment(e.target.value)}
                  className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select department...</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Management">Management</option>
                  <option value="Quality Assurance">Quality Assurance</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Sales">Sales</option>
                  <option value="Marketing">Marketing</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowAddEmployeeModal(false);
                    setNewEmployeeName('');
                    setNewEmployeePosition('');
                    setNewEmployeeDepartment('');
                  }}
                  className="flex-1 px-4 py-3 border border-neutral-200 rounded-lg text-neutral-700 hover:bg-neutral-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (!newEmployeeName || !newEmployeePosition || !newEmployeeDepartment) {
                      alert('Please fill in all required fields');
                      return;
                    }

                    const newEmployeeId = `EMP-${Math.floor(Math.random() * 9000) + 1000}`;
                    const newEmployee: Employee = {
                      id: `E-${Date.now()}`,
                      name: newEmployeeName,
                      employeeId: newEmployeeId,
                      position: newEmployeePosition,
                      department: newEmployeeDepartment,
                      hireDate: 'Apr 14, 2026',
                      status: 'active',
                    };

                    onAddEmployee(newEmployee);
                    setShowAddEmployeeModal(false);
                    setNewEmployeeName('');
                    setNewEmployeePosition('');
                    setNewEmployeeDepartment('');
                    alert(`Employee recruited successfully! ID: ${newEmployeeId}`);
                  }}
                  className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  Recruit Employee
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
