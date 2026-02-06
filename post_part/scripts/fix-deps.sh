#!/bin/bash

# Скрипт для исправления зависимостей локально

echo "🔧 Исправление зависимостей..."

# Удаляем node_modules и package-lock.json
rm -rf node_modules package-lock.json

# Очищаем npm кеш
npm cache clean --force

# Устанавливаем зависимости с флагом --legacy-peer-deps и --force
npm install --legacy-peer-deps --force

# Проверяем установку критически важных пакетов
echo "🔍 Проверка установки критических пакетов..."
npm list @radix-ui/react-label || echo "❌ @radix-ui/react-label не установлен"
npm list @radix-ui/react-slot || echo "❌ @radix-ui/react-slot не установлен"
npm list tailwindcss-animate || echo "❌ tailwindcss-animate не установлен"

echo "✅ Зависимости исправлены!"
echo "🚀 Теперь можно запускать Docker контейнеры"
