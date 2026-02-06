import { NextResponse } from "next/server"
import bcrypt from "bcrypt"

export async function GET() {
  try {
    const passwords = {
      "post@example.com": "password",
      "security@example.com": "123456",
      "admin@example.com": "admin123",
      "user@example.com": "user123",
    }

    const results: Array<{ email: string; password: string; hash: string }> = []
    const sqlStatements: string[] = []

    for (const [email, password] of Object.entries(passwords)) {
      const hash = await bcrypt.hash(password, 12)
      results.push({ email, password, hash })
      sqlStatements.push(`UPDATE accounts SET password_hash = '${hash}' WHERE login = '${email}';`)
    }

    return NextResponse.json({
      success: true,
      results,
      sql: sqlStatements.join("\n"),
      instructions: [
        "1. Скопируйте SQL команды из поля 'sql'",
        "2. Подключитесь к PostgreSQL: docker-compose exec postgres psql -U qr_user -d qr_tickets",
        "3. Вставьте и выполните SQL команды",
        "4. Проверьте результат: SELECT login, LEFT(password_hash, 20) || '...' FROM accounts;",
      ],
    })
  } catch (error) {
    console.error("Error generating hashes:", error)
    return NextResponse.json({ error: "Ошибка генерации хэшей" }, { status: 500 })
  }
}
