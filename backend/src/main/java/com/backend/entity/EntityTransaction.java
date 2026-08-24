package com.backend.entity;

import java.time.LocalDate;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Setter
@Getter
@Table(name = "transactions")
public class EntityTransaction {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "日付は必須です。")
    private LocalDate date;

    @NotNull(message = "金額は必須です。")
    @Min(value = 1, message = "金額は1以上を入力してください。")
    private Integer amount;

    @Size(max = 40, message = "メモは40文字以内で入力してください。")
    private String memo;

    @ManyToOne
    @JoinColumn(name = "category_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private EntityCategory category;

    @Size(max = 20, message = "入力は20文字以内です。")
    private String item;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private EntityUser user;

    public EntityTransaction() {
    }
}
