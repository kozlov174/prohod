-- Инициализация базы данных PostgreSQL согласно новой структуре
-- Этот файл будет выполнен при первом запуске контейнера PostgreSQL

-- Создание enum для ролей (добавляем роль post)
CREATE TYPE role_enum AS ENUM ('user', 'security', 'admin', 'post');

-- Создание enum для статусов заявок (обновляем статусы)
CREATE TYPE visit_request_status_enum AS ENUM ('not_processed', 'reject', 'accept');

-- Создание enum для статусов email запросов
CREATE TYPE email_request_status_enum AS ENUM ('active', 'inactive');

-- Создание таблицы пользователей (убираем timestamps)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL,
    surname VARCHAR NOT NULL,
    user_email VARCHAR NOT NULL UNIQUE,
    role role_enum NOT NULL
);

-- Создание таблицы учетных записей (password_hash как TEXT)
CREATE TABLE accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    associated_user_id UUID NOT NULL REFERENCES users(id),
    login VARCHAR NOT NULL UNIQUE,
    password_hash TEXT NOT NULL
);

-- Создание таблицы форм (убираем timestamps)
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

-- Создание таблицы заявок на посещение (обновляем статусы, убираем timestamps)
CREATE TABLE visit_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    form_id UUID NOT NULL REFERENCES forms(id),
    who_processed_user_id UUID REFERENCES users(id),
    who_processed_security_id UUID REFERENCES users(id),
    status visit_request_status_enum DEFAULT 'not_processed',
    rejection_reason TEXT
);

-- Создание таблицы кодов верификации (убираем timestamps)
CREATE TABLE verify_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    time TIMESTAMP NOT NULL,
    email VARCHAR NOT NULL,
    verification_code TEXT NOT NULL,
    status email_request_status_enum NOT NULL DEFAULT 'active'
);

-- Создание таблицы логов посещений (убираем timestamps)
CREATE TABLE visit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_request_id UUID NOT NULL REFERENCES visit_requests(id) UNIQUE,
    entry_time TIMESTAMP NULL,
    exit_time TIMESTAMP NULL,
    post_user_id UUID REFERENCES users(id),
    notes TEXT
);

-- Вставка тестовых пользователей
INSERT INTO users (name, surname, user_email, role) VALUES
('Иван', 'Петров', 'post@example.com', 'post'),
('Анна', 'Сидорова', 'security@example.com', 'security'),
('Петр', 'Иванов', 'admin@example.com', 'admin'),
('Мария', 'Козлова', 'user@example.com', 'user')
ON CONFLICT (user_email) DO NOTHING;

-- Вставка тестовых учетных записей (пароли как TEXT хеши)
INSERT INTO accounts (associated_user_id, login, password_hash) VALUES
((SELECT id FROM users WHERE user_email = 'post@example.com'), 'post@example.com', 'password'),
((SELECT id FROM users WHERE user_email = 'security@example.com'), 'security@example.com', '123456'),
((SELECT id FROM users WHERE user_email = 'admin@example.com'), 'admin@example.com', 'admin123'),
((SELECT id FROM users WHERE user_email = 'user@example.com'), 'user@example.com', 'user123')
ON CONFLICT (login) DO NOTHING;

-- Вставка тестовых форм
INSERT INTO forms (user_to_visit_id, passport_full_name, passport_series, passport_number, passport_who_issued, passport_issue_date, passport_photo, visit_time, visit_reason, email_to_send_reply)
SELECT 
    (SELECT id FROM users WHERE user_email = 'admin@example.com'),
    'Иванов Иван Иванович',
    '1234',
    '567890',
    'ОУФМС России по г. Москве',
    '2020-05-15 00:00:00',
    'photo_url_1',
    '2024-01-15 14:30:00',
    'Деловая встреча с руководством компании',
    'ivanov@example.com'
WHERE NOT EXISTS (SELECT 1 FROM forms WHERE passport_full_name = 'Иванов Иван Иванович')
UNION ALL
SELECT 
    (SELECT id FROM users WHERE user_email = 'admin@example.com'),
    'Петрова Анна Сергеевна',
    '5678',
    '123456',
    'ОУФМС России по г. Санкт-Петербургу',
    '2019-03-20 00:00:00',
    'photo_url_2',
    '2024-01-16 10:00:00',
    'Консультация по техническим вопросам',
    'petrova@example.com'
WHERE NOT EXISTS (SELECT 1 FROM forms WHERE passport_full_name = 'Петрова Анна Сергеевна')
UNION ALL
SELECT 
    (SELECT id FROM users WHERE user_email = 'admin@example.com'),
    'Сидоров Петр Александрович',
    '9876',
    '543210',
    'ОУФМС России по Московской области',
    '2021-08-10 00:00:00',
    'photo_url_3',
    '2024-01-17 16:15:00',
    'Подписание договора о сотрудничестве',
    'sidorov@example.com'
WHERE NOT EXISTS (SELECT 1 FROM forms WHERE passport_full_name = 'Сидоров Петр Александрович');

-- Вставка тестовых заявок на посещение (обновляем статусы)
INSERT INTO visit_requests (id, form_id, status, rejection_reason)
SELECT 
    'req_001'::uuid,
    f.id,
    'accept',
    NULL
FROM forms f
WHERE f.passport_full_name = 'Иванов Иван Иванович'
AND NOT EXISTS (SELECT 1 FROM visit_requests WHERE id = 'req_001'::uuid)
UNION ALL
SELECT 
    'req_002'::uuid,
    f.id,
    'accept',
    NULL
FROM forms f
WHERE f.passport_full_name = 'Петрова Анна Сергеевна'
AND NOT EXISTS (SELECT 1 FROM visit_requests WHERE id = 'req_002'::uuid)
UNION ALL
SELECT 
    'req_003'::uuid,
    f.id,
    'reject',
    'Недостаточно документов для подтверждения личности'
FROM forms f
WHERE f.passport_full_name = 'Сидоров Петр Александрович'
AND NOT EXISTS (SELECT 1 FROM visit_requests WHERE id = 'req_003'::uuid);

-- Вставка тестовых логов посещений
INSERT INTO visit_logs (visit_request_id, entry_time, exit_time, post_user_id)
SELECT 
    'req_001'::uuid,
    '2024-01-15 14:25:00',
    '2024-01-15 16:30:00',
    (SELECT id FROM users WHERE user_email = 'post@example.com')
WHERE NOT EXISTS (SELECT 1 FROM visit_logs WHERE visit_request_id = 'req_001'::uuid)
UNION ALL
SELECT 
    'req_002'::uuid,
    '2024-01-16 09:55:00',
    NULL,
    (SELECT id FROM users WHERE user_email = 'post@example.com')
WHERE NOT EXISTS (SELECT 1 FROM visit_logs WHERE visit_request_id = 'req_002'::uuid);

-- Создание индексов для оптимизации
CREATE INDEX IF NOT EXISTS idx_users_email ON users(user_email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_accounts_login ON accounts(login);
CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts(associated_user_id);
CREATE INDEX IF NOT EXISTS idx_forms_user_to_visit ON forms(user_to_visit_id);
CREATE INDEX IF NOT EXISTS idx_forms_visit_time ON forms(visit_time);
CREATE INDEX IF NOT EXISTS idx_visit_requests_form ON visit_requests(form_id);
CREATE INDEX IF NOT EXISTS idx_visit_requests_status ON visit_requests(status);
CREATE INDEX IF NOT EXISTS idx_visit_logs_request ON visit_logs(visit_request_id);
CREATE INDEX IF NOT EXISTS idx_visit_logs_entry_time ON visit_logs(entry_time);
CREATE INDEX IF NOT EXISTS idx_visit_logs_exit_time ON visit_logs(exit_time);
CREATE INDEX IF NOT EXISTS idx_verify_codes_email ON verify_codes(email);
CREATE INDEX IF NOT EXISTS idx_verify_codes_status ON verify_codes(status);
