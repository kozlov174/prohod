import bcrypt from "bcrypt"
import { getUserByEmail } from "./user"
import { RoleEnum } from "./types"
import { query } from "./database" // Declare the query variable

// Безопасная функция для проверки пароля с хэшированием
async function verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword)
  } catch (error) {
    console.error("Password verification error:", error)
    return false
  }
}

// Функция для хэширования пароля при создании пользователя
export async function hashPassword(plainPassword: string): Promise<string> {
  const saltRounds = 12 // Количество раундов соли
  return await bcrypt.hash(plainPassword, saltRounds)
}

export async function authenticateUserSecure(username: string, password: string) {
  try {
    // Получаем пользователя из БД
    const user = await getUserByEmail(username)

    if (!user) {
      return { success: false, error: "Неверные учетные данные" }
    }

    // Получаем хэш пароля из таблицы accounts
    const accountResult = await query("SELECT password_hash FROM accounts WHERE associated_user_id = $1", [user.id])

    if (accountResult.rows.length === 0) {
      return { success: false, error: "Неверные учетные данные" }
    }

    const hashedPassword = accountResult.rows[0].password_hash

    // Проверяем пароль с хэшем
    const passwordMatch = await verifyPassword(password, hashedPassword)

    if (!passwordMatch) {
      return { success: false, error: "Неверные учетные данные" }
    }

    // Проверяем роль - доступ только для роли "post"
    if (user.role !== RoleEnum.post) {
      return {
        success: false,
        error: "Вам запрещён доступ на данный пост",
        role: user.role,
      }
    }

    // Генерация токена с временной меткой (1 час = 3600000 мс)
    const expirationTime = Date.now() + 3600000 // 1 час
    const token = `token_${user.id}_${Date.now()}`

    return {
      success: true,
      token,
      expiresAt: expirationTime,
      user: {
        id: user.id,
        name: user.name,
        surname: user.surname,
        user_email: user.user_email,
        role: user.role,
      },
    }
  } catch (error) {
    console.error("Authentication error:", error)
    return { success: false, error: "Ошибка сервера" }
  }
}
