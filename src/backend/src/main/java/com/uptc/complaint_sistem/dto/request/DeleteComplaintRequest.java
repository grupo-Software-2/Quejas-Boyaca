package com.uptc.complaint_sistem.dto.request;

import jakarta.validation.constraints.NotBlank;

public class DeleteComplaintRequest {

    @NotBlank(message = "La contrasena es obligatoria")
    private String password;

    public DeleteComplaintRequest() {
    }

    public DeleteComplaintRequest(String password) {
        this.password = password;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
