import { type NextRequest, NextResponse } from "next/server"

// Временное хранилище заявок
const tickets: any[] = []

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { status } = await request.json()
    const ticketId = params.id

    const ticketIndex = tickets.findIndex((t) => t.id === ticketId)

    if (ticketIndex === -1) {
      return NextResponse.json({ error: "Заявка не найдена" }, { status: 404 })
    }

    tickets[ticketIndex] = {
      ...tickets[ticketIndex],
      status,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      ticket: tickets[ticketIndex],
    })
  } catch (error) {
    return NextResponse.json({ error: "Ошибка обновления заявки" }, { status: 500 })
  }
}
