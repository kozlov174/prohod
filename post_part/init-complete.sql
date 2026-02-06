-- Полная инициализация базы данных PostgreSQL
-- Основано на SQLAlchemy моделях из приложения

-- Удаляем существующие объекты если они есть (для чистой установки)
DROP TABLE IF EXISTS visit_logs CASCADE;
DROP TABLE IF EXISTS verify_codes CASCADE;
DROP TABLE IF EXISTS visit_requests CASCADE;
DROP TABLE IF EXISTS forms CASCADE;
DROP TABLE IF EXISTS accounts CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Удаляем существующие типы
DROP TYPE IF EXISTS role_enum CASCADE;
DROP TYPE IF EXISTS visit_request_status_enum CASCADE;
DROP TYPE IF EXISTS email_request_status_enum CASCADE;

-- Создание enum типов
CREATE TYPE role_enum AS ENUM ('user', 'security', 'admin', 'post');
CREATE TYPE visit_request_status_enum AS ENUM ('not_processed', 'reject', 'accept');
CREATE TYPE email_request_status_enum AS ENUM ('active', 'inactive');

-- Создание таблицы пользователей
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL,
    surname VARCHAR NOT NULL,
    user_email VARCHAR NOT NULL UNIQUE,
    role role_enum NOT NULL
);

-- Создание таблицы учетных записей
CREATE TABLE accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    associated_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    login VARCHAR NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    user_status VARCHAR NOT NULL DEFAULT 'active'
);

-- Создание таблицы форм
CREATE TABLE forms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_to_visit_id UUID NOT NULL REFERENCES users(id),
    passport_full_name TEXT NOT NULL,
    passport_series VARCHAR NOT NULL,
    passport_number VARCHAR NOT NULL,
    passport_who_issued TEXT NOT NULL,
    passport_issue_date TIMESTAMP NOT NULL,
    passport_photo TEXT NOT NULL,
    visit_time TIMESTAMP NOT NULL,
    visit_reason TEXT NOT NULL,
    email_to_send_reply VARCHAR NOT NULL
);

-- Создание таблицы заявок на посещение
CREATE TABLE visit_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    form_id UUID NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
    who_processed_user_id UUID REFERENCES users(id),
    who_processed_security_id UUID REFERENCES users(id),
    status visit_request_status_enum DEFAULT 'not_processed',
    rejection_reason TEXT
);

-- Создание таблицы кодов верификации
CREATE TABLE verify_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    time TIMESTAMP NOT NULL,
    email VARCHAR NOT NULL,
    verification_code TEXT NOT NULL,
    status email_request_status_enum NOT NULL DEFAULT 'active'
);

-- Создание таблицы логов посещений (дополнительная таблица для системы)
CREATE TABLE visit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_request_id UUID NOT NULL REFERENCES visit_requests(id) UNIQUE,
    entry_time TIMESTAMP NULL,
    exit_time TIMESTAMP NULL,
    post_user_id UUID REFERENCES users(id),
    notes TEXT
);

-- Создание индексов для оптимизации производительности
CREATE INDEX idx_users_email ON users(user_email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_accounts_login ON accounts(login);
CREATE INDEX idx_accounts_user_id ON accounts(associated_user_id);
CREATE INDEX idx_forms_user_to_visit ON forms(user_to_visit_id);
CREATE INDEX idx_forms_visit_time ON forms(visit_time);
CREATE INDEX idx_visit_requests_form ON visit_requests(form_id);
CREATE INDEX idx_visit_requests_status ON visit_requests(status);
CREATE INDEX idx_visit_requests_processed_user ON visit_requests(who_processed_user_id);
CREATE INDEX idx_visit_requests_processed_security ON visit_requests(who_processed_security_id);
CREATE INDEX idx_visit_logs_request ON visit_logs(visit_request_id);
CREATE INDEX idx_visit_logs_entry_time ON visit_logs(entry_time);
CREATE INDEX idx_visit_logs_exit_time ON visit_logs(exit_time);
CREATE INDEX idx_verify_codes_email ON verify_codes(email);
CREATE INDEX idx_verify_codes_status ON verify_codes(status);
CREATE INDEX idx_verify_codes_time ON verify_codes(time);

-- Вставка тестовых пользователей
INSERT INTO users (id, name, surname, user_email, role) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Иван', 'Петров', 'post@example.com', 'post'),
('550e8400-e29b-41d4-a716-446655440002', 'Анна', 'Сидорова', 'security@example.com', 'security'),
('550e8400-e29b-41d4-a716-446655440003', 'Петр', 'Иванов', 'admin@example.com', 'admin'),
('550e8400-e29b-41d4-a716-446655440004', 'Мария', 'Козлова', 'user@example.com', 'user'),
('550e8400-e29b-41d4-a716-446655440005', 'Алексей', 'Смирнов', 'director@example.com', 'admin'),
('550e8400-e29b-41d4-a716-446655440006', 'Елена', 'Волкова', 'hr@example.com', 'user')
ON CONFLICT (user_email) DO NOTHING;

-- Вставка тестовых учетных записей с хэшированными паролями
-- Пароли: password, 123456, admin123, user123, director123, hr123
INSERT INTO accounts (id, associated_user_id, login, password_hash, user_status) VALUES
('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'post@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO.6', 'active'),
('650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'security@example.com', '$2b$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active'),
('650e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'admin@example.com', '$2b$12$K2P2C6xnlRjp0oRADVfOyOsHd.Gy0Vl9q5YnIcdk4XXVN7EyHHb2C', 'active'),
('650e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004', 'user@example.com', '$2b$12$Tt8b/wSZ8oU3rygGkewzOOBXBxfI0Pi9cyYl1JGiGsrP5hZiRHWO6', 'active'),
('650e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440005', 'director@example.com', '$2b$12$XYZ123abc456def789ghi012jkl345mno678pqr901stu234vwx567yz', 'active'),
('650e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440006', 'hr@example.com', '$2b$12$ABC789def012ghi345jkl678mno901pqr234stu567vwx890yzA123BC', 'active')
ON CONFLICT (login) DO NOTHING;

-- Вставка тестовых форм
INSERT INTO forms (id, user_to_visit_id, passport_full_name, passport_series, passport_number, passport_who_issued, passport_issue_date, passport_photo, visit_time, visit_reason, email_to_send_reply) VALUES
('750e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', 'Иванов Иван Иванович', '1234', '567890', 'ОУФМС России по г. Москве', '2020-05-15 00:00:00', 'photo_url_1', '2024-01-15 14:30:00', 'Деловая встреча с руководством компании', 'ivanov@example.com'),
('750e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', 'Петрова Анна Сергеевна', '5678', '123456', 'ОУФМС России по г. Санкт-Петербургу', '2019-03-20 00:00:00', 'photo_url_2', '2024-01-16 10:00:00', 'Консультация по техническим вопросам', 'petrova@example.com'),
('750e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440005', 'Сидоров Петр Александрович', '9876', '543210', 'ОУФМС России по Московской области', '2021-08-10 00:00:00', 'photo_url_3', '2024-01-17 16:15:00', 'Подписание договора о сотрудничестве', 'sidorov@example.com'),
('750e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440006', 'Козлова Мария Владимировна', '4567', '890123', 'ОУФМС России по г. Екатеринбургу', '2018-12-05 00:00:00', 'photo_url_4', '2024-01-18 09:00:00', 'Собеседование на вакансию', 'kozlova@example.com'),
('750e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440003', 'Смирнов Алексей Николаевич', '7890', '234567', 'ОУФМС России по г. Новосибирску', '2022-03-15 00:00:00', 'photo_url_5', '2024-01-19 13:45:00', 'Техническое обслуживание оборудования', 'smirnov@example.com')
ON CONFLICT (id) DO NOTHING;

-- Вставка тестовых заявок на посещение
INSERT INTO visit_requests (id, form_id, who_processed_user_id, who_processed_security_id, status, rejection_reason) VALUES
('req_001', '750e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'accept', NULL),
('req_002', '750e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'accept', NULL),
('req_003', '750e8400-e29b-41d4-a716-446655440003', NULL, '550e8400-e29b-41d4-a716-446655440002', 'reject', 'Недостаточно документов для подтверждения личности'),
('req_004', '750e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440006', NULL, 'accept', NULL),
('req_005', '750e8400-e29b-41d4-a716-446655440005', NULL, NULL, 'not_processed', NULL)
ON CONFLICT (id) DO NOTHING;

-- Вставка тестовых логов посещений
INSERT INTO visit_logs (id, visit_request_id, entry_time, exit_time, post_user_id, notes) VALUES
('850e8400-e29b-41d4-a716-446655440001', 'req_001', '2024-01-15 14:25:00', '2024-01-15 16:30:00', '550e8400-e29b-41d4-a716-446655440001', 'Встреча прошла успешно'),
('850e8400-e29b-41d4-a716-446655440002', 'req_002', '2024-01-16 09:55:00', NULL, '550e8400-e29b-41d4-a716-446655440001', 'Посетитель находится в здании'),
('850e8400-e29b-41d4-a716-446655440003', 'req_004', '2024-01-18 08:45:00', '2024-01-18 17:30:00', '550e8400-e29b-41d4-a716-446655440001', 'Собеседование завершено')
ON CONFLICT (visit_request_id) DO NOTHING;

-- Вставка тестовых кодов верификации
INSERT INTO verify_codes (id, time, email, verification_code, status) VALUES
('950e8400-e29b-41d4-a716-446655440001', '2024-01-15 12:00:00', 'ivanov@example.com', '123456', 'inactive'),
('950e8400-e29b-41d4-a716-446655440002', '2024-01-16 08:30:00', 'petrova@example.com', '789012', 'inactive'),
('950e8400-e29b-41d4-a716-446655440003', '2024-01-17 15:45:00', 'sidorov@example.com', '345678', 'inactive'),
('950e8400-e29b-41d4-a716-446655440004', '2024-01-18 07:15:00', 'kozlova@example.com', '901234', 'active'),
('950e8400-e29b-41d4-a716-446655440005', '2024-01-19 12:30:00', 'smirnov@example.com', '567890', 'active')
ON CONFLICT (id) DO NOTHING;

-- Создание представлений для удобства работы
CREATE OR REPLACE VIEW visit_requests_with_details AS
SELECT 
    vr.id as request_id,
    vr.status,
    vr.rejection_reason,
    f.passport_full_name,
    f.passport_series,
    f.passport_number,
    f.visit_time,
    f.visit_reason,
    f.email_to_send_reply,
    u_visit.name as visit_to_name,
    u_visit.surname as visit_to_surname,
    u_processed.name as processed_by_name,
    u_processed.surname as processed_by_surname,
    s_processed.name as security_name,
    s_processed.surname as security_surname,
    vl.entry_time,
    vl.exit_time,
    CASE 
        WHEN vl.entry_time IS NOT NULL AND vl.exit_time IS NULL THEN 'inside'
        WHEN vl.entry_time IS NOT NULL AND vl.exit_time IS NOT NULL THEN 'completed'
        ELSE 'not_entered'
    END as visit_status
FROM visit_requests vr
JOIN forms f ON vr.form_id = f.id
JOIN users u_visit ON f.user_to_visit_id = u_visit.id
LEFT JOIN users u_processed ON vr.who_processed_user_id = u_processed.id
LEFT JOIN users s_processed ON vr.who_processed_security_id = s_processed.id
LEFT JOIN visit_logs vl ON vr.id = vl.visit_request_id;

-- Создание функции для автоматической генерации UUID для verify_codes
CREATE OR REPLACE FUNCTION generate_verify_code_id()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.id IS NULL THEN
        NEW.id = gen_random_uuid();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Создание триггера для автоматической генерации ID
CREATE TRIGGER trigger_generate_verify_code_id
    BEFORE INSERT ON verify_codes
    FOR EACH ROW
    EXECUTE FUNCTION generate_verify_code_id();

-- Вывод статистики после инициализации
DO $$
BEGIN
    RAISE NOTICE '=== ИНИЦИАЛИЗАЦИЯ БАЗЫ ДАННЫХ ЗАВЕРШЕНА ===';
    RAISE NOTICE 'Пользователей: %', (SELECT COUNT(*) FROM users);
    RAISE NOTICE 'Аккаунтов: %', (SELECT COUNT(*) FROM accounts);
    RAISE NOTICE 'Форм: %', (SELECT COUNT(*) FROM forms);
    RAISE NOTICE 'Заявок: %', (SELECT COUNT(*) FROM visit_requests);
    RAISE NOTICE 'Логов посещений: %', (SELECT COUNT(*) FROM visit_logs);
    RAISE NOTICE 'Кодов верификации: %', (SELECT COUNT(*) FROM verify_codes);
    RAISE NOTICE '=== ТЕСТОВЫЕ ДАННЫЕ ===';
    RAISE NOTICE 'Логин для поста: post@example.com / password';
    RAISE NOTICE 'Логин для охраны: security@example.com / 123456';
    RAISE NOTICE 'Логин для админа: admin@example.com / admin123';
    RAISE NOTICE '=======================================';
END $$;
