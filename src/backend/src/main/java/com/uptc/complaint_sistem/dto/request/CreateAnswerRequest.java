package com.uptc.complaint_sistem.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class CreateAnswerRequest {

    @NotNull(message = "El ID de la queja es obligatorio")
    private Long complaintId;

    @NotBlank(message = "El mensaje no puede estar vacio")
    @Size(max = 1000, message = "El mensaje no puede exceder los 1000 caracteres")
    private String message;

    public CreateAnswerRequest() {}

    public CreateAnswerRequest(Long complaintId, String message) {
        this.complaintId = complaintId;
        this.message = message;
    }

    public Long getComplaintId() {
        return complaintId;
    }

    public void setComplaintId(Long complaintId) {
        this.complaintId = complaintId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
