import { type NextRequest, NextResponse } from "next/server"

// Временное хранилище заявок
const tickets: any[] = []

export async function POST(request: NextRequest) {
  try {
    const { qrCode } = await request.json()

    if (!qrCode) {
      return NextResponse.json({ error: "QR код обязателен" }, { status: 400 })
    }

    // Создание новой заявки
    const newTicket = {
      id: `ticket_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: `Заявка по QR коду: ${qrCode.substring(0, 20)}...`,
      description: `Заявка создана автоматически при сканировании QR кода: ${qrCode}`,
      status: "pending",
      createdAt: new Date().toISOString(),
      qrCode: qrCode,
    }

    tickets.push(newTicket)

    return NextResponse.json({
      success: true,
      ticket: newTicket,
    })
  } catch (error) {
    return NextResponse.json({ error: "Ошибка создания заявки" }, { status: 500 })
  }
}
