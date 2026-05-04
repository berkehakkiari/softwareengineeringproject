package com.stc.model;

public class HrSpecialist extends User {

    public HrSpecialist() {}

    public HrSpecialist(int userID, String name, String email, String role) {
        super(userID, name, email, role);
    }

    @Override
    public String toString() {
        return "HrSpecialist{userID=" + getUserID() + ", name=" + getName() + "}";
    }
}