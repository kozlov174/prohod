"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import LoginForm from "@/components/login-form"

interface UserData {
  id: string
  name: string
  surname: string
  user_email: string
  role: string
}

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("authToken")
    const userDataStr = localStorage.getItem("userData")

    if (token && userDataStr) {
      try {
        const userData = JSON.parse(userDataStr) as UserData

        // Проверяем роль пользователя
        if (userData.role === "post") {
          setIsAuthenticated(true)
          router.push("/dashboard")
          return
        } else {
          // Если роль не подходит, очищаем данные
          localStorage.removeItem("authToken")
          localStorage.removeItem("userData")
        }
      } catch (error) {
        // Если ошибка парсинга, очищаем данные
        localStorage.removeItem("authToken")
        localStorage.removeItem("userData")
      }
    }

    setIsLoading(false)
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <LoginForm />
    </div>
  )
}
