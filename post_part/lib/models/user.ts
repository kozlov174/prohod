import { query } from "../db"
import type { RoleEnum, User } from "./types"

// Функции для работы с пользователями

export async function getUserById(id: string): Promise<User | null> {
  try {
    const result = await query("SELECT * FROM users WHERE id = $1", [id])
    return result.rows.length > 0 ? result.rows[0] : null
  } catch (error) {
    console.error("Error getting user by id:", error)
    return null
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const result = await query("SELECT * FROM users WHERE user_email = $1", [email])
    return result.rows.length > 0 ? result.rows[0] : null
  } catch (error) {
    console.error("Error getting user by email:", error)
    return null
  }
}

export async function getUsersByRole(role: RoleEnum): Promise<User[]> {
  try {
    const result = await query("SELECT * FROM users WHERE role = $1", [role])
    return result.rows
  } catch (error) {
    console.error("Error getting users by role:", error)
    return []
  }
}

export async function createUser(user: Omit<User, "id">): Promise<User | null> {
  try {
    const result = await query(
      `
      INSERT INTO users (name, surname, user_email, role)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `,
      [user.name, user.surname, user.user_email, user.role],
    )

    return result.rows[0]
  } catch (error) {
    console.error("Error creating user:", error)
    return null
  }
}

export async function updateUser(id: string, user: Partial<User>): Promise<User | null> {
  try {
    // Формируем динамический запрос на обновление только переданных полей
    const fields: string[] = []
    const values: any[] = []
    let paramIndex = 1

    if (user.name !== undefined) {
      fields.push(`name = $${paramIndex++}`)
      values.push(user.name)
    }

    if (user.surname !== undefined) {
      fields.push(`surname = $${paramIndex++}`)
      values.push(user.surname)
    }

    if (user.user_email !== undefined) {
      fields.push(`user_email = $${paramIndex++}`)
      values.push(user.user_email)
    }

    if (user.role !== undefined) {
      fields.push(`role = $${paramIndex++}`)
      values.push(user.role)
    }

    if (fields.length === 0) return null

    values.push(id)

    const result = await query(
      `
      UPDATE users
      SET ${fields.join(", ")}
      WHERE id = $${paramIndex}
      RETURNING *
    `,
      values,
    )

    return result.rows.length > 0 ? result.rows[0] : null
  } catch (error) {
    console.error("Error updating user:", error)
    return null
  }
}

export async function deleteUser(id: string): Promise<boolean> {
  try {
    const result = await query("DELETE FROM users WHERE id = $1 RETURNING id", [id])
    return result.rows.length > 0
  } catch (error) {
    console.error("Error deleting user:", error)
    return false
  }
}
