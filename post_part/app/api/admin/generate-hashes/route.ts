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

    const hashes: Record<string, string> = {}

    for (const [email, password] of Object.entries(passwords)) {
      const hash = await bcrypt.hash(password, 12)
      hashes[email] = hash
    }

    // Генерируем SQL для обновления
    const sqlStatements = Object.entries(hashes)
      .map(([email, hash]) => `UPDATE accounts SET password_hash = '${hash}' WHERE login = '${email}';`)
      .join("\n")

    return NextResponse.json({
      success: true,
      hashes,
      sql: sqlStatements,
      message: "Хэши сгенерированы успешно",
    })
  } catch (error) {
    console.error("Error generating hashes:", error)
    return NextResponse.json({ error: "Ошибка генерации хэшей" }, { status: 500 })
  }
}
