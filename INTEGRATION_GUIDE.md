# STC Time Management System - Integration Guide

## Project Structure

This project is a full-stack web application for managing employee timesheets and leave requests:

- **Backend**: Java Spring Boot REST API (Port 8080)
- **Frontend**: React + TypeScript with Vite (Port 5173)
- **Database**: SQLite (portable, no setup required)

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    React Frontend (Vite)                     │
│  - Login Screen                                              │
│  - Employee Dashboard                                        │
│  - Supervisor Board                                          │
│  - HR Specialist Dashboard                                   │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP/JSON (Port 8080)
                       ↓
┌─────────────────────────────────────────────────────────────┐
│                Spring Boot REST API                          │
│  - AuthController: /api/auth (login, register)              │
│  - EmployeeController: /api/employees (CRUD)                │
│  - SupervisorController: /api/supervisors (CRUD)            │
│  - TimesheetRestController: /api/timesheets (operations)    │
│  - LeaveRequestRestController: /api/leave-requests (ops)   │
└──────────────────────┬──────────────────────────────────────┘
                       │ JDBC
                       ↓
┌─────────────────────────────────────────────────────────────┐
│                   SQLite Database                            │
│  - Database/STC_Attendance_System.db                        │
│  Tables: User, Employee, Supervisor, HR_Specialist,         │
│  TimeSheet, WorkEntry, LeaveRequest                         │
└─────────────────────────────────────────────────────────────┘
```

## Setup Instructions

### 1. Initialize Database

**Windows:**
```bash
cd c:\Users\z3105\Desktop\software engineering\softwareengineeringproject
init-db.bat
```

**Linux/Mac:**
```bash
cd ~/path/to/softwareengineeringproject
bash init-db.sh
```

This creates the SQLite database with sample data at `Database/STC_Attendance_System.db`

### 2. Build & Run Backend

```bash
cd Backend/stc-system

# Build the project with Maven
mvn clean install

# Run the Spring Boot application
mvn spring-boot:run
```

The backend will start at `http://localhost:8080`

### 3. Run Frontend (in new terminal)

```bash
cd Frontend

# Install dependencies
npm install
# or
pnpm install

# Start development server
npm run dev
# or
pnpm dev
```

The frontend will start at `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/register` - Register new user

### Employees
- `GET /api/employees` - Get all employees
- `GET /api/employees/{id}` - Get employee by ID
- `POST /api/employees` - Create employee
- `PUT /api/employees/{id}` - Update employee
- `DELETE /api/employees/{id}` - Delete employee

### Supervisors
- `GET /api/supervisors` - Get all supervisors
- `GET /api/supervisors/{id}` - Get supervisor by ID
- `POST /api/supervisors` - Create supervisor
- `PUT /api/supervisors/{id}` - Update supervisor
- `DELETE /api/supervisors/{id}` - Delete supervisor

### Timesheets
- `GET /api/timesheets` - Get all timesheets
- `GET /api/timesheets/{id}` - Get timesheet by ID
- `GET /api/timesheets/employee/{employeeID}` - Get employee's timesheets
- `GET /api/timesheets/supervisor/{supervisorID}` - Get supervisor's timesheets
- `POST /api/timesheets` - Create timesheet
- `POST /api/timesheets/{id}/work-entries` - Add work entry
- `GET /api/timesheets/{id}/work-entries` - Get work entries
- `POST /api/timesheets/{id}/submit` - Submit timesheet
- `POST /api/timesheets/{id}/approve` - Approve timesheet
- `POST /api/timesheets/{id}/reject` - Reject timesheet

### Leave Requests
- `GET /api/leave-requests` - Get all leave requests
- `GET /api/leave-requests/{id}` - Get leave request by ID
- `GET /api/leave-requests/employee/{employeeID}` - Get employee's requests
- `GET /api/leave-requests/supervisor/{supervisorID}/pending` - Get pending requests
- `POST /api/leave-requests` - Submit leave request
- `POST /api/leave-requests/{id}/approve` - Approve request
- `POST /api/leave-requests/{id}/reject` - Reject request
- `POST /api/leave-requests/{id}/cancel` - Cancel request
- `POST /api/leave-requests/sickness` - Register sickness

## Test Login Credentials

The system comes with sample data:

| Username | Email | Role | User ID |
|----------|-------|------|---------|
| sophie | sophie@stc.com | EMPLOYEE | 10 |
| harald | harald@stc.com | SUPERVISOR | 20 |
| marcus | marcus@stc.com | HR_SPECIALIST | 30 |

(Password field is not required in current implementation, just enter any password)

## Key Integration Points

### Frontend to Backend Communication
1. **API Client** (`Frontend/src/services/apiClient.ts`)
   - Centralized HTTP client for all API calls
   - Handles JSON serialization/deserialization
   - Error handling and response validation

2. **App State Management** (`Frontend/src/app/App.tsx`)
   - Fetches data on login using `useEffect`
   - Transforms API responses to frontend format
   - Manages user session and role-based views

3. **CORS Configuration** (Backend `Main.java`)
   - Allows requests from `http://localhost:5173`
   - Supports GET, POST, PUT, DELETE methods
   - Includes credentials support

### Backend Services & DAOs
1. **Controllers** (`Backend/.../api/*.java`)
   - REST endpoints that accept JSON
   - Delegate business logic to services
   - Return standardized API responses

2. **Services** (`Backend/.../service/*.java`)
   - Business logic (timesheet calculations, leave approvals)
   - Data validation
   - Notification logic

3. **DAOs** (`Backend/.../dao/*.java`)
   - Database access layer
   - SQL query execution
   - Data transformation to models

4. **Models** (`Backend/.../model/*.java`)
   - POJO classes representing database entities
   - Getters/setters for properties
   - toString() for debugging

## Development Workflow

### When Making Changes

**Backend changes:**
1. Modify controller/service/DAO files
2. Rebuild: `mvn clean install`
3. Restart Spring Boot application
4. Test endpoints with Postman or curl

**Frontend changes:**
1. Modify React components
2. Changes auto-reload in dev server
3. Test in browser at `http://localhost:5173`

### Database Changes

If you need to modify the schema:
1. Update `Database/schema.sql`
2. Re-run `init-db.bat` or `init-db.sh` (WARNING: this deletes existing data)
3. Restart backend to reconnect

## Troubleshooting

### "Connection refused on port 8080"
- Backend is not running. Start it with `mvn spring-boot:run`

### "CORS error in browser console"
- Backend CORS configuration not allowing frontend origin
- Check `Main.java` corsConfigurer() method
- Ensure frontend is running on `http://localhost:5173`

### "Database not found"
- Run `init-db.bat` or `init-db.sh` to create the database
- Check that `Database/STC_Attendance_System.db` exists

### API returns "Connection failed"
- SQLite database connection issue
- Verify database path in `DatabaseConnection.java`
- Ensure database file exists and is accessible

### Frontend shows "Loading data..." indefinitely
- Backend API not responding
- Check backend is running on port 8080
- Check browser console for specific API errors

## Building for Production

### Backend
```bash
cd Backend/stc-system
mvn clean package
# Creates JAR file in target/ directory
java -jar target/stc-system-1.0-SNAPSHOT.jar
```

### Frontend
```bash
cd Frontend
npm run build
# Creates optimized build in dist/ directory
# Deploy dist/ folder to web server
```

## Performance Optimization Tips

1. **Database Indexing** - Add indexes on frequently queried columns (userID, employeeID, supervisorID)
2. **Caching** - Add Spring Cache for frequently accessed employee/supervisor data
3. **Pagination** - Add pagination to list endpoints for large datasets
4. **Lazy Loading** - Load work entries on-demand in UI

## Security Considerations

1. **Authentication** - Implement proper JWT token-based auth instead of simple password check
2. **Authorization** - Add role-based access control (RBAC) checks in controllers
3. **Input Validation** - Add @Valid annotations to request bodies
4. **HTTPS** - Use HTTPS in production
5. **Database Encryption** - Encrypt sensitive data in database
6. **Rate Limiting** - Add rate limiting to API endpoints
