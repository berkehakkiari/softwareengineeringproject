package com.stc.model;

public class Supervisor extends User {
    private int department;

    public Supervisor() {}

    public Supervisor(int userID, String name, String email, String role, int department) {
        super(userID, name, email, role);
        this.department = department;
    }

    public int getDepartment() { return department; }
    public void setDepartment(int department) { this.department = department; }

    @Override
    public String toString() {
        return "Supervisor{userID=" + getUserID() + ", name=" + getName() + ", department=" + department + "}";
    }
}