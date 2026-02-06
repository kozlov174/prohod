import { type NextRequest, NextResponse } from "next/server"
import { authenticateUser } from "@/lib/models/auth"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    const authResult = await authenticateUser(username, password)

    if (!authResult.success) {
      return NextResponse.json(
        { error: authResult.error, role: authResult.role },
        { status: authResult.role ? 403 : 401 },
      )
    }

    return NextResponse.json({
      success: true,
      token: authResult.token,
      expiresAt: authResult.expiresAt,
      user: authResult.user,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 })
  }
}
