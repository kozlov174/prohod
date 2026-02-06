import { type NextRequest, NextResponse } from "next/server"
import { getVisitRequestWithFormById, getVisitRequestsWithFormByStatus } from "@/lib/models/visit-request"
import { getVisitLogByRequestId, getVisitLogsWithEntryWithoutExit } from "@/lib/models/visit-log"
import { VisitRequestStatusEnum, type VisitRequestWithForm } from "@/lib/models/types"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    console.log("[v0] Loading request lists...")

    // Получаем все одобренные заявки (статус accept в БД)
    const approvedRequests = await getVisitRequestsWithFormByStatus(VisitRequestStatusEnum.accept)
    console.log("[v0] Approved requests count:", approvedRequests.length)

    // Для каждой заявки получаем лог посещения
    const approvedRequestsWithLogs = await Promise.all(
      approvedRequests.map(async (request) => {
        const visitLog = await getVisitLogByRequestId(request.id)
        return {
          ...request,
          visit_log: visitLog || null,
        }
      }),
    )

    console.log("[v0] Approved requests with logs:", approvedRequestsWithLogs.length)

    // Получаем логи с входом, но без выхода
    const logsWithEntryWithoutExit = await getVisitLogsWithEntryWithoutExit()
    console.log("[v0] Logs with entry without exit:", logsWithEntryWithoutExit.length)
    console.log("[v0] Logs data:", logsWithEntryWithoutExit)

    // Получаем заявки для посетителей внутри
    const approvedRequestsMap = new Map<string, VisitRequestWithForm>(
      approvedRequestsWithLogs.map((req) => [req.id, req]),
    )
    const insideRequests: VisitRequestWithForm[] = []

    for (const log of logsWithEntryWithoutExit) {
      let request = approvedRequestsMap.get(log.visit_request_id)

      if (!request) {
        const fetchedRequest = await getVisitRequestWithFormById(log.visit_request_id)
        if (fetchedRequest) {
          request = fetchedRequest
        }
      }

      if (request) {
        insideRequests.push({
          ...request,
          visit_log: log,
        })
      }
    }

    console.log("[v0] Inside requests count:", insideRequests.length)
    console.log(
      "[v0] Inside requests:",
      insideRequests.map((r) => ({ id: r.id, entry: r.visit_log?.entry_time })),
    )

    return NextResponse.json({
      success: true,
      approved: approvedRequestsWithLogs,
      inside: insideRequests,
    })
  } catch (error) {
    console.error("[v0] Error fetching request lists:", error)
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 })
  }
}
