import { type NextRequest, NextResponse } from "next/server"
import { getVisitRequestWithFormById } from "@/lib/models/visit-request"
import { getVisitLogByRequestId } from "@/lib/models/visit-log"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const requestId = params.id

    // Поиск заявки по ID с данными формы
    const visitRequest = await getVisitRequestWithFormById(requestId)

    if (!visitRequest) {
      return NextResponse.json({ error: "Заявка не найдена" }, { status: 404 })
    }

    // Поиск лога посещения
    const visitLog = await getVisitLogByRequestId(requestId)

    // Объединение данных
    const result = {
      ...visitRequest,
      visit_log: visitLog || null,
    }

    return NextResponse.json({
      success: true,
      visitRequest: result,
    })
  } catch (error) {
    console.error("Error fetching visit request:", error)
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 })
  }
}
