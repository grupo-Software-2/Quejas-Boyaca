package com.uptc.complaint_sistem.controller;

import com.uptc.complaint_sistem.model.PublicEntity;
import com.uptc.complaint_sistem.repository.PublicEntityRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/entities")
public class PublicEntityController {

    private final PublicEntityRepository repository;

    public PublicEntityController(PublicEntityRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<PublicEntity> getAllEntities() {
        return repository.findAll();
    }

    @PostMapping
    public PublicEntity createEntity(@RequestBody PublicEntity entity) {
        return repository.save(entity);
    }
}

