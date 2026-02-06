import { type NextRequest, NextResponse } from "next/server"

// Временное хранилище заявок (в реальном проекте используйте базу данных)
const tickets: any[] = []

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      tickets: tickets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    })
  } catch (error) {
    return NextResponse.json({ error: "Ошибка получения заявок" }, { status: 500 })
  }
}
