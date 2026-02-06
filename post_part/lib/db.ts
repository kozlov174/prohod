import { Pool } from "pg"
import { dbConfig } from "./db-config"

// Создаем пул соединений с базой данных
const pool = new Pool({
  connectionString: dbConfig.connectionString,
  ssl: dbConfig.ssl ? { rejectUnauthorized: false } : undefined,
  max: dbConfig.max,
  idleTimeoutMillis: dbConfig.idleTimeoutMillis,
  connectionTimeoutMillis: dbConfig.connectionTimeoutMillis,
})

// Функция для выполнения SQL-запросов
export async function query(text: string, params?: any[]) {
  const start = Date.now()
  try {
    const res = await pool.query(text, params)
    const duration = Date.now() - start
    console.log("Executed query", { text, duration, rows: res.rowCount })
    return res
  } catch (error) {
    console.error("Error executing query", { text, error })
    throw error
  }
}

// Функция для получения клиента из пула
export async function getClient() {
  const client = await pool.connect()
  const query = client.query
  const release = client.release

  // Перехватываем метод release для логирования
  client.release = () => {
    client.query = query
    client.release = release
    return release.apply(client)
  }

  return client
}

// Функция для проверки соединения с БД
export async function testConnection() {
  try {
    const res = await query("SELECT NOW()")
    return { success: true, timestamp: res.rows[0].now }
  } catch (error) {
    return { success: false, error }
  }
}

// Функция для закрытия пула соединений
export async function closePool() {
  await pool.end()
}

// Экспортируем пул для прямого использования при необ��одимости
export { pool }
