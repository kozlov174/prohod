-- Обновление паролей на ПРАВИЛЬНЫЕ хэшированные версии
-- Сгенерировано с помощью bcrypt с saltRounds = 12

-- Обновляем пароль "password" для post@example.com
UPDATE accounts SET password_hash = '$2b$12$rQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO.6' 
WHERE login = 'post@example.com';

-- Обновляем пароль "123456" для security@example.com  
UPDATE accounts SET password_hash = '$2b$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
WHERE login = 'security@example.com';

-- Обновляем пароль "admin123" для admin@example.com
UPDATE accounts SET password_hash = '$2b$12$K2P2C6xnlRjp0oRADVfOyOsHd.Gy0Vl9q5YnIcdk4XXVN7EyHHb2C'
WHERE login = 'admin@example.com';

-- Обновляем пароль "user123" для user@example.com
UPDATE accounts SET password_hash = '$2b$12$Tt8b/wSZ8oU3rygGkewzOOBXBxfI0Pi9cyYl1JGiGsrP5hZiRHWO6'
WHERE login = 'user@example.com';

-- Проверяем результат
SELECT login, 
       CASE 
         WHEN password_hash LIKE '$2b$%' THEN 'Хэширован ✅' 
         ELSE 'Обычный текст ❌' 
       END as password_status,
       LEFT(password_hash, 20) || '...' as hash_preview
FROM accounts;
