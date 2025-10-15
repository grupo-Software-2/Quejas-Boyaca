package com.uptc.complaint_sistem.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uptc.complaint_sistem.dto.AnswerDTO;
import com.uptc.complaint_sistem.service.AnswerService;

@RestController
@RequestMapping("/api/answers")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "https://taller-quejas.vercel.app"})
public class AnswerController {

    @Autowired
    private AnswerService answerService;

    @PostMapping("/add")
    public ResponseEntity<?> addAnswer(@RequestBody Map<String, String> payload) {
        try {
            Long complaintId = Long.valueOf(payload.get("complaint_id").toString());
            String message = payload.get("message").toString();

            AnswerDTO newAnswer = answerService.addAnswerToComplaint(complaintId, message);

            return ResponseEntity.status(HttpStatus.CREATED).body(newAnswer);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", e.getMessage()));

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al agregar la respuesta"));
        }
    }

    @GetMapping("/complaint/{complaintId}")
    public ResponseEntity<List<AnswerDTO>> getAnswersByComplaint(@PathVariable Long complaintId) {
        try {
            List<AnswerDTO> answers = answerService.getAnswersByComplaint(complaintId);
            return ResponseEntity.ok(answers);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<AnswerDTO> getAnswerById(@PathVariable Long id) {
        try {
            AnswerDTO answer = answerService.getAnswerById(id);
            return ResponseEntity.ok(answer);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAnswer(@PathVariable Long id) {
        try {
            answerService.deleteAnswer(id);
            return ResponseEntity.ok().body(Map.of("message", "Respuesta eliminada exitosamente"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al eliminar la respuesta"));
        }
    }
}