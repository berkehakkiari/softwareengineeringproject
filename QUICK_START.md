# Quick Start Guide - STC Time Management System

## 5-Minute Setup

Follow these steps to get the entire application running:

### Step 1: Initialize the Database (1 minute)

Navigate to the project root and run:

**Windows:**
```cmd
init-db.bat
```

**Mac/Linux:**
```bash
bash init-db.sh
```

This creates the SQLite database at `Database/STC_Attendance_System.db` with sample data.

### Step 2: Start the Backend (2 minutes)

Open a terminal and run:

```bash
cd Backend/stc-system
mvn clean install
mvn spring-boot:run
```

Wait for the message: `Started Main in X seconds`

✅ Backend is now running at `http://localhost:8080`

### Step 3: Start the Frontend (2 minutes)

Open a NEW terminal and run:

```bash
cd Frontend
npm install
npm run dev
```

Or if you use pnpm:
```bash
pnpm install
pnpm dev
```

✅ Frontend is now running at `http://localhost:5173`

### Step 4: Login and Test

Open `http://localhost:5173` in your browser and login with:

| Username | Password | Role |
|----------|----------|------|
| sophie | (any) | Employee |
| harald | (any) | Supervisor |
| marcus | (any) | HR Specialist |

## What You Should See

### Employee Dashboard (sophie login)
- Flex Time Balance: 0.0 hours
- Vacation Days: 20
- Timesheets submitted in April 2026
- Vacation request pending approval

### Supervisory Board (harald login)
- List of all pending timesheets
- Option to approve/reject
- List of pending leave requests
- Employee management interface

### HR Specialist Dashboard (marcus login)
- Sick leave records
- Timesheet overview
- Employee list

## Basic Workflow Test

### Test Creating a Timesheet

1. **As Employee (sophie)**:
   - Go to Employee Dashboard
   - Look for "Submit Timesheet" button
   - Select a month and enter hours
   - Submit

2. **As Supervisor (harald)**:
   - Go to Supervisory Board
   - See the pending timesheet
   - Click Approve (will show success message)

3. **Verify**:
   - Employee dashboard shows approved status
   - Timesheet marked as approved

### Test Leave Request

1. **As Employee**:
   - Fill out vacation request form
   - Submit

2. **As Supervisor**:
   - See pending leave request
   - Approve or deny

## Verify Integration is Working

Check that everything is connected by verifying these signs:

✅ **Backend Running**
- Terminal shows "Started Main..."
- No connection errors

✅ **Frontend Running**
- Browser loads at `http://localhost:5173`
- No CORS errors in console

✅ **Database Connected**
- Login works with sample credentials
- Dashboard shows employee data
- No "Unable to connect to database" errors

✅ **API Communication**
- Submit actions don't immediately update without page refresh
- No 404 or 500 errors in browser console
- Network tab shows requests to `http://localhost:8080/api/*`

## If Something Goes Wrong

### Backend won't start
```
Problem: "Port 8080 already in use"
Solution: Kill the process using port 8080 or change port in application.properties
```

```
Problem: "No database found"
Solution: Run init-db.bat first to create database
```

### Frontend shows "Loading data..." forever
```
Problem: Can't connect to backend
Solution: 
1. Verify backend is running: mvn spring-boot:run
2. Check backend on http://localhost:8080/api/timesheets
3. Check browser console for CORS errors
4. Restart both frontend and backend
```

### Login doesn't work
```
Problem: Can't find user in database
Solution:
1. Run init-db.bat to reset database with sample data
2. Restart backend: Ctrl+C then mvn spring-boot:run
3. Try logging in again
```

### Database errors
```
Problem: SQLException when submitting form
Solution:
1. Delete Database/STC_Attendance_System.db
2. Run init-db.bat
3. Restart backend
```

## Next: Backend Development

Now that you have the system running, you can:

1. **Add new API endpoints** in `Backend/stc-system/src/main/java/com/stc/api/`
2. **Modify business logic** in `Backend/stc-system/src/main/java/com/stc/service/`
3. **Enhance database** in `Backend/stc-system/src/main/java/com/stc/dao/`
4. **Update frontend** components in `Frontend/src/app/components/`

For detailed documentation, see:
- `PROJECT_INTEGRATION_SUMMARY.md` - Complete integration details
- `INTEGRATION_GUIDE.md` - API documentation and troubleshooting

## Common Commands Reference

```bash
# Terminal 1: Backend
cd Backend/stc-system
mvn clean install                  # Build project
mvn spring-boot:run                # Start Spring Boot server
mvn clean                          # Clean build files

# Terminal 2: Frontend
cd Frontend
npm install                        # Install dependencies
npm run dev                        # Start development server
npm run build                      # Build for production

# Database
init-db.bat                        # Windows: Create/reset database
bash init-db.sh                    # Mac/Linux: Create/reset database
```

## Testing the API Directly

You can test the backend API without the frontend using curl:

```bash
# Get all timesheets
curl http://localhost:8080/api/timesheets

# Get all employees
curl http://localhost:8080/api/employees

# Get all leave requests
curl http://localhost:8080/api/leave-requests

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"sophie@stc.com","role":"EMPLOYEE"}'
```

## Architecture in Simple Terms

```
You in Browser → Frontend (React) → Backend (Java) → Database (SQLite)
                                ↕
                            API (HTTP/JSON)
```

1. **Frontend** displays forms and data to user
2. **Backend** processes business logic and database operations  
3. **Database** stores all persistent data
4. **API** is the communication layer between frontend and backend

When you submit a form in the frontend:
1. Form data is sent to backend via HTTP POST
2. Backend validates and processes the data
3. Backend stores data in database
4. Backend sends response back
5. Frontend updates to show new data

## Success!

If you can:
1. ✅ Open http://localhost:5173
2. ✅ Login with sophie/any-password
3. ✅ See employee data loaded from database
4. ✅ See pending timesheets and vacation requests

Then the integration is complete and working! 🎉

Now you can start customizing the application for your needs.
