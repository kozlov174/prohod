import { query } from "../db"
import type { VisitLog } from "./types"

// Создаем таблицу visit_logs, если она не существует
export async function ensureVisitLogsTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS visit_logs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      visit_request_id UUID NOT NULL REFERENCES visit_requests(id) UNIQUE,
      entry_time TIMESTAMP NULL,
      exit_time TIMESTAMP NULL,
      post_user_id UUID REFERENCES users(id),
      notes TEXT
    )
  `)

  // Создаем индексы для оптимизации запросов
  await query(`
    CREATE INDEX IF NOT EXISTS idx_visit_logs_request ON visit_logs(visit_request_id);
    CREATE INDEX IF NOT EXISTS idx_visit_logs_entry_time ON visit_logs(entry_time);
    CREATE INDEX IF NOT EXISTS idx_visit_logs_exit_time ON visit_logs(exit_time);
  `)
}

export async function getVisitLogByRequestId(visitRequestId: string): Promise<VisitLog | null> {
  const result = await query("SELECT * FROM visit_logs WHERE visit_request_id = $1", [visitRequestId])
  return result.rows.length > 0 ? result.rows[0] : null
}

export async function getVisitLogsWithEntry(): Promise<VisitLog[]> {
  const result = await query("SELECT * FROM visit_logs WHERE entry_time IS NOT NULL")
  return result.rows
}

export async function getVisitLogsWithEntryWithoutExit(): Promise<VisitLog[]> {
  const result = await query("SELECT * FROM visit_logs WHERE entry_time IS NOT NULL AND exit_time IS NULL")
  return result.rows
}

export async function recordEntry(visitRequestId: string, postUserId: string): Promise<VisitLog> {
  // Проверяем, существует ли уже запись для этой заявки
  const existingLog = await getVisitLogByRequestId(visitRequestId)

  if (existingLog) {
    // Если запись существует, обновляем время входа
    if (existingLog.entry_time) {
      throw new Error("Вход уже был зафиксирован для этой заявки")
    }

    const result = await query(
      `
      UPDATE visit_logs
      SET entry_time = NOW(), post_user_id = $2
      WHERE visit_request_id = $1
      RETURNING *
    `,
      [visitRequestId, postUserId],
    )

    return result.rows[0]
  } else {
    // Если записи нет, создаем новую
    const result = await query(
      `
      INSERT INTO visit_logs (visit_request_id, entry_time, post_user_id)
      VALUES ($1, NOW(), $2)
      RETURNING *
    `,
      [visitRequestId, postUserId],
    )

    return result.rows[0]
  }
}

export async function recordExit(visitRequestId: string, postUserId: string): Promise<VisitLog> {
  // Проверяем, существует ли запись для этой заявки
  const existingLog = await getVisitLogByRequestId(visitRequestId)

  if (!existingLog) {
    throw new Error("Сначала необходимо зафиксировать вход")
  }

  if (!existingLog.entry_time) {
    throw new Error("Сначала необходимо зафиксировать вход")
  }

  if (existingLog.exit_time) {
    throw new Error("Выход уже был зафиксирован для этой заявки")
  }

  const result = await query(
    `
    UPDATE visit_logs
    SET exit_time = NOW(), post_user_id = $2
    WHERE visit_request_id = $1
    RETURNING *
  `,
    [visitRequestId, postUserId],
  )

  return result.rows[0]
}
