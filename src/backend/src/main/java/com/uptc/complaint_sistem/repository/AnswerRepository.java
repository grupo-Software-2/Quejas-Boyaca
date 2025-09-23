package com.uptc.complaint_sistem.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.uptc.complaint_sistem.model.Answer;

@Repository
public interface AnswerRepository extends JpaRepository<Answer, Long> {
}