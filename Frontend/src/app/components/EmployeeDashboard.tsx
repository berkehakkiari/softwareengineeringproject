import { Clock, Calendar, Plus, Plane, AlertCircle as AlertCircleIcon } from 'lucide-react';
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

interface Props {
  timesheets: Timesheet[];
  vacationRequests: VacationRequest[];
  onSubmitTimesheet: (timesheet: Timesheet) => void;
  onSubmitVacation: (vacation: VacationRequest) => void;
  onUpdateTimesheet: (id: string, updates: Partial<Timesheet>) => void;
  loggedInUser?: {
    fullName: string;
    userId: number;
  };
}

export function EmployeeDashboard({
  timesheets,
  vacationRequests,
  onSubmitTimesheet,
  onSubmitVacation,
  onUpdateTimesheet,
  loggedInUser,
}: Props) {
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showVacationModal, setShowVacationModal] = useState(false);
  const [vacationStartDate, setVacationStartDate] = useState('');
  const [vacationEndDate, setVacationEndDate] = useState('');
  const [dateError, setDateError] = useState('');
  const [selectedWeek, setSelectedWeek] = useState('');
  const [hoursWorked, setHoursWorked] = useState('');
  const [timesheetNotes, setTimesheetNotes] = useState('');
  const [editingTimesheet, setEditingTimesheet] = useState<Timesheet | null>(null);

  // Generate available months (past months only, up to current month)
  const getAvailableMonths = () => {
    const months = [];
    const currentDate = new Date(2026, 3, 13); // April 13, 2026
    const currentYear = 2026;
    const currentMonth = 3; // April (0-indexed)

    // Generate months from January 2026 to current month
    for (let i = 0; i <= currentMonth; i++) {
      const monthDate = new Date(currentYear, i, 1);
      const monthName = monthDate.toLocaleString('en-US', { month: 'long' });
      
      months.push({
        value: `${monthName} ${currentYear}`,
        label: `${monthName} ${currentYear}`,
      });
    }

    // Add last 3 months of previous year
    for (let i = 9; i <= 11; i++) {
      const monthDate = new Date(currentYear - 1, i, 1);
      const monthName = monthDate.toLocaleString('en-US', { month: 'long' });
      
      months.unshift({
        value: `${monthName} ${currentYear - 1}`,
        label: `${monthName} ${currentYear - 1}`,
      });
    }

    return months;
  };

  return (
    <div className="space-y-8">
      {/* Employee Info */}
      <div>
        <h2 className="text-2xl text-neutral-900">Welcome back, {loggedInUser?.fullName || 'Employee'}</h2>
        <p className="text-neutral-600 mt-1">Employee ID: EMP-{loggedInUser?.userId || '0000'}</p>
      </div>

      {/* Flex Time Balance */}
      <div className="bg-white rounded-lg border border-neutral-200 p-8">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-neutral-600 mb-2">
              <Clock className="w-5 h-5" />
              <span className="text-sm">Current Flex Time Balance</span>
            </div>
            <div className="text-6xl text-neutral-900 mb-2">+12.5</div>
            <p className="text-neutral-500">hours banked</p>

            <div className="mt-6 pt-6 border-t border-neutral-100">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-neutral-500">This Month</p>
                  <p className="text-xl text-neutral-900 mt-1">+4.5 hrs</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Last Updated</p>
                  <p className="text-xl text-neutral-900 mt-1">Apr 11, 2026</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vacation Balance */}
      <div className="bg-white rounded-lg border border-neutral-200 p-6">
        <div className="flex items-center gap-2 text-neutral-600 mb-4">
          <Plane className="w-5 h-5" />
          <h3 className="text-lg text-neutral-900">Vacation Days</h3>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-neutral-50 rounded-lg">
            <p className="text-sm text-neutral-500 mb-1">Current Year (2026)</p>
            <p className="text-3xl text-neutral-900">25</p>
            <p className="text-xs text-neutral-500 mt-1">of 30 days remaining</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-green-700 mb-1">Rollover Days</p>
            <p className="text-3xl text-green-700">3</p>
            <p className="text-xs text-green-600 mt-1">until Feb 2027</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700 mb-1">Total Available</p>
            <p className="text-3xl text-blue-700">28</p>
            <p className="text-xs text-blue-600 mt-1">days</p>
          </div>
        </div>

        <div className="border-t border-neutral-100 pt-4">
          <h4 className="text-sm text-neutral-600 mb-3">Recent Vacation Requests</h4>
          <div className="space-y-3">
            {vacationRequests.length === 0 ? (
              <p className="text-sm text-neutral-500 py-2">No vacation requests</p>
            ) : (
              vacationRequests.slice(0, 3).map((vacation) => (
                <div key={vacation.id} className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-neutral-900">
                      {vacation.startDate} - {vacation.endDate}
                    </p>
                    <p className="text-sm text-neutral-500 mt-1">
                      {vacation.vacationType} ({vacation.totalDays} {vacation.totalDays === 1 ? 'day' : 'days'})
                    </p>
                    {vacation.denialNotes && (
                      <p className="text-sm text-red-600 mt-1">Denied: {vacation.denialNotes}</p>
                    )}
                  </div>
                  <span
                    className={`px-3 py-1 text-sm rounded-full ${
                      vacation.status === 'pending'
                        ? 'bg-yellow-50 text-yellow-700'
                        : vacation.status === 'approved'
                        ? 'bg-green-50 text-green-700'
                        : 'bg-red-50 text-red-700'
                    }`}
                  >
                    {vacation.status === 'pending' ? 'Pending' : vacation.status === 'approved' ? 'Approved' : 'Denied'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Timesheets */}
      <div className="bg-white rounded-lg border border-neutral-200 p-6">
        <h3 className="text-lg text-neutral-900 mb-4">Recent Timesheets</h3>

        <div className="space-y-3">
          {timesheets.length === 0 ? (
            <p className="text-sm text-neutral-500 py-2">No timesheets submitted</p>
          ) : (
            timesheets.slice(0, 5).map((timesheet) => (
              <div key={timesheet.id} className="py-3 border-b border-neutral-100 last:border-0">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-neutral-900">{timesheet.weekPeriod}</p>
                    <p className="text-sm text-neutral-500 mt-1">{timesheet.hoursSubmitted} hours</p>
                    {timesheet.rejectionNotes && (
                      <p className="text-sm text-orange-600 mt-1">
                        Correction needed: {timesheet.rejectionNotes}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 text-sm rounded-full ${
                        timesheet.status === 'pending'
                          ? 'bg-yellow-50 text-yellow-700'
                          : timesheet.status === 'approved'
                          ? 'bg-green-50 text-green-700'
                          : 'bg-orange-50 text-orange-700'
                      }`}
                    >
                      {timesheet.status === 'pending'
                        ? 'Locked for Review'
                        : timesheet.status === 'approved'
                        ? 'Approved'
                        : 'Correction Requested'}
                    </span>
                    {timesheet.status === 'correction_requested' && (
                      <button
                        onClick={() => {
                          setEditingTimesheet(timesheet);
                          setSelectedWeek(timesheet.weekPeriod);
                          setHoursWorked(timesheet.hoursSubmitted.toString());
                          setTimesheetNotes(timesheet.notes || '');
                          setShowSubmitModal(true);
                        }}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                      >
                        Resubmit
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => setShowSubmitModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Submit Hours
        </button>
        <button
          onClick={() => setShowVacationModal(true)}
          className="bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <Plane className="w-5 h-5" />
          Request Vacation
        </button>
      </div>

      {/* Submit Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl text-neutral-900">
                {editingTimesheet ? 'Resubmit Hours' : 'Submit Hours'}
              </h3>
              <button
                onClick={() => {
                  setShowSubmitModal(false);
                  setEditingTimesheet(null);
                  setSelectedWeek('');
                  setHoursWorked('');
                  setTimesheetNotes('');
                }}
                className="text-neutral-400 hover:text-neutral-600"
              >
                ×
              </button>
            </div>

            {editingTimesheet && (
              <div className="mb-4 bg-orange-50 border border-orange-200 rounded-lg p-3">
                <p className="text-sm text-orange-700">
                  Resubmitting timesheet for correction
                </p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-neutral-700 mb-2">
                  Select Month
                </label>
                <select
                  value={selectedWeek}
                  onChange={(e) => setSelectedWeek(e.target.value)}
                  disabled={!!editingTimesheet}
                  className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-neutral-100 disabled:cursor-not-allowed"
                >
                  <option value="">Select a month...</option>
                  {getAvailableMonths().map((month) => (
                    <option key={month.value} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </select>
                {!editingTimesheet && (
                  <p className="text-xs text-neutral-500 mt-2">
                    Only past and current months can be submitted
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm text-neutral-700 mb-2">
                  Total Hours Worked
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={hoursWorked}
                  onChange={(e) => setHoursWorked(e.target.value)}
                  placeholder="40.0"
                  className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-neutral-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={timesheetNotes}
                  onChange={(e) => setTimesheetNotes(e.target.value)}
                  placeholder="Add any relevant notes about this month's hours..."
                  rows={3}
                  className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowSubmitModal(false);
                    setEditingTimesheet(null);
                    setSelectedWeek('');
                    setHoursWorked('');
                    setTimesheetNotes('');
                  }}
                  className="flex-1 px-4 py-3 border border-neutral-200 rounded-lg text-neutral-700 hover:bg-neutral-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (!selectedWeek) {
                      alert('Please select a month');
                      return;
                    }
                    if (!hoursWorked || parseFloat(hoursWorked) <= 0) {
                      alert('Please enter valid hours worked');
                      return;
                    }

                    if (editingTimesheet) {
                      // Resubmit existing timesheet
                      onUpdateTimesheet(editingTimesheet.id, {
                        hoursSubmitted: parseFloat(hoursWorked),
                        notes: timesheetNotes || undefined,
                        status: 'pending',
                        rejectionNotes: undefined,
                      });
                      alert('Timesheet resubmitted successfully and locked for review!');
                    } else {
                      // Submit new timesheet
                      const newTimesheet: Timesheet = {
                        id: `TS-${Date.now()}`,
                        employeeName: 'Sophie Harman',
                        employeeId: 'EMP-2847',
                        weekPeriod: selectedWeek,
                        hoursSubmitted: parseFloat(hoursWorked),
                        standardHours: 40.0,
                        submittedDate: 'Apr 13, 2026',
                        status: 'pending',
                        notes: timesheetNotes || undefined,
                      };
                      onSubmitTimesheet(newTimesheet);
                      alert('Hours submitted successfully and locked for review!');
                    }

                    setShowSubmitModal(false);
                    setEditingTimesheet(null);
                    setSelectedWeek('');
                    setHoursWorked('');
                    setTimesheetNotes('');
                  }}
                  className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  {editingTimesheet ? 'Resubmit' : 'Submit'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Vacation Request Modal */}
      {showVacationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl text-neutral-900">Request Vacation</h3>
              <button
                onClick={() => {
                  setShowVacationModal(false);
                  setVacationStartDate('');
                  setVacationEndDate('');
                  setDateError('');
                }}
                className="text-neutral-400 hover:text-neutral-600"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              {/* Vacation Balance Summary */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Plane className="w-4 h-4 text-blue-600" />
                  <h4 className="text-sm text-blue-900">Your Vacation Balance</h4>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center">
                    <p className="text-xs text-blue-700 mb-1">Current Year</p>
                    <p className="text-2xl text-blue-900">25</p>
                    <p className="text-xs text-blue-600 mt-0.5">days</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-blue-700 mb-1">Rollover</p>
                    <p className="text-2xl text-blue-900">3</p>
                    <p className="text-xs text-blue-600 mt-0.5">days</p>
                  </div>
                  <div className="text-center bg-blue-100 rounded-lg py-1">
                    <p className="text-xs text-blue-700 mb-1">Total Available</p>
                    <p className="text-2xl text-blue-900">28</p>
                    <p className="text-xs text-blue-600 mt-0.5">days</p>
                  </div>
                </div>
              </div>

              {dateError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex gap-2">
                  <AlertCircleIcon className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <p className="text-sm text-red-700">{dateError}</p>
                </div>
              )}

              <div>
                <label className="block text-sm text-neutral-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  min="2026-01-01"
                  value={vacationStartDate}
                  onChange={(e) => {
                    setVacationStartDate(e.target.value);
                    setDateError('');
                  }}
                  className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm text-neutral-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  min={vacationStartDate || '2026-01-01'}
                  value={vacationEndDate}
                  onChange={(e) => {
                    setVacationEndDate(e.target.value);
                    setDateError('');
                  }}
                  className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm text-neutral-700 mb-2">
                  Vacation Type
                </label>
                <select className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option>Annual Leave</option>
                  <option>Personal Leave</option>
                  <option>Unpaid Leave</option>
                </select>
                <p className="text-xs text-neutral-500 mt-2">
                  Note: For sick leave, please contact HR directly
                </p>
              </div>

              <div>
                <label className="block text-sm text-neutral-700 mb-2">
                  Reason (Optional)
                </label>
                <textarea
                  id="vacation-reason"
                  placeholder="Provide a brief reason for your vacation request..."
                  rows={3}
                  className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowVacationModal(false);
                    setVacationStartDate('');
                    setVacationEndDate('');
                    setDateError('');
                  }}
                  className="flex-1 px-4 py-3 border border-neutral-200 rounded-lg text-neutral-700 hover:bg-neutral-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (!vacationStartDate || !vacationEndDate) {
                      setDateError('Please select both start and end dates');
                      return;
                    }

                    const startYear = new Date(vacationStartDate).getFullYear();
                    const endYear = new Date(vacationEndDate).getFullYear();
                    const currentYear = 2026;

                    if (startYear < currentYear || endYear < currentYear) {
                      setDateError('Vacation dates cannot be in previous years');
                      return;
                    }

                    if (new Date(vacationEndDate) < new Date(vacationStartDate)) {
                      setDateError('End date must be after start date');
                      return;
                    }

                    const start = new Date(vacationStartDate);
                    const end = new Date(vacationEndDate);
                    const diffTime = Math.abs(end.getTime() - start.getTime());
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

                    const vacationType = (document.querySelector('select') as HTMLSelectElement)?.value || 'Annual Leave';
                    const reason = (document.getElementById('vacation-reason') as HTMLTextAreaElement)?.value;

                    const newVacation: VacationRequest = {
                      id: `VR-${Date.now()}`,
                      employeeName: 'Sophie Harman',
                      employeeId: 'EMP-2847',
                      startDate: vacationStartDate,
                      endDate: vacationEndDate,
                      vacationType,
                      totalDays: diffDays,
                      submittedDate: 'Apr 13, 2026',
                      status: 'pending',
                      reason: reason || undefined,
                    };

                    onSubmitVacation(newVacation);
                    setShowVacationModal(false);
                    setVacationStartDate('');
                    setVacationEndDate('');
                    setDateError('');
                    alert('Vacation request submitted successfully!');
                  }}
                  className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  Submit Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}