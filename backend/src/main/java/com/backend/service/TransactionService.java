package com.backend.service;

import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;
import java.util.List;
import com.backend.entity.EntityTransaction;
import com.backend.repository.TransactionRepository;

@Service
public class TransactionService {
    private final TransactionRepository transactionRepository;

    public TransactionService(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    // ユーザーIDに基づいてトランザクションを取得するメソッド
    public List<EntityTransaction> getAllTransactions(String userId) {
        return transactionRepository.findByUserId(userId);
    }

    @Transactional
    public EntityTransaction createTransaction(EntityTransaction transaction) {
        
        EntityTransaction saved = transactionRepository.saveAndFlush(transaction);
        return transactionRepository.findById(saved.getId())
                .orElseThrow(() -> new RuntimeException("登録データの取得に失敗しました。"));
    }

    @Transactional
    public EntityTransaction updateTransaction(Long id, EntityTransaction newTransaction) {
        return transactionRepository.findById(id)
                .map(item -> {
                    item.setAmount(newTransaction.getAmount());                    
                    item.setDate(newTransaction.getDate());
                    item.setItem(newTransaction.getItem());
                    item.setMemo(newTransaction.getMemo());
                    var newCategory = newTransaction.getCategory();
                    if (newCategory != null) {
                        item.setCategory(newCategory);
                    } else {
                    item.setCategory(null);
                    }
                    return transactionRepository.saveAndFlush(item);
                })
                .orElseThrow(() -> new RuntimeException("指定された取引(ID: " + id + ")は見つかりませんでした。"));
    }


    @Transactional
    public void deleteTransaction(Long id) {
        if (!transactionRepository.existsById(id)) {
            throw new RuntimeException("削除対象の取引(ID: " + id + ")は見つかりませんでした。");
        }
        transactionRepository.deleteById(id);
    }
}
