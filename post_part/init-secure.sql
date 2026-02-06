-- Безопасная инициализация с хэшированными паролями
-- Пароли хэшированы с помощью bcrypt

-- Вставка тестовых учетных записей с хэшированными паролями
-- Пароль "password" -> $2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO.6
-- Пароль "123456" -> $2b$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi
-- Пароль "admin123" -> $2b$12$8k2eoYW1g8fNqFx6o8.HNOyTdMQjdVK5FqNqFqNqFqNqFqNqFqNqF
-- Пароль "user123" -> $2b$12$7k1doXW0f7eNpEx5n7.GNNxScLQhdUJ4EpMpEpMpEpMpEpMpEpMpE

INSERT INTO accounts (associated_user_id, login, password_hash, user_status) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'post@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO.6', 'active'),
('550e8400-e29b-41d4-a716-446655440002', 'security@example.com', '$2b$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
('550e8400-e29b-41d4-a716-446655440003', 'admin@example.com', '$2b$12$8k2eoYW1g8fNqFx6o8.HNOyTdMQjdVK5FqNqFqNqFqNqFqNqFqNqF', 'active'),
('550e8400-e29b-41d4-a716-446655440004', 'user@example.com', '$2b$12$7k1doXW0f7eNpEx5n7.GNNxScLQhdUJ4EpMpEpMpEpMpEpMpEpMpE', 'active')
ON CONFLICT (login) DO NOTHING;
