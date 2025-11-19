package com.uptc.complaint_sistem.model;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "complaints")
public class Complaint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PublicEntity entity;

    @Column(nullable = false, length = 1000)
    private String text;

    @Column(nullable = false)
    private LocalDateTime date;

    @Column(nullable = false)
    private String ipAddress;

    @Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT FALSE")
    private boolean deleted;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @OneToMany(mappedBy = "complaint", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Answer> answers;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ComplaintStatus status;
    
    
    @Column(name = "fecha_fin_queja")
    private LocalDateTime fechaFinQueja;

    @Column(name = "duracion_respuesta")
    private Long duracionRespuesta; 


    public Complaint() {
        this.date = LocalDateTime.now();
        this.status = ComplaintStatus.PROCESO;
    }

    public Complaint(PublicEntity entity, String text, String ipAddress) {
        this.entity = entity;
        this.text = text;
        this.date = LocalDateTime.now();
        this.ipAddress = ipAddress;
        this.deleted = false;
        this.status = ComplaintStatus.PROCESO;
    }


    public Long getId() { return id; }

    public PublicEntity getEntity() { return entity; }
    public void setEntity(PublicEntity entity) { this.entity = entity; }

    public String getText() { return text; }
    public void setText(String text) { this.text = text; }

    public LocalDateTime getDate() { return date; }
    public void setDate(LocalDateTime date) { this.date = date; }

    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }

    public List<Answer> getAnswers() { return answers; }
    public void setAnswers(List<Answer> answers) { this.answers = answers; }

    public boolean isDeleted() { return deleted; }
    public void setDeleted(boolean deleted) { 
        this.deleted = deleted;
        if (deleted && this.deletedAt == null) {
            this.deletedAt = LocalDateTime.now();
        }
    }

    public LocalDateTime getDeletedAt() { return deletedAt; }
    public void setDeletedAt(LocalDateTime deletedAt) { this.deletedAt = deletedAt; }

    public ComplaintStatus getStatus() { return status; }
    public void setStatus(ComplaintStatus status) { this.status = status; }

    // --- Getters y Setters de los nuevos campos ---
    public LocalDateTime getFechaFinQueja() { return fechaFinQueja; }
    public void setFechaFinQueja(LocalDateTime fechaFinQueja) { this.fechaFinQueja = fechaFinQueja; }

    public Long getDuracionRespuesta() { return duracionRespuesta; }
    public void setDuracionRespuesta(Long duracionRespuesta) { this.duracionRespuesta = duracionRespuesta; }
}