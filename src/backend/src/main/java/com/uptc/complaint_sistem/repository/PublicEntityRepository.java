package com.uptc.complaint_sistem.repository;

import com.uptc.complaint_sistem.model.PublicEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PublicEntityRepository extends JpaRepository<PublicEntity, Long> {
}

