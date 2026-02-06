const bcrypt = require("bcrypt")

async function generateHashes() {
  const passwords = {
    "post@example.com": "password",
    "security@example.com": "123456",
    "admin@example.com": "admin123",
    "user@example.com": "user123",
  }

  console.log("🔐 Генерация хэшей паролей...\n")

  const sqlStatements = []

  for (const [email, password] of Object.entries(passwords)) {
    const hash = await bcrypt.hash(password, 12)
    console.log(`${email}: '${password}' -> '${hash}'`)
    sqlStatements.push(`UPDATE accounts SET password_hash = '${hash}' WHERE login = '${email}';`)
  }

  console.log("\n📝 SQL команды для обновления:")
  console.log("=".repeat(80))
  sqlStatements.forEach((sql) => console.log(sql))
  console.log("=".repeat(80))

  console.log("\n✅ Хэши сгенерированы!")
  console.log("💡 Скопируйте SQL команды выше и выполните их в PostgreSQL")
}

generateHashes().catch(console.error)
