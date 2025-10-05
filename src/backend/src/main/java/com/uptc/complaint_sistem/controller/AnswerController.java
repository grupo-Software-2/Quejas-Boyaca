package com.uptc.complaint_sistem.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin; 
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uptc.complaint_sistem.model.Answer;
import com.uptc.complaint_sistem.service.AnswerService;

@RestController
@RequestMapping("/api/answers")
@CrossOrigin(origins = "http://localhost:5173") 
public class AnswerController {

    @Autowired
    private AnswerService answerService;

    @PostMapping("/add")
    public ResponseEntity<Answer> addAnswer(@RequestBody Map<String, Object> payload) {

        Long complaintId = Long.valueOf(payload.get("complaintId").toString()); 
        String message = payload.get("message").toString();

        Answer newAnswer = answerService.addAnswerToComplaint(complaintId, message);

        return ResponseEntity.ok(newAnswer);
    }
}
