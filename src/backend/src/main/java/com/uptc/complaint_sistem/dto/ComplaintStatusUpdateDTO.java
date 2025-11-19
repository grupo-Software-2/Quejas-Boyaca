// ComplaintStatusUpdateDTO.java
package com.uptc.complaint_sistem.dto;

import com.uptc.complaint_sistem.model.ComplaintStatus;

import jakarta.validation.constraints.NotNull;

public class ComplaintStatusUpdateDTO {
    @NotNull(message = "El estado es obligatorio")
    private ComplaintStatus status; 

    public ComplaintStatus getStatus() { return status; }
    public void setStatus(ComplaintStatus status) { this.status = status; }
}