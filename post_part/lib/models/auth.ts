import bcrypt from "bcrypt"
import { getUserByEmail } from "./user"
import { RoleEnum } from "./types"
import { mockUsers } from "../mock-data"
import { query } from "../db"

// Безопасная функция для проверки пароля с хэшированием
async function verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  try {
    console.log("🔐 Проверка пароля:")
    console.log("  - Введенный пароль:", plainPassword)
    console.log("  - Хэш из БД:", hashedPassword.substring(0, 20) + "...")
    console.log("  - Это хэш?", hashedPassword.startsWith("$2b$") || hashedPassword.startsWith("$2a$"))

    // Если пароль не хэширован (для обратной совместимости с демо)
    if (!hashedPassword.startsWith("$2b$") && !hashedPassword.startsWith("$2a$")) {
      console.warn("⚠️  ВНИМАНИЕ: Используется небезопасное сравнение паролей!")
      const result = plainPassword === hashedPassword
      console.log("  - Результат простого сравнения:", result)
      return result
    }

    // Безопасное сравнение с хэшем
    const result = await bcrypt.compare(plainPassword, hashedPassword)
    console.log("  - Результат bcrypt.compare:", result)
    return result
  } catch (error) {
    console.error("Password verification error:", error)
    return false
  }
}

// Функция для хэширования пароля
export async function hashPassword(plainPassword: string): Promise<string> {
  const saltRounds = 12
  return await bcrypt.hash(plainPassword, saltRounds)
}

export async function authenticateUser(username: string, password: string) {
  try {
    console.log("🔍 Попытка авторизации:", username)

    // Сначала пытаемся найти пользователя в базе данных
    const user = await getUserByEmail(username)

    if (user) {
      console.log("✅ Пользователь найден в БД:", user.user_email, "роль:", user.role)

      try {
        // Пытаемся получить хэш пароля из таблицы accounts
        const accountResult = await query("SELECT password_hash FROM accounts WHERE associated_user_id = $1", [user.id])

        if (accountResult.rows.length > 0) {
          const hashedPassword = accountResult.rows[0].password_hash
          console.log("🔑 Найден аккаунт в БД")

          const passwordMatch = await verifyPassword(password, hashedPassword)

          if (!passwordMatch) {
            console.log("❌ Пароль не совпадает")
            return { success: false, error: "Неверные учетные данные" }
          }

          console.log("✅ Пароль совпадает")

          // Проверяем роль - доступ только для роли "post"
          if (user.role !== RoleEnum.post) {
            console.log("❌ Неподходящая роль:", user.role)
            return {
              success: false,
              error: "Вам запрещён доступ на данный пост",
              role: user.role,
            }
          }

          console.log("✅ Авторизация успешна")

          const token = `token_${user.id}_${Date.now()}`

          return {
            success: true,
            token,
            user: {
              id: user.id,
              name: user.name,
              surname: user.surname,
              user_email: user.user_email,
              role: user.role,
            },
          }
        } else {
          console.log("❌ Аккаунт не найден в таблице accounts")
        }
      } catch (dbError) {
        console.warn("⚠️ Ошибка БД, переход на mock данные:", dbError)
      }
    } else {
      console.log("❌ Пользователь не найден в БД")
    }

    // Fallback на mock данные при ошибке БД или отсутствии пользователя
    console.log("🔄 Переход на mock данные")
    const mockUser = mockUsers.find((u) => u.user_email === username)
    if (!mockUser) {
      console.log("❌ Пользователь не найден в mock данных")
      return { success: false, error: "Неверные учетные данные" }
    }

    console.log("✅ Пользователь найден в mock данных")
    const passwordMatch = await verifyPassword(password, mockUser.password)
    if (!passwordMatch) {
      console.log("❌ Пароль не совпадает (mock)")
      return { success: false, error: "Неверные учетные данные" }
    }

    // Проверяем роль - доступ только для роли "post"
    if (mockUser.role !== RoleEnum.post) {
      console.log("❌ Неподходящая роль (mock):", mockUser.role)
      return {
        success: false,
        error: "Вам запрещён доступ на данный пост",
        role: mockUser.role,
      }
    }

    console.log("✅ Авторизация успешна (mock)")

    const token = `token_${mockUser.id}_${Date.now()}`

    return {
      success: true,
      token,
      user: {
        id: mockUser.id,
        name: mockUser.name,
        surname: mockUser.surname,
        user_email: mockUser.user_email,
        role: mockUser.role,
      },
    }
  } catch (error) {
    console.error("Authentication error:", error)
    return { success: false, error: "Ошибка сервера" }
  }
}
