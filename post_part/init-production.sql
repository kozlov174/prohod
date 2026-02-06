-- Инициализация базы данных для продакшена
-- Этот файл создает структуру БД согласно предоставленным моделям

-- Создание enum для ролей
CREATE TYPE role_enum AS ENUM ('user', 'security', 'admin', 'post');

-- Создание enum для статусов заявок
CREATE TYPE visit_request_status_enum AS ENUM ('not_processed', 'reject', 'accept');

-- Создание enum для статусов email запросов
CREATE TYPE email_request_status_enum AS ENUM ('active', 'inactive');

-- Создание таблицы пользователей
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL,
    surname VARCHAR NOT NULL,
    user_email VARCHAR NOT NULL UNIQUE,
    role role_enum NOT NULL
);

-- Создание таблицы учетных записей
CREATE TABLE IF NOT EXISTS accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    associated_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    login VARCHAR NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    user_status VARCHAR NOT NULL DEFAULT 'active'
);

-- Создание таблицы форм
CREATE TABLE IF NOT EXISTS forms (
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
CREATE TABLE IF NOT EXISTS visit_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    form_id UUID NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
    who_processed_user_id UUID REFERENCES users(id),
    who_processed_security_id UUID REFERENCES users(id),
    status visit_request_status_enum DEFAULT 'not_processed',
    rejection_reason TEXT
);

-- Создание таблицы кодов верификации
CREATE TABLE IF NOT EXISTS verify_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    time TIMESTAMP NOT NULL,
    email VARCHAR NOT NULL,
    verification_code TEXT NOT NULL,
    status email_request_status_enum NOT NULL DEFAULT 'active'
);

-- Создание таблицы логов посещений (добавляем недостающую таблицу)
CREATE TABLE IF NOT EXISTS visit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_request_id UUID NOT NULL REFERENCES visit_requests(id) UNIQUE,
    entry_time TIMESTAMP NULL,
    exit_time TIMESTAMP NULL,
    post_user_id UUID REFERENCES users(id),
    notes TEXT
);

-- Вставка тестовых пользователей
INSERT INTO users (id, name, surname, user_email, role) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Иван', 'Петров', 'post@example.com', 'post'),
('550e8400-e29b-41d4-a716-446655440002', 'Анна', 'Сидорова', 'security@example.com', 'security'),
('550e8400-e29b-41d4-a716-446655440003', 'Петр', 'Иванов', 'admin@example.com', 'admin'),
('550e8400-e29b-41d4-a716-446655440004', 'Мария', 'Козлова', 'user@example.com', 'user')
ON CONFLICT (user_email) DO NOTHING;

-- Вставка тестовых учетных записей (пароли в открытом виде для демонстрации)
-- В продакшене используйте хешированные пароли
INSERT INTO accounts (associated_user_id, login, password_hash, user_status) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'post@example.com', 'password', 'active'),
('550e8400-e29b-41d4-a716-446655440002', 'security@example.com', '123456', 'active'),
('550e8400-e29b-41d4-a716-446655440003', 'admin@example.com', 'admin123', 'active'),
('550e8400-e29b-41d4-a716-446655440004', 'user@example.com', 'user123', 'active')
ON CONFLICT (login) DO NOTHING;

-- Вставка тестовых форм
INSERT INTO forms (id, user_to_visit_id, passport_full_name, passport_series, passport_number, passport_who_issued, passport_issue_date, passport_photo, visit_time, visit_reason, email_to_send_reply) VALUES
('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', 'Иванов Иван Иванович', '1234', '567890', 'ОУФМС России по г. Москве', '2020-05-15 00:00:00', 'photo_url_1', '2024-01-15 14:30:00', 'Деловая встреча с руководством компании', 'ivanov@example.com'),
('650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', 'Петрова Анна Сергеевна', '5678', '123456', 'ОУФМС России по г. Санкт-Петербургу', '2019-03-20 00:00:00', 'photo_url_2', '2024-01-16 10:00:00', 'Консультация по техническим вопросам', 'petrova@example.com'),
('650e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'Сидоров Петр Александрович', '9876', '543210', 'ОУФМС России по Московской области', '2021-08-10 00:00:00', 'photo_url_3', '2024-01-17 16:15:00', 'Подписание договора о сотрудничестве', 'sidorov@example.com')
ON CONFLICT (id) DO NOTHING;

-- Вставка тестовых заявок на посещение
INSERT INTO visit_requests (id, form_id, status, rejection_reason) VALUES
('req_001', '650e8400-e29b-41d4-a716-446655440001', 'accept', NULL),
('req_002', '650e8400-e29b-41d4-a716-446655440002', 'accept', NULL),
('req_003', '650e8400-e29b-41d4-a716-446655440003', 'reject', 'Недостаточно документов для подтверждения личности')
ON CONFLICT (id) DO NOTHING;

-- Вставка тестовых логов посещений
INSERT INTO visit_logs (visit_request_id, entry_time, exit_time, post_user_id) VALUES
('req_001', '2024-01-15 14:25:00', '2024-01-15 16:30:00', '550e8400-e29b-41d4-a716-446655440001'),
('req_002', '2024-01-16 09:55:00', NULL, '550e8400-e29b-41d4-a716-446655440001')
ON CONFLICT (visit_request_id) DO NOTHING;
