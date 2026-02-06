#!/bin/bash

# Скрипт для сборки Docker образа

echo "🔨 Сборка Docker образа для QR Ticket System..."

# Очищаем Docker кеш
echo "🧹 Очистка Docker кеша..."
docker system prune -f

# Удаляем старый образ если существует
docker rmi qr-ticket-system:latest 2>/dev/null || true

# Сборка production образа
docker build -t qr-ticket-system:latest . --no-cache

echo "✅ Образ собран успешно!"

# Показываем размер образа
echo "📊 Размер образа:"
docker images qr-ticket-system:latest

echo "🚀 Для запуска используйте:"
echo "docker-compose up -d"
