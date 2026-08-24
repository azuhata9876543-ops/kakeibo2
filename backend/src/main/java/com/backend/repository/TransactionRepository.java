package com.backend.repository;

import com.backend.entity.EntityTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TransactionRepository extends JpaRepository<EntityTransaction, Long> {
    // ユーザーIDに基づいてトランザクションを取得するメソッド
    List<EntityTransaction> findByUserId(String userId);
}
