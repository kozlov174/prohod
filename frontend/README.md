# Сервис prohod

## Начало работы

Заполните .env файл в соответствии с .env.example

## Запуск сборки проекта

Для запуска потребуется [Docker](https://www.docker.com/)

Соберите и запустите проект с помощью docker:

Для public:

```sh
docker compose -f docker-compose.public.yml up --build -d
```

Для private:

```sh
docker compose -f docker-compose.public.yml up --build -d
```

## Запуск сборки в режиме разработки

### Установите версию [NodeJS](https://nodejs.org/en) не ниже 23 версии

### Установка Зависимостей

```bash
npm i
```

### Запуск приложения для публичного пользования

```bash
npm run dev:public
```

### Запуск приложения для приватного пользования

```bash
npm run dev:private
```
