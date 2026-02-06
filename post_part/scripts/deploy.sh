#!/bin/bash

# Скрипт для развертывания в production

echo "🚀 Развертывание QR Ticket System в production..."

# Останавливаем существующие контейнеры
docker-compose down

# Собираем и запускаем
docker-compose up --build -d

echo "✅ Приложение развернуто в production!"
echo "🌐 Доступно по адресу: http://localhost:3000"
echo "🗄️ PostgreSQL доступен на порту: 5432"
echo "🔴 Redis доступен на порту: 6379"

# Показываем статус контейнеров
echo "📊 Статус контейнеров:"
docker-compose ps
