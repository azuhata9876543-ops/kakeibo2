package com.backend.repository;

import com.backend.entity.EntityUser;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<EntityUser, String> {
    
}
