package com.stc.model;

public class WorkEntry {
    private int entryID;
    private int sheetID;
    private String date;
    private String startTime;
    private String endTime;
    private int breakDuration;

    public WorkEntry() {}

    public WorkEntry(int entryID, int sheetID, String date, String startTime, String endTime, int breakDuration) {
        this.entryID = entryID;
        this.sheetID = sheetID;
        this.date = date;
        this.startTime = startTime;
        this.endTime = endTime;
        this.breakDuration = breakDuration;
    }

    public int getEntryID() { return entryID; }
    public void setEntryID(int entryID) { this.entryID = entryID; }

    public int getSheetID() { return sheetID; }
    public void setSheetID(int sheetID) { this.sheetID = sheetID; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getStartTime() { return startTime; }
    public void setStartTime(String startTime) { this.startTime = startTime; }

    public String getEndTime() { return endTime; }
    public void setEndTime(String endTime) { this.endTime = endTime; }

    public int getBreakDuration() { return breakDuration; }
    public void setBreakDuration(int breakDuration) { this.breakDuration = breakDuration; }

    @Override
    public String toString() {
        return "WorkEntry{entryID=" + entryID + ", sheetID=" + sheetID + ", date=" + date + ", startTime=" + startTime + ", endTime=" + endTime + ", breakDuration=" + breakDuration + "}";
    }
}