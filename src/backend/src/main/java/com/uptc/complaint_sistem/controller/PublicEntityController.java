package com.uptc.complaint_sistem.controller;

import com.uptc.complaint_sistem.dto.PublicEntityDTO;
import com.uptc.complaint_sistem.model.PublicEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/entities")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "https://taller-quejas.vercel.app"})
public class PublicEntityController {

    @GetMapping
    public ResponseEntity<List<PublicEntityDTO>> getAllEntities() {
        List<PublicEntityDTO> entities = Arrays.stream(PublicEntity.values())
                .map(PublicEntityDTO::convertFromEnum)
                .collect(Collectors.toList());

        return ResponseEntity.ok(entities);
    }
}
