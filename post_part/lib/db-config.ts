// Конфигурация подключения к базе данных
// Этот файл содержит все настройки подключения к БД в одном месте для удобства изменения

export const dbConfig = {
  // Основные параметры подключения
  host: process.env.DB_HOST || "10.40.240.52",
  port: Number.parseInt(process.env.POSTGRES_PORT),
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,

  // Дополнительные параметры
  ssl: process.env.DB_SSL === "true",
  max: Number.parseInt(process.env.DB_POOL_MAX || "20"), // максимальное количество соединений в пуле
  idleTimeoutMillis: Number.parseInt(process.env.DB_IDLE_TIMEOUT || "30000"), // время простоя соединения
  connectionTimeoutMillis: Number.parseInt(process.env.DB_CONNECTION_TIMEOUT || "2000"), // таймаут соединения

  // Строка подключения (формируется автоматически)
  get connectionString() {
    return (
      process.env.DATABASE_URL ||
      `postgresql://${this.user}:${this.password}@${this.host}:${this.port}/${this.database}`
    )
  },
}

// Экспорт функции для получения конфигурации
export function getDbConfig() {
  return dbConfig
}

// Экспорт строки подключения для использования с ORM
export const connectionString = dbConfig.connectionString
