package com.uptc.complaint_sistem.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "complaints")
public class Complaint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Ahora es una relación a la tabla PublicEntity
    @ManyToOne
    @JoinColumn(name = "entity_id", nullable = false)
    private PublicEntity entity;

    @Column(nullable = false, length = 1000)
    private String text;

    @Column(nullable = false)
    private LocalDateTime date;

    // Constructor vacío
    public Complaint() {
        this.date = LocalDateTime.now();
    }

    // Constructor con parámetros
    public Complaint(PublicEntity entity, String text) {
        this.entity = entity;
        this.text = text;
        this.date = LocalDateTime.now();
    }

    // Getters y Setters
    public Long getId() { return id; }

    public PublicEntity getEntity() { return entity; }
    public void setEntity(PublicEntity entity) { this.entity = entity; }

    public String getText() { return text; }
    public void setText(String text) { this.text = text; }

    public LocalDateTime getDate() { return date; }
    public void setDate(LocalDateTime date) { this.date = date; }
}
