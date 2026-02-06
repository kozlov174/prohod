"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Play, CheckCircle, MoreVertical, Calendar, Hash } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Ticket {
  id: string
  title: string
  description: string
  status: "pending" | "in-progress" | "completed"
  createdAt: string
  qrCode: string
}

interface TicketListProps {
  tickets: Ticket[]
  onTicketUpdate: () => void
}

export default function TicketList({ tickets, onTicketUpdate }: TicketListProps) {
  const [updatingTicket, setUpdatingTicket] = useState<string | null>(null)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "in-progress":
        return <Play className="h-4 w-4" />
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "В ожидании"
      case "in-progress":
        return "В работе"
      case "completed":
        return "Завершено"
      default:
        return "Неизвестно"
    }
  }

  const updateTicketStatus = async (ticketId: string, newStatus: string) => {
    setUpdatingTicket(ticketId)
    try {
      const response = await fetch(`/api/tickets/${ticketId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        onTicketUpdate()
      }
    } catch (error) {
      console.error("Error updating ticket:", error)
    } finally {
      setUpdatingTicket(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (tickets.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-gray-400 mb-4">
            <Hash className="h-12 w-12" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Нет заявок</h3>
          <p className="text-gray-500 text-center">
            Отсканируйте QR код или введите код вручную, чтобы создать первую заявку
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Список заявок</h2>
        <Badge variant="outline">{tickets.length} заявок</Badge>
      </div>

      <div className="space-y-3">
        {tickets.map((ticket) => (
          <Card key={ticket.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-base font-medium mb-2">{ticket.title}</CardTitle>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(ticket.createdAt)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Hash className="h-3 w-3" />
                      {ticket.qrCode}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(ticket.status)}>
                    {getStatusIcon(ticket.status)}
                    <span className="ml-1">{getStatusText(ticket.status)}</span>
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" disabled={updatingTicket === ticket.id}>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {ticket.status !== "in-progress" && (
                        <DropdownMenuItem onClick={() => updateTicketStatus(ticket.id, "in-progress")}>
                          <Play className="h-4 w-4 mr-2" />
                          Взять в работу
                        </DropdownMenuItem>
                      )}
                      {ticket.status !== "completed" && (
                        <DropdownMenuItem onClick={() => updateTicketStatus(ticket.id, "completed")}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Завершить
                        </DropdownMenuItem>
                      )}
                      {ticket.status !== "pending" && (
                        <DropdownMenuItem onClick={() => updateTicketStatus(ticket.id, "pending")}>
                          <Clock className="h-4 w-4 mr-2" />
                          Вернуть в ожидание
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            {ticket.description && (
              <CardContent className="pt-0">
                <p className="text-sm text-gray-600">{ticket.description}</p>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
