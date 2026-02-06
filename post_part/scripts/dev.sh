#!/bin/bash

# Скрипт для запуска в режиме разработки

echo "🔧 Запуск QR Ticket System в режиме разработки..."

# Очищаем Docker кеш для избежания проблем с зависимостями
echo "🧹 Очистка Docker кеша..."
docker system prune -f

# Останавливаем существующие контейнеры
docker-compose -f docker-compose.dev.yml down

# Удаляем старые образы
docker-compose -f docker-compose.dev.yml down --rmi all

# Запускаем в режиме разработки с принудительной пересборкой
docker-compose -f docker-compose.dev.yml up --build --force-recreate

echo "✅ Приложение запущено в режиме разработки!"
echo "🌐 Доступно по адресу: http://localhost:3000"
echo "🗄️ PostgreSQL доступен на порту: 5433"
