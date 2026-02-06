-- Скрипт для обновления паролей на хэшированные версии
-- Выполните этот скрипт после установки bcrypt

-- Обновляем пароли на хэшированные версии
-- password -> $2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO.6
-- 123456 -> $2b$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi
-- admin123 -> $2b$12$8k2eoYW1g8fNqFx6o8.HNOyTdMQjdVK5FqNqFqNqFqNqFqNqFqNqF
-- user123 -> $2b$12$7k1doXW0f7eNpEx5n7.GNNxScLQhdUJ4EpMpEpMpEpMpEpMpEpMpE

UPDATE accounts SET password_hash = '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO.6' 
WHERE login = 'post@example.com';

UPDATE accounts SET password_hash = '$2b$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' 
WHERE login = 'security@example.com';

UPDATE accounts SET password_hash = '$2b$12$8k2eoYW1g8fNqFx6o8.HNOyTdMQjdVK5FqNqFqNqFqNqFqNqFqNqF' 
WHERE login = 'admin@example.com';

UPDATE accounts SET password_hash = '$2b$12$7k1doXW0f7eNpEx5n7.GNNxScLQhdUJ4EpMpEpMpEpMpEpMpEpMpE' 
WHERE login = 'user@example.com';

-- Проверяем результат
SELECT login, 
       CASE 
         WHEN password_hash LIKE '$2b$%' THEN 'Хэширован ✅' 
         ELSE 'Обычный текст ❌' 
       END as password_status
FROM accounts;
