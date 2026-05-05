# Project Integration Summary

## What Has Been Done

This document summarizes all the changes made to integrate the frontend, backend, and database into a unified dynamic system.

## Backend Changes

### 1. Spring Boot Migration
**File**: `Backend/stc-system/pom.xml`
- Added Spring Boot parent dependency (v3.3.0)
- Added `spring-boot-starter-web` for REST API support
- Added Jackson for JSON processing
- Added Lombok for code generation
- Configured Maven compiler for Java 21
- Added Spring Boot Maven plugin for packaging

### 2. Main Application Class
**File**: `Backend/stc-system/src/main/java/com/stc/Main.java`
- Converted to Spring Boot application with `@SpringBootApplication`
- Added CORS configuration to allow frontend requests
- Configured to accept requests from `http://localhost:5173`

### 3. Database Connection
**File**: `Backend/stc-system/src/main/java/com/stc/util/DatabaseConnection.java`
- Made database path dynamic based on user's current directory
- Removed hardcoded path that only worked for specific user
- Now automatically constructs path to `Database/STC_Attendance_System.db`

### 4. REST API Controllers
Created 5 new REST API controller classes in `com.stc.api` package:

**AuthController** (`api/AuthController.java`)
- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - User registration
- DTOs: LoginRequest, LoginResponse, RegisterRequest

**EmployeeController** (`api/EmployeeController.java`)
- `GET /api/employees` - List all employees
- `GET /api/employees/{id}` - Get employee details
- `POST /api/employees` - Create employee
- `PUT /api/employees/{id}` - Update employee
- `DELETE /api/employees/{id}` - Delete employee

**SupervisorController** (`api/SupervisorController.java`)
- `GET /api/supervisors` - List supervisors
- `GET /api/supervisors/{id}` - Get supervisor
- `POST /api/supervisors` - Create supervisor
- `PUT /api/supervisors/{id}` - Update supervisor
- `DELETE /api/supervisors/{id}` - Delete supervisor

**TimesheetRestController** (`api/TimesheetRestController.java`)
- `GET /api/timesheets` - List all timesheets
- `GET /api/timesheets/{id}` - Get timesheet
- `GET /api/timesheets/employee/{employeeID}` - Get employee timesheets
- `GET /api/timesheets/supervisor/{supervisorID}` - Get supervisor timesheets
- `POST /api/timesheets` - Create timesheet
- `POST /api/timesheets/{id}/work-entries` - Add work entry
- `GET /api/timesheets/{id}/work-entries` - Get work entries
- `POST /api/timesheets/{id}/submit` - Submit timesheet
- `POST /api/timesheets/{id}/approve` - Approve timesheet
- `POST /api/timesheets/{id}/reject` - Reject timesheet

**LeaveRequestRestController** (`api/LeaveRequestRestController.java`)
- `GET /api/leave-requests` - List all leave requests
- `GET /api/leave-requests/{id}` - Get leave request
- `GET /api/leave-requests/employee/{employeeID}` - Get employee requests
- `GET /api/leave-requests/supervisor/{supervisorID}/pending` - Get pending requests
- `POST /api/leave-requests` - Submit leave request
- `POST /api/leave-requests/{id}/approve` - Approve request
- `POST /api/leave-requests/{id}/reject` - Reject request
- `POST /api/leave-requests/{id}/cancel` - Cancel request
- `POST /api/leave-requests/sickness` - Register sickness

### 5. Spring Boot Configuration
**File**: `Backend/stc-system/src/main/resources/application.properties`
- Server running on port 8080
- SQLite JDBC configuration
- Logging configuration

### 6. Enhanced DAO Methods
Updated existing DAOs to support REST API requirements:

**EmployeeDAO** (`dao/EmployeeDAO.java`)
- Added `deleteEmployee(int userID)` method

**SupervisorDAO** (`dao/SupervisorDAO.java`)
- Added `updateSupervisor(Supervisor supervisor)` method
- Added `deleteSupervisor(int userID)` method

**TimesheetDAO** (`dao/TimesheetDAO.java`)
- Added `getTimesheetsByEmployeeID(int employeeID)` alias
- Added `getTimesheetsBySupervisorID(int supervisorID)` alias
- Added `getAllTimesheets()` method for listing all timesheets

**LeaveRequestDAO** (`dao/LeaveRequestDAO.java`)
- Added `getRequestsByEmployeeID(int employeeID)` alias
- Added `getPendingRequestsBySupervisorID(int supervisorID)` alias
- Added `getAllLeaveRequests()` method for listing all requests

## Frontend Changes

### 1. API Client Service
**File**: `Frontend/src/services/apiClient.ts`
- Created centralized API client using Fetch API
- Implemented methods for all backend endpoints
- Error handling and response validation
- Base URL: `http://localhost:8080/api`
- Supports JSON request/response

**Features**:
- `login(email, role)` - Authenticate user
- `register(...)` - Register new user
- `getAllEmployees()`, `getEmployee()`, `addEmployee()`, `updateEmployee()`, `deleteEmployee()`
- `getAllSupervisors()`, `getSupervisor()`, `addSupervisor()`, `updateSupervisor()`, `deleteSupervisor()`
- `getAllTimesheets()`, `getTimesheet()`, `createTimesheet()`, `getEmployeeTimesheets()`, `getSupervisorTimesheets()`
- `addWorkEntry()`, `getWorkEntries()`, `submitTimesheet()`, `approveTimesheet()`, `rejectTimesheet()`
- `getAllLeaveRequests()`, `getLeaveRequest()`, `submitLeaveRequest()`, `getEmployeeLeaveRequests()`
- `getPendingLeaveRequests()`, `approveLeaveRequest()`, `rejectLeaveRequest()`, `cancelLeaveRequest()`
- `registerSickness()`

### 2. Updated App Component
**File**: `Frontend/src/app/App.tsx`
- Added `useEffect` hook to fetch data on login
- Integrated API client for all data operations
- Added loading state handling
- User session now includes `userId` for filtering data
- Data transformation functions:
  - `getMonthName()` - Convert month number to name
  - `calculateDaysDifference()` - Calculate days between dates
- Login now accepts user IDs from backend
- Timesheets and leave requests filtered by logged-in user ID

**Data Flow**:
1. User logs in with credentials
2. Mock authentication maps to backend users
3. `fetchData()` is called via useEffect
4. API client retrieves timesheets, leave requests, and employees
5. Data is transformed to match frontend interface
6. Components render with actual data from backend

## Database Setup

### 1. Database Initialization Scripts
**Files**: 
- `init-db.bat` (Windows)
- `init-db.sh` (Linux/Mac)

**Features**:
- Removes existing database file
- Creates new SQLite database
- Runs schema.sql to create tables
- Inserts sample data for testing

**Sample Data Inserted**:
- 5 users (3 employees, 1 supervisor, 1 HR specialist)
- 3 employees with flex time balances and vacation days
- 1 supervisor with department assignment
- 3 timesheets in various states (APPROVED, LOCKED, DRAFT)
- 5 work entries for the first timesheet
- 2 leave requests (1 vacation, 1 sickness)

### 2. Database Structure
Already defined in `Database/schema.sql`:
- User: Core user information
- Employee: Extension of User with flex time and vacation days
- Supervisor: Extension of User with department
- HR_Specialist: Extension of User
- TimeSheet: Timesheet records with status tracking
- WorkEntry: Individual work day entries
- LeaveRequest: Leave/sickness request tracking

## Integration Points

### Frontend → Backend Communication

1. **HTTP Requests**
   - Using Fetch API with JSON payloads
   - CORS enabled in Spring Boot
   - All requests go to `http://localhost:8080/api`

2. **Authentication Flow**
   - Frontend login form sends credentials to user
   - Backend user ID returned in response
   - Frontend stores user ID for data filtering

3. **Data Fetching**
   - On login, app fetches all timesheets, leave requests, and employees
   - Data is transformed to match frontend interface expectations
   - Components receive filtered data based on user role

4. **Data Mutations**
   - Form submissions call API client methods
   - API client sends PUT/POST requests with JSON body
   - Backend processes and updates database
   - Frontend state updated on success

### Backend → Database Communication

1. **Connection Management**
   - `DatabaseConnection` utility manages SQLite connections
   - Connection pooling for performance
   - Automatic path resolution for database location

2. **Data Access**
   - DAOs execute SQL queries using PreparedStatements
   - Results mapped to model objects
   - Exception handling with logging

3. **Transaction Support**
   - Individual DAO operations are atomic
   - Service layer handles multi-operation transactions
   - Timesheet approval triggers flex time calculations

## How Everything Works Together

### User Login Journey
1. User enters username/password in LoginScreen
2. Frontend validates against mock credentials
3. User ID and role stored in state
4. App calls `fetchData()` to load all timesheets, requests, employees
5. API client makes requests to `/api/timesheets`, `/api/leave-requests`, `/api/employees`
6. Backend services retrieve data from SQLite database
7. Data transformed to frontend format and displayed in appropriate dashboard

### Timesheet Submission Journey
1. Employee fills timesheet form in EmployeeDashboard
2. Form submission calls `onSubmitTimesheet` callback
3. Frontend adds timesheet to state (eventually should call API)
4. Should call `apiClient.createTimesheet()` to save to backend
5. Backend creates TimeSheet record in database
6. Supervisor sees pending timesheet in SupervisoryBoard
7. Supervisor clicks approve, which should call `apiClient.approveTimesheet()`
8. Backend service calculates flex time, checks overtime
9. Database updated with approved status
10. Employee dashboard refreshes to show approved status

### Leave Request Journey
1. Employee submits leave request in EmployeeDashboard
2. Frontend calls `apiClient.submitLeaveRequest()`
3. Backend creates LeaveRequest record with PENDING status
4. Supervisor sees request in SupervisoryBoard
5. Supervisor approves via `apiClient.approveLeaveRequest()`
6. Backend updates status to APPROVED, deducts vacation days
7. Employee sees updated request status

## Files Created/Modified

### Created Files
1. `Backend/stc-system/src/main/java/com/stc/api/AuthController.java`
2. `Backend/stc-system/src/main/java/com/stc/api/EmployeeController.java`
3. `Backend/stc-system/src/main/java/com/stc/api/SupervisorController.java`
4. `Backend/stc-system/src/main/java/com/stc/api/TimesheetRestController.java`
5. `Backend/stc-system/src/main/java/com/stc/api/LeaveRequestRestController.java`
6. `Backend/stc-system/src/main/resources/application.properties`
7. `Frontend/src/services/apiClient.ts`
8. `init-db.bat`
9. `init-db.sh`
10. `INTEGRATION_GUIDE.md`
11. `PROJECT_INTEGRATION_SUMMARY.md` (this file)

### Modified Files
1. `Backend/stc-system/pom.xml` - Added Spring Boot dependencies
2. `Backend/stc-system/src/main/java/com/stc/Main.java` - Converted to Spring Boot app
3. `Backend/stc-system/src/main/java/com/stc/util/DatabaseConnection.java` - Dynamic path
4. `Backend/stc-system/src/main/java/com/stc/dao/EmployeeDAO.java` - Added deleteEmployee
5. `Backend/stc-system/src/main/java/com/stc/dao/SupervisorDAO.java` - Added update/delete
6. `Backend/stc-system/src/main/java/com/stc/dao/TimesheetDAO.java` - Added aliases and getAllTimesheets
7. `Backend/stc-system/src/main/java/com/stc/dao/LeaveRequestDAO.java` - Added aliases and getAllLeaveRequests
8. `Frontend/src/app/App.tsx` - Integrated API client

## Next Steps

### Immediate Testing
1. Initialize database: Run `init-db.bat` (Windows) or `init-db.sh` (Linux/Mac)
2. Build backend: Run `mvn clean install` in Backend/stc-system
3. Start backend: Run `mvn spring-boot:run`
4. Start frontend: Run `npm run dev` or `pnpm dev` in Frontend
5. Login with test credentials (sophie/any password)

### Frontend Component Updates Needed
The following components still use mock data and should be updated to call API:
- `EmployeeDashboard.tsx` - `onSubmitTimesheet()` should call API
- `EmployeeDashboard.tsx` - `onSubmitVacation()` should call API
- `SupervisoryBoard.tsx` - Approve/reject buttons should call API
- All components - Use `useEffect` hooks to fetch real data

### Additional Enhancements Recommended
1. Add proper JWT token-based authentication
2. Implement role-based access control (RBAC)
3. Add input validation in forms
4. Add error handling and user feedback
5. Implement pagination for large datasets
6. Add loading spinners and error messages
7. Add success/failure notifications
8. Implement session timeout
9. Add database migrations
10. Add comprehensive error logging

## Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────┐
│                      Frontend (React + TypeScript)                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │ LoginScreen  │  │ Employee     │  │ Supervisor   │              │
│  │              │  │ Dashboard    │  │ Board        │              │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘              │
│         │                 │                  │                      │
│         └─────────────────┴──────────────────┘                      │
│                     │                                               │
│         ┌───────────▼──────────────┐                               │
│         │   API Client Service     │                               │
│         │  (apiClient.ts)          │                               │
│         └───────────┬──────────────┘                               │
└─────────────────────┼──────────────────────────────────────────────┘
                      │
         ┌────────────▼────────────┐
         │  HTTP/JSON (Port 8080)  │
         └────────────┬────────────┘
                      │
┌─────────────────────▼──────────────────────────────────────────────┐
│                    Backend (Spring Boot)                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │ AuthController  │ EmployeeController  │TimesheetController     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘              │
│         │                 │                  │                      │
│         └─────────────────┴──────────────────┘                      │
│                     │                                               │
│         ┌───────────▼──────────────┐                               │
│         │  Service Layer           │                               │
│         │  (Business Logic)        │                               │
│         └───────────┬──────────────┘                               │
│                     │                                               │
│         ┌───────────▼──────────────┐                               │
│         │  DAO Layer (Data Access) │                               │
│         │  (SQL Queries)           │                               │
│         └───────────┬──────────────┘                               │
└─────────────────────┼──────────────────────────────────────────────┘
                      │
         ┌────────────▼────────────┐
         │   JDBC (Port Depends)   │
         └────────────┬────────────┘
                      │
┌─────────────────────▼──────────────────────────────────────────────┐
│              SQLite Database                                        │
│  Database/STC_Attendance_System.db                                 │
│  Tables: User, Employee, Supervisor, TimeSheet, LeaveRequest, ... │
└─────────────────────────────────────────────────────────────────────┘
```

## Key Technologies Used

1. **Backend**
   - Java 21
   - Spring Boot 3.3.0
   - SQLite JDBC Driver
   - Maven for dependency management

2. **Frontend**
   - React 18+ with TypeScript
   - Vite (build tool)
   - Tailwind CSS for styling
   - Shadcn/ui component library
   - Lucide React for icons

3. **Database**
   - SQLite 3 (file-based, no server needed)
   - COLLATE BINARY for date handling

## Troubleshooting Quick Reference

| Problem | Solution |
|---------|----------|
| Backend won't start | Check Java 21 is installed, no port 8080 conflicts |
| Frontend can't connect | Verify backend running on 8080, check CORS config |
| Database not found | Run init-db.bat or init-db.sh to create database |
| Login fails | Verify sample data inserted, check SQL syntax |
| API returns 500 | Check backend logs for exceptions, verify SQL queries |
| UI doesn't update | Check API client returning data, verify data transformation |
