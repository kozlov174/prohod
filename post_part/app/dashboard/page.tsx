"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Search,
  User,
  Calendar,
  FileText,
  AlertCircle,
  LogOut,
  LogIn,
  Clock,
  CheckCircle,
  Users,
  UserCheck,
} from "lucide-react"
import { VisitRequestStatusEnum } from "@/lib/models/types"

// Функции для форматирования данных
const formatFullName = (fullName: string) => {
  const parts = fullName.split(" ")
  if (parts.length >= 3) {
    return `${parts[0]} ${parts[1]} ${parts[2].charAt(0)}.`
  }
  return fullName
}

const formatPassportSeries = (series: string) => {
  if (series.length >= 2) {
    return series.substring(0, 2) + "**"
  }
  return series
}

const formatPassportNumber = (number: string) => {
  if (number.length >= 6) {
    return "****" + number.slice(-2)
  }
  return number
}

// Функция для проверки, что дата визита - сегодня
const isVisitToday = (visitTime: string): boolean => {
  const visitDate = new Date(visitTime)
  const today = new Date()

  return (
    visitDate.getFullYear() === today.getFullYear() &&
    visitDate.getMonth() === today.getMonth() &&
    visitDate.getDate() === today.getDate()
  )
}

// Функция для получения даты без времени
const formatDateOnly = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

interface UserData {
  id: string
  name: string
  surname: string
  user_email: string
  role: string
}

interface FormData {
  id: string
  passport_full_name: string
  passport_series: string
  passport_number: string
  passport_who_issued: string
  passport_issue_date: string
  passport_photo: string
  visit_time: string
  visit_reason: string
  email_to_send_reply: string
}

interface VisitLog {
  id: string
  entry_time: string | null
  exit_time: string | null
  post_user_id: string
  notes: string | null
}

interface VisitRequestData {
  id: string
  form_id: string
  status: string
  rejection_reason?: string
  form: FormData
  visit_log: VisitLog | null
}

export default function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [requestNumber, setRequestNumber] = useState("")
  const [visitRequest, setVisitRequest] = useState<VisitRequestData | null>(null)
  const [searchLoading, setSearchLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [approvedRequests, setApprovedRequests] = useState<VisitRequestData[]>([])
  const [insideRequests, setInsideRequests] = useState<VisitRequestData[]>([])
  const [listsLoading, setListsLoading] = useState(false)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  // Добавляем состояния для поиска в списках
  const [approvedSearchQuery, setApprovedSearchQuery] = useState("")
  const [insideSearchQuery, setInsideSearchQuery] = useState("")

  // Добавляем функции фильтрации
  const filterRequestsByName = (requests: VisitRequestData[], searchQuery: string) => {
    if (!searchQuery.trim()) return requests

    const query = searchQuery.toLowerCase().trim()
    return requests.filter((request) => {
      const fullName = request.form.passport_full_name.toLowerCase()
      return fullName.includes(query)
    })
  }

  // Обновляем отфильтрованные списки
  const filteredApprovedRequests = filterRequestsByName(approvedRequests, approvedSearchQuery)
  const filteredInsideRequests = filterRequestsByName(insideRequests, insideSearchQuery)

  // Проверка сессии
  useEffect(() => {
    const checkSession = () => {
      const token = localStorage.getItem("authToken")
      const userDataStr = localStorage.getItem("userData")

      if (!token || !userDataStr) {
        router.push("/")
        return
      }

      try {
        const user = JSON.parse(userDataStr) as UserData

        if (user.role !== "post") {
          localStorage.removeItem("authToken")
          localStorage.removeItem("userData")
          router.push("/")
          return
        }

        setUserData(user)
        setIsAuthenticated(true)
        setIsLoading(false)

        if (!inputRef.current?.matches(":focus")) {
          setTimeout(() => {
            if (inputRef.current) {
              inputRef.current.focus()
            }
          }, 100)
        }
      } catch (error) {
        localStorage.removeItem("authToken")
        localStorage.removeItem("userData")
        router.push("/")
      }
    }

    // Проверяем сессию сразу
    checkSession()
  }, [router])

  // Загрузка списков заявок
  const loadRequestLists = async () => {
    console.log("[v0] Loading request lists from client...")
    setListsLoading(true)
    try {
      const response = await fetch("/api/visit-requests/lists", {
        cache: "no-store",
      })
      const data = await response.json()

      if (response.ok) {
        console.log("[v0] Lists loaded:", {
          approved: data.approved?.length,
          inside: data.inside?.length,
        })
        console.log("[v0] Inside data:", data.inside)
        setApprovedRequests(data.approved || [])
        setInsideRequests(data.inside || [])
      }
    } catch (error) {
      console.error("[v0] Error loading request lists:", error)
    } finally {
      setListsLoading(false)
    }
  }

  // Загружаем списки при монтировании компонента
  useEffect(() => {
    if (isAuthenticated) {
      loadRequestLists()

      // Обновляем списки каждые 30 секунд
      const interval = setInterval(loadRequestLists, 30000)
      return () => clearInterval(interval)
    }
  }, [isAuthenticated])

  const handleLogout = () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("userData")
    router.push("/")
  }

  const handleSearch = async () => {
    if (!requestNumber.trim()) {
      setError("Введите номер заявки")
      return
    }

    const searchQuery = requestNumber.trim()
    setSearchLoading(true)
    setError("")
    setSuccessMessage("")
    setVisitRequest(null)

    try {
      const response = await fetch(`/api/visit-requests/${searchQuery}`)
      const data = await response.json()

      if (response.ok) {
        setVisitRequest(data.visitRequest)
        setRequestNumber("")
        if (inputRef.current) {
          inputRef.current.focus()
        }
      } else {
        setError(data.error || "Заявка не найдена")
      }
    } catch (error) {
      setError("Ошибка при поиске заявки")
    } finally {
      setSearchLoading(false)
    }
  }

  const handleVisitAction = async (actionType: "entry" | "exit") => {
    if (!visitRequest) return

    // Проверяем возможность выполнения действия
    // Адаптируем проверку под новый статус accept вместо approved
    if (visitRequest.status !== VisitRequestStatusEnum.accept) {
      setError("Действие доступно только для одобренных заявок")
      return
    }

    const canEntry = !visitRequest.visit_log?.entry_time
    const canExit = visitRequest.visit_log?.entry_time && !visitRequest.visit_log?.exit_time

    if (actionType === "entry" && !canEntry) {
      setError("Вход уже был зафиксирован для этой заявки")
      return
    }

    if (actionType === "exit" && !canExit) {
      setError("Сначала необходимо зафиксировать вход или выход уже был зафиксирован")
      return
    }

    setActionLoading(true)
    setError("")
    setSuccessMessage("")

    try {
      console.log("[v0] Recording visit action:", { actionType, requestId: visitRequest.id })

      const response = await fetch("/api/visit-logs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          visit_request_id: visitRequest.id,
          action_type: actionType,
          post_user_id: userData?.id,
        }),
      })

      const data = await response.json()
      console.log("[v0] Visit action response:", data)

      if (response.ok) {
        setSuccessMessage(
          actionType === "entry"
            ? `✅ ВХОД зафиксирован в ${new Date().toLocaleTimeString("ru-RU")}`
            : `✅ ВЫХОД зафиксирован в ${new Date().toLocaleTimeString("ru-RU")}`,
        )

        console.log("[v0] Updating visit request data...")
        // Обновляем данные заявки
        const updatedResponse = await fetch(`/api/visit-requests/${visitRequest.id}`)
        const updatedData = await updatedResponse.json()
        if (updatedResponse.ok) {
          console.log("[v0] Visit request updated:", updatedData.visitRequest)
          setVisitRequest(updatedData.visitRequest)
        }

        console.log("[v0] Reloading request lists...")
        // Обновляем списки заявок
        await loadRequestLists()

        // Сбрасываем заявку через 3 секунды для следующего поиска
        setTimeout(() => {
          setVisitRequest(null)
          setSuccessMessage("")
          if (inputRef.current) {
            inputRef.current.focus()
          }
        }, 3000)
      } else {
        console.error("[v0] Error response:", data)
        setError(data.error || "Ошибка при записи действия")
      }
    } catch (error) {
      console.error("[v0] Error in handleVisitAction:", error)
      setError("Ошибка при записи действия")
    } finally {
      setActionLoading(false)
    }
  }

  const handleQuickAction = async (requestId: string, actionType: "entry" | "exit", visitTime: string) => {
    // Проверяем дату для входа
    if (actionType === "entry" && !isVisitToday(visitTime)) {
      setError(`Вход можно зафиксировать только в день визита (${formatDateOnly(visitTime)})`)
      setTimeout(() => setError(""), 5000)
      return
    }

    try {
      const response = await fetch("/api/visit-logs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          visit_request_id: requestId,
          action_type: actionType,
          post_user_id: userData?.id,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // Обновляем списки заявок
        loadRequestLists()
      } else {
        setError(data.error || "Ошибка при выполнении действия")
        setTimeout(() => setError(""), 5000)
      }
    } catch (error) {
      console.error("Error performing quick action:", error)
      setError("Ошибка при выполнении действия")
      setTimeout(() => setError(""), 5000)
    }
  }

  const handleViewRequest = async (requestId: string) => {
    router.push(`/requests/${requestId}`)
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case VisitRequestStatusEnum.not_processed:
        return "Не обработана"
      case VisitRequestStatusEnum.accept:
        return "Одобрена"
      case VisitRequestStatusEnum.reject:
        return "Отклонена"
      default:
        return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case VisitRequestStatusEnum.not_processed:
        return "bg-yellow-100 text-yellow-800"
      case VisitRequestStatusEnum.accept:
        return "bg-green-100 text-green-800"
      case VisitRequestStatusEnum.reject:
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
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

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleClear = () => {
    setRequestNumber("")
    setVisitRequest(null)
    setError("")
    setSuccessMessage("")
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const canEntry = () => {
    if (!visitRequest) return false

    // Проверяем статус, отсутствие входа И что дата визита - сегодня
    return (
      visitRequest.status === VisitRequestStatusEnum.accept &&
      !visitRequest?.visit_log?.entry_time &&
      isVisitToday(visitRequest.form.visit_time)
    )
  }

  const canExit = () => {
    if (!visitRequest) return false

    // Выход можно зафиксировать независимо от даты, если был вход
    return (
      visitRequest.status === VisitRequestStatusEnum.accept &&
      visitRequest?.visit_log?.entry_time &&
      !visitRequest?.visit_log?.exit_time
    )
  }

  const getVisitStatus = () => {
    if (!visitRequest?.visit_log) return "Не было входа"
    if (visitRequest.visit_log.entry_time && !visitRequest.visit_log.exit_time) return "Находится внутри"
    if (visitRequest.visit_log.entry_time && visitRequest.visit_log.exit_time) return "Визит завершен"
    return "Неизвестно"
  }

  const getVisitStatusColor = () => {
    if (!visitRequest?.visit_log) return "bg-gray-100 text-gray-800"
    if (visitRequest.visit_log.entry_time && !visitRequest.visit_log.exit_time) return "bg-blue-100 text-blue-800"
    if (visitRequest.visit_log.entry_time && visitRequest.visit_log.exit_time) return "bg-green-100 text-green-800"
    return "bg-gray-100 text-gray-800"
  }

  const canQuickEntry = (request: VisitRequestData) => {
    // Проверяем: дата сегодня И нет записи о входе
    return isVisitToday(request.form.visit_time) && !request.visit_log?.entry_time
  }

  const canQuickExit = (request: VisitRequestData) => {
    return Boolean(request.visit_log?.entry_time && !request.visit_log?.exit_time)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!isAuthenticated || !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Система заявок на посещение</h1>
                <p className="text-sm text-gray-500">
                  Пост: {userData.name} {userData.surname}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Роль: {userData.role.toUpperCase()}
              </Badge>
              <Button onClick={handleLogout} variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Выйти
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="search" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="search" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Поиск заявки
            </TabsTrigger>
            <TabsTrigger value="approved" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Одобренные ({approvedSearchQuery ? filteredApprovedRequests.length : approvedRequests.length})
            </TabsTrigger>
            <TabsTrigger value="inside" className="flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              Внутри ({insideSearchQuery ? filteredInsideRequests.length : insideRequests.length})
            </TabsTrigger>
          </TabsList>

          {/* Вкладка поиска */}
          <TabsContent value="search">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-280px)]">
              {/* Левая панель - поиск заявки */}
              <div className="space-y-6">
                <Card className="h-fit">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Search className="h-5 w-5 mr-2" />
                      Поиск заявки
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="request-number">Номер заявки</Label>
                      <div className="flex gap-2">
                        <Input
                          ref={inputRef}
                          id="request-number"
                          type="text"
                          placeholder="Введите номер заявки"
                          value={requestNumber}
                          onChange={(e) => setRequestNumber(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                          className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          autoComplete="off"
                        />
                        <Button onClick={handleSearch} disabled={!requestNumber.trim() || searchLoading}>
                          {searchLoading ? "Поиск..." : "Найти"}
                        </Button>
                        {(requestNumber || visitRequest) && (
                          <Button onClick={handleClear} variant="outline" size="icon">
                            ×
                          </Button>
                        )}
                      </div>
                    </div>

                    {error && (
                      <div className="flex items-center gap-2 text-red-600 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        {error}
                      </div>
                    )}

                    {successMessage && (
                      <div className="flex items-center gap-2 text-green-600 text-sm">
                        <CheckCircle className="h-4 w-4" />
                        {successMessage}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Панель действий - показывается только когда заявка найдена */}
                {visitRequest && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Clock className="h-5 w-5 mr-2" />
                        Выберите действие
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <Button
                          onClick={() => handleVisitAction("entry")}
                          disabled={!canEntry() || actionLoading}
                          variant="default"
                          size="lg"
                          className="h-16 text-lg font-semibold"
                          title={
                            !isVisitToday(visitRequest?.form.visit_time || "")
                              ? `Вход доступен только в день визита (${formatDateOnly(visitRequest?.form.visit_time || "")})`
                              : undefined
                          }
                        >
                          <LogIn className="h-6 w-6 mr-2 text-green-600" />
                          ВХОД
                        </Button>
                        <Button
                          onClick={() => handleVisitAction("exit")}
                          disabled={!canExit() || actionLoading}
                          variant="destructive"
                          size="lg"
                          className="h-16 text-lg font-semibold"
                        >
                          <LogOut className="h-6 w-6 mr-2 text-white" />
                          ВЫХОД
                        </Button>
                      </div>

                      {actionLoading && (
                        <div className="text-center p-2 bg-blue-50 rounded-md">
                          <p className="text-sm text-blue-700 font-medium">Обработка действия...</p>
                        </div>
                      )}

                      {/* Статус посещения */}
                      <div className="pt-2">
                        <Label className="text-sm font-medium text-gray-500">Статус посещения</Label>
                        <div className="mt-1">
                          <Badge className={getVisitStatusColor()}>{getVisitStatus()}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Инструкция */}
                <Card>
                  <CardHeader>
                    <CardTitle>Инструкция</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-gray-600 space-y-2">
                    <p>1. Введите номер заявки в поле выше</p>
                    <p>2. Нажмите "Найти" или Enter</p>
                    <p>3. Просмотрите информацию о заявке</p>
                    <p>4. Выберите действие: ВХОД или ВЫХОД</p>
                  </CardContent>
                </Card>
              </div>

              {/* Правая панель - информация о заявке */}
              <div>
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center">
                        <User className="h-5 w-5 mr-2" />
                        Информация о заявке
                      </span>
                      {visitRequest && (
                        <Badge className={getStatusColor(visitRequest.status)}>
                          {getStatusText(visitRequest.status)}
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {!visitRequest && !searchLoading && (
                      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                        <FileText className="h-16 w-16 mb-4 text-gray-300" />
                        <p className="text-lg font-medium">Заявка не выбрана</p>
                        <p className="text-sm">Введите номер заявки для поиска</p>
                      </div>
                    )}

                    {searchLoading && (
                      <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      </div>
                    )}

                    {visitRequest && (
                      <div className="space-y-6">
                        {/* Основная информация */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-medium text-gray-500">Номер заявки</Label>
                            <p className="text-lg font-mono">{visitRequest.id}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-500">Статус</Label>
                            <div className="mt-1">
                              <Badge className={getStatusColor(visitRequest.status)}>
                                {getStatusText(visitRequest.status)}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <hr />

                        {/* Паспортные данные */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold">Паспортные данные</h3>

                          <div>
                            <Label className="text-sm font-medium text-gray-500">ФИО</Label>
                            <p className="text-lg">{formatFullName(visitRequest.form.passport_full_name)}</p>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-medium text-gray-500">Серия паспорта</Label>
                              <p className="text-lg font-mono">
                                {formatPassportSeries(visitRequest.form.passport_series)}
                              </p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-500">Номер паспорта</Label>
                              <p className="text-lg font-mono">
                                {formatPassportNumber(visitRequest.form.passport_number)}
                              </p>
                            </div>
                          </div>
                        </div>

                        <hr />

                        {/* Информация о визите */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold flex items-center">
                            <Calendar className="h-5 w-5 mr-2" />
                            Информация о визите
                          </h3>

                          <div>
                            <Label className="text-sm font-medium text-gray-500">Время визита</Label>
                            <p className="text-lg font-semibold text-blue-600">
                              {formatDate(visitRequest.form.visit_time)}
                            </p>
                            {!isVisitToday(visitRequest.form.visit_time) && (
                              <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                                <p className="text-sm text-yellow-800 flex items-center">
                                  <AlertCircle className="h-4 w-4 mr-2" />
                                  <strong>Внимание:</strong> Дата визита: {formatDateOnly(visitRequest.form.visit_time)}
                                  {new Date(visitRequest.form.visit_time) > new Date()
                                    ? " (будущая дата)"
                                    : " (прошедшая дата)"}
                                </p>
                                <p className="text-xs text-yellow-700 mt-1">
                                  Вход можно зафиксировать только в день визита
                                </p>
                              </div>
                            )}
                            {isVisitToday(visitRequest.form.visit_time) && (
                              <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
                                <p className="text-sm text-green-800 flex items-center">
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Визит запланирован на сегодня
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        {visitRequest.rejection_reason && (
                          <>
                            <hr />
                            <div>
                              <Label className="text-sm font-medium text-red-600">Причина отклонения</Label>
                              <p className="text-base text-red-700 bg-red-50 p-3 rounded-md mt-1">
                                {visitRequest.rejection_reason}
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Вкладка одобренных заявок */}
          <TabsContent value="approved">
            <CardContent>
              {/* Поиск по одобренным заявкам */}
              <div className="mb-4">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Поиск по фамилии или имени..."
                      value={approvedSearchQuery}
                      onChange={(e) => setApprovedSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  {approvedSearchQuery && (
                    <Button onClick={() => setApprovedSearchQuery("")} variant="outline" size="icon">
                      ×
                    </Button>
                  )}
                </div>
                {approvedSearchQuery && (
                  <p className="text-sm text-gray-500 mt-2">
                    Найдено: {filteredApprovedRequests.length} из {approvedRequests.length} заявок
                  </p>
                )}
              </div>

              {listsLoading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : filteredApprovedRequests.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                  <Users className="h-12 w-12 mb-2 text-gray-300" />
                  {approvedSearchQuery ? (
                    <>
                      <p className="text-lg font-medium">Ничего не найдено</p>
                      <p className="text-sm">Попробуйте изменить поисковый запрос</p>
                    </>
                  ) : (
                    <p className="text-lg font-medium">Нет одобренных заявок</p>
                  )}
                </div>
              ) : (
                <ScrollArea className="h-[calc(100vh-420px)]">
                  <div className="space-y-3">
                    {filteredApprovedRequests.map((request) => (
                      <div key={request.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-4 mb-2">
                              <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{request.id}</span>
                              <Badge className="bg-green-100 text-green-800">Одобрена</Badge>
                            </div>
                            <p className="font-medium text-lg">{formatFullName(request.form.passport_full_name)}</p>
                            <p className="text-sm text-gray-600">Время визита: {formatDate(request.form.visit_time)}</p>
                            {!isVisitToday(request.form.visit_time) && (
                              <p className="text-sm text-orange-600 font-medium">
                                ⚠️ Визит назначен на {formatDateOnly(request.form.visit_time)}
                              </p>
                            )}
                            <p className="text-sm text-gray-600">
                              Паспорт: {formatPassportSeries(request.form.passport_series)}{" "}
                              {formatPassportNumber(request.form.passport_number)}
                            </p>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Button
                              onClick={() => handleQuickAction(request.id, "entry", request.form.visit_time)}
                              variant="default"
                              size="sm"
                              className="w-20"
                              disabled={!canQuickEntry(request)}
                              title={
                                !isVisitToday(request.form.visit_time)
                                  ? `Вход доступен только в день визита (${formatDateOnly(request.form.visit_time)})`
                                  : request.visit_log?.entry_time
                                    ? "Вход уже зафиксирован"
                                    : "Зафиксировать вход"
                              }
                            >
                              <LogIn className="h-4 w-4 mr-1" />
                              Вход
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </TabsContent>

          {/* Вкладка посетителей внутри */}
          <TabsContent value="inside">
            <CardContent>
              {/* Поиск по посетителям внутри */}
              <div className="mb-4">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Поиск по фамилии или имени..."
                      value={insideSearchQuery}
                      onChange={(e) => setInsideSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  {insideSearchQuery && (
                    <Button onClick={() => setInsideSearchQuery("")} variant="outline" size="icon">
                      ×
                    </Button>
                  )}
                </div>
                {insideSearchQuery && (
                  <p className="text-sm text-gray-500 mt-2">
                    Найдено: {filteredInsideRequests.length} из {insideRequests.length} человек
                  </p>
                )}
              </div>

              {listsLoading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : filteredInsideRequests.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                  <UserCheck className="h-12 w-12 mb-2 text-gray-300" />
                  {insideSearchQuery ? (
                    <>
                      <p className="text-lg font-medium">Ничего не найдено</p>
                      <p className="text-sm">Попробуйте изменить поисковый запрос</p>
                    </>
                  ) : (
                    <p className="text-lg font-medium">Никого нет внутри</p>
                  )}
                </div>
              ) : (
                <ScrollArea className="h-[calc(100vh-420px)]">
                  <div className="space-y-3">
                    {filteredInsideRequests.map((request) => (
                      <div key={request.id} className="border rounded-lg p-4 bg-blue-50 hover:bg-blue-100">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-4 mb-2">
                              <span className="font-mono text-sm bg-white px-2 py-1 rounded">{request.id}</span>
                              <Badge className="bg-blue-100 text-blue-800">Внутри</Badge>
                            </div>
                            <p className="font-medium text-lg">{formatFullName(request.form.passport_full_name)}</p>
                            <p className="text-sm text-gray-600">
                              Время входа:{" "}
                              {request.visit_log?.entry_time ? formatTime(request.visit_log.entry_time) : "—"}
                            </p>
                            <p className="text-sm text-gray-600">Время визита: {formatDate(request.form.visit_time)}</p>
                            <p className="text-sm text-gray-600">
                              Паспорт: {formatPassportSeries(request.form.passport_series)}{" "}
                              {formatPassportNumber(request.form.passport_number)}
                            </p>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Button
                              onClick={() => handleQuickAction(request.id, "exit", request.form.visit_time)}
                              variant="destructive"
                              size="sm"
                              className="w-20"
                              disabled={!canQuickExit(request)}
                            >
                              <LogOut className="h-4 w-4 mr-1" />
                              Выход
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
