@echo off
REM Database initialization script for STC System (Windows)

set DB_PATH=Database\STC_Attendance_System.db

REM Remove existing database if it exists
if exist "%DB_PATH%" (
    echo Removing existing database...
    del /F /Q "%DB_PATH%"
)

REM Create new database with schema
echo Creating database...
sqlite3 "%DB_PATH%" < Database\schema.sql

REM Insert sample data
echo Inserting sample data...
sqlite3 "%DB_PATH%" << 'EOF'
-- Insert sample users
INSERT INTO User (UserID, Name, Email, Role) VALUES 
(10, 'Sophie Harman', 'sophie@stc.com', 'EMPLOYEE'),
(20, 'Harald Supervisor', 'harald@stc.com', 'SUPERVISOR'),
(30, 'Marcus HR', 'marcus@stc.com', 'HR_SPECIALIST'),
(99, 'Admin User', 'test@stc.com', 'ADMIN'),
(11, 'Sarah Chen', 'sarah@stc.com', 'EMPLOYEE'),
(12, 'David Park', 'david@stc.com', 'EMPLOYEE'),
(21, 'Emma Johnson', 'emma@stc.com', 'EMPLOYEE');

-- Insert employees
INSERT INTO Employee (UserID, flexTimeBalance, vacationDays) VALUES 
(10, 12.5, 25),
(11, 5.5, 18),
(12, -2.0, 20),
(21, 8.0, 22);

-- Insert supervisor
INSERT INTO Supervisor (UserID, Department) VALUES 
(20, 1);

-- Insert HR Specialist
INSERT INTO HR_Specialist (UserID) VALUES 
(30);

-- Insert sample timesheets for multiple employees
INSERT INTO TimeSheet (employeeID, supervisorID, month, year, totalHours, status) VALUES
(10, 20, 4, 2026, 165.0, 'APPROVED'),
(11, 20, 4, 2026, 160.0, 'LOCKED'),
(12, 20, 4, 2026, 152.0, 'PENDING'),
(21, 20, 4, 2026, 168.0, 'DRAFT');

-- Insert sample work entries
INSERT INTO WorkEntry (sheetID, Date, startTime, endTime, breakDuration) VALUES
(1, '2026-04-01', '08:00', '17:00', 30),
(1, '2026-04-02', '08:00', '18:00', 30),
(1, '2026-04-03', '08:00', '17:00', 30),
(1, '2026-04-04', '08:00', '17:00', 30),
(1, '2026-04-05', '08:00', '17:00', 30),
(2, '2026-04-01', '09:00', '17:30', 30),
(2, '2026-04-02', '08:30', '17:00', 30),
(2, '2026-04-03', '08:00', '17:00', 30),
(2, '2026-04-04', '08:00', '17:00', 30),
(2, '2026-04-05', '08:00', '17:00', 30);

-- Insert sample leave requests with various statuses
INSERT INTO LeaveRequest (employeeID, supervisorID, startDate, endDate, type, status) VALUES
(10, 20, '2026-05-01', '2026-05-05', 'VACATION', 'PENDING'),
(11, 20, '2026-05-10', '2026-05-12', 'SICKNESS', 'APPROVED'),
(12, 20, '2026-04-20', '2026-04-22', 'VACATION', 'PENDING'),
(21, 20, '2026-05-15', '2026-05-16', 'SICKNESS', 'PENDING');
EOF

echo Database initialized successfully!
echo Database location: %DB_PATH%
pause
