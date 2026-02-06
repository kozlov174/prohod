# QR Ticket System

Система управления заявками на посещение с QR кодами.

## 🚀 Быстрый старт

### Запуск с Docker Compose (рекомендуется)

\`\`\`bash
# Клонируйте репозиторий
git clone <repository-url>
cd qr-ticket-system

# Запуск в production режиме
docker-compose up -d

# Или запуск в режиме разработки
docker-compose -f docker-compose.dev.yml up --build
\`\`\`

### Запуск без Docker

\`\`\`bash
# Установка зависимостей
npm install

# Запуск в режиме разработки
npm run dev

# Сборка для production
npm run build
npm start
\`\`\`

## 🐳 Docker команды

\`\`\`bash
# Сборка образа
npm run docker:build

# Запуск production
npm run docker:prod

# Запуск разработки
npm run docker:dev

# Остановка контейнеров
npm run docker:stop

# Просмотр логов
npm run docker:logs
\`\`\`

## 📋 Доступ к приложению

- **Веб-интерфейс**: http://localhost:3000
- **PostgreSQL**: localhost:5432 (production) / localhost:5433 (dev)
- **Redis**: localhost:6379

## 🔐 Тестовые данные

### Пользователь с доступом (роль "post"):
- Email: `post@example.com`
- Пароль: `password`

### Пользователи без доступа:
- `security@example.com` / `123456`
- `admin@example.com` / `admin123`
- `user@example.com` / `user123`

### Тестовые заявки:
- `req_001` - Не обработана
- `req_002` - Одобрена  
- `req_003` - Отклонена

## 🏗️ Архитектура

\`\`\`
qr-ticket-system/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard страница
│   └── page.tsx          # Главная страница
├── components/            # React компоненты
├── docker-compose.yml     # Production Docker Compose
├── docker-compose.dev.yml # Development Docker Compose
├── Dockerfile            # Production Dockerfile
├── Dockerfile.dev        # Development Dockerfile
└── init.sql             # Инициализация БД
\`\`\`

## 🔧 Переменные окружения

Создайте файл `.env.local`:

\`\`\`env
# Database
DATABASE_URL=postgresql://qr_user:qr_password@localhost:5432/qr_tickets

# Redis
REDIS_URL=redis://localhost:6379

# App
NODE_ENV=production
PORT=3000
\`\`\`

## 📊 Мониторинг

\`\`\`bash
# Статус контейнеров
docker-compose ps

# Логи приложения
docker-compose logs -f qr-ticket-app

# Логи базы данных
docker-compose logs -f postgres

# Использование ресурсов
docker stats
\`\`\`

## 🛠️ Разработка

\`\`\`bash
# Запуск в режиме разработки с hot reload
docker-compose -f docker-compose.dev.yml up

# Подключение к контейнеру для отладки
docker-compose exec qr-ticket-app-dev sh

# Подключение к PostgreSQL
docker-compose exec postgres psql -U qr_user -d qr_tickets_dev
\`\`\`

## 📝 Логи

Логи приложения сохраняются в папку `./logs/` (если настроено).

## 🔒 Безопасность

- Доступ только для пользователей с ролью "post"
- Маскирование паспортных данных
- Защищенные API endpoints
- Проверка ролей на сервере и клиенте

## 🚀 Деплой

Для деплоя в production используйте:

\`\`\`bash
# Автоматический деплой
./scripts/deploy.sh

# Или вручную
docker-compose up --build -d
