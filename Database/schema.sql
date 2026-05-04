CREATE TABLE "Employee" (
	"UserID"	INTEGER,
	"flexTimeBalance"	REAL,
	"vacationDays"	INTEGER,
	PRIMARY KEY("UserID"),
	FOREIGN KEY("UserID") REFERENCES "User"("UserID")
)

CREATE TABLE "HR_Specialist" (
	"UserID"	INTEGER,
	PRIMARY KEY("UserID"),
	FOREIGN KEY("UserID") REFERENCES "User"("UserID")
)

CREATE TABLE "LeaveRequest" (
	"leaveID"	INTEGER,
	"employeeID"	INTEGER,
	"supervisorID"	INTEGER,
	"startDate"	TEXT COLLATE BINARY,
	"endDate"	TEXT COLLATE BINARY,
	"type"	TEXT,
	"status"	TEXT,
	PRIMARY KEY("leaveID"),
	FOREIGN KEY("employeeID") REFERENCES "Employee"("UserID"),
	FOREIGN KEY("supervisorID") REFERENCES "Supervisor"("UserID")
)

CREATE TABLE "Supervisor" (
	"UserID"	INTEGER,
	"Department"	INTEGER,
	PRIMARY KEY("UserID"),
	FOREIGN KEY("UserID") REFERENCES "User"("UserID")
)

CREATE TABLE "TimeSheet" (
	"sheetID"	INTEGER,
	"employeeID"	INTEGER,
	"supervisorID"	INTEGER,
	"month"	INTEGER,
	"year"	INTEGER,
	"totalHours"	REAL,
	"status"	TEXT,
	PRIMARY KEY("sheetID"),
	FOREIGN KEY("employeeID") REFERENCES "Employee"("UserID"),
	FOREIGN KEY("supervisorID") REFERENCES "Supervisor"("UserID")
)

CREATE TABLE "User" (
	"UserID"	INTEGER,
	"Name"	TEXT,
	"Email"	TEXT,
	"Role"	TEXT,
	PRIMARY KEY("UserID")
)

CREATE TABLE "WorkEntry" (
	"entryID"	INTEGER,
	"sheetID"	INTEGER,
	"Date"	TEXT COLLATE BINARY,
	"startTime"	TEXT COLLATE BINARY,
	"endTime"	TEXT COLLATE BINARY,
	"breakDuration"	INTEGER COLLATE BINARY,
	PRIMARY KEY("entryID"),
	FOREIGN KEY("sheetID") REFERENCES "TimeSheet"("sheetID")
)    