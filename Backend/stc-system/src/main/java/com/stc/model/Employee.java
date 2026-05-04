package com.stc.model;

public class Employee extends User {
    private double flexTimeBalance;
    private int vacationDays;

    public Employee() {}

    public Employee(int userID, String name, String email, String role, double flexTimeBalance, int vacationDays) {
        super(userID, name, email, role);
        this.flexTimeBalance = flexTimeBalance;
        this.vacationDays = vacationDays;
    }

    public double getFlexTimeBalance() { return flexTimeBalance; }
    public void setFlexTimeBalance(double flexTimeBalance) { this.flexTimeBalance = flexTimeBalance; }

    public int getVacationDays() { return vacationDays; }
    public void setVacationDays(int vacationDays) { this.vacationDays = vacationDays; }

    @Override
    public String toString() {
        return "Employee{userID=" + getUserID() + ", name=" + getName() + ", flexTime=" + flexTimeBalance + ", vacationDays=" + vacationDays + "}";
    }
}