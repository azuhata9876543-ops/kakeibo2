INSERT IGNORE  INTO users(id, password) VALUES('user1', '$2y$10$gqbQwgG3RfdbNUigYu04Guw3ksbWL3yo0ZNBQcJvqvvcwsJpO1NM.');

INSERT INTO category(category_type, category) VALUES('INCOME', '給与');
INSERT INTO category(category_type, category) VALUES('INCOME', '副収入');

INSERT INTO category(category_type, category) VALUES('EXPENSE', '固定費');
INSERT INTO category(category_type, category) VALUES('EXPENSE', '食費');
INSERT INTO category(category_type, category) VALUES('EXPENSE', '日用品');
INSERT INTO category(category_type, category) VALUES('EXPENSE', '医療');
INSERT INTO category(category_type, category) VALUES('EXPENSE', '装飾');
INSERT INTO category(category_type, category) VALUES('EXPENSE', '車');
INSERT INTO category(category_type, category) VALUES('EXPENSE', '特別費');
INSERT INTO category(category_type, category) VALUES('EXPENSE', 'その他');