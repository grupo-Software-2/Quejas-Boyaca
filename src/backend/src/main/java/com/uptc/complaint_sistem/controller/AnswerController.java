package com.uptc.complaint_sistem.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin; // <-- Importación necesaria
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uptc.complaint_sistem.model.Answer;
import com.uptc.complaint_sistem.service.AnswerService;

@RestController
@RequestMapping("/api/answers")
@CrossOrigin(origins = "http://localhost:5173") // <-- SOLUCIÓN: Permite la conexión desde React
public class AnswerController {

    @Autowired
    private AnswerService answerService;

    @PostMapping("/add")
    public ResponseEntity<Answer> addAnswer(@RequestBody Map<String, Object> payload) {
        // Extraer los datos de la solicitud
        // Nota: He corregido la clave de payload de "complaint_id" a "complaintId" 
        // para coincidir con el frontend y el backend que usamos antes.
        Long complaintId = Long.valueOf(payload.get("complaintId").toString()); 
        String message = payload.get("message").toString();

        // Llamar al servicio para procesar la lógica de negocio
        Answer newAnswer = answerService.addAnswerToComplaint(complaintId, message);

        return ResponseEntity.ok(newAnswer);
    }
}