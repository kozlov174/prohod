import { type NextRequest, NextResponse } from "next/server"
import { recordEntry, recordExit, getVisitLogByRequestId } from "@/lib/models/visit-log"
import { getVisitRequestWithFormById } from "@/lib/models/visit-request"

// Функция для проверки, что дата визита - сегодня
function isVisitToday(visitTime: string): boolean {
  const visitDate = new Date(visitTime)
  const today = new Date()

  // Сравниваем только год, месяц и день
  return (
    visitDate.getFullYear() === today.getFullYear() &&
    visitDate.getMonth() === today.getMonth() &&
    visitDate.getDate() === today.getDate()
  )
}

export async function POST(request: NextRequest) {
  try {
    const { visit_request_id, action_type, post_user_id } = await request.json()

    console.log("[v0] Visit log request:", { visit_request_id, action_type, post_user_id })

    if (!visit_request_id || !action_type || !post_user_id) {
      return NextResponse.json({ error: "Недостаточно данных" }, { status: 400 })
    }

    // Получаем полную информацию о заявке
    const visitRequest = await getVisitRequestWithFormById(visit_request_id)

    if (!visitRequest) {
      return NextResponse.json({ error: "Заявка не найдена" }, { status: 404 })
    }

    // Проверяем, что дата визита - сегодня
    if (!isVisitToday(visitRequest.form.visit_time)) {
      const visitDate = new Date(visitRequest.form.visit_time).toLocaleDateString("ru-RU")
      return NextResponse.json(
        {
          error: `Вход можно зафиксировать только в день визита. Дата визита: ${visitDate}`,
          visitDate: visitDate,
        },
        { status: 403 },
      )
    }

    try {
      let log

      if (action_type === "entry") {
        log = await recordEntry(visit_request_id, post_user_id)
        console.log("[v0] Entry recorded:", log)
        return NextResponse.json({
          success: true,
          log,
          message: "Вход зафиксирован",
        })
      } else if (action_type === "exit") {
        log = await recordExit(visit_request_id, post_user_id)
        console.log("[v0] Exit recorded:", log)
        return NextResponse.json({
          success: true,
          log,
          message: "Выход зафиксирован",
        })
      } else {
        return NextResponse.json({ error: "Неверный тип действия" }, { status: 400 })
      }
    } catch (error: any) {
      console.error("[v0] Error recording visit log:", error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
  } catch (error) {
    console.error("[v0] Error processing visit log:", error)
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const visitRequestId = searchParams.get("visit_request_id")

    if (visitRequestId) {
      const log = await getVisitLogByRequestId(visitRequestId)
      return NextResponse.json({ success: true, log })
    }

    return NextResponse.json({ error: "Требуется параметр visit_request_id" }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 })
  }
}
