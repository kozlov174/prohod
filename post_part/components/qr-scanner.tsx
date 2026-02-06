"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Camera, Type } from "lucide-react"

interface QRScannerProps {
  onScan: (data: string) => void
}

export default function QRScanner({ onScan }: QRScannerProps) {
  const [manualInput, setManualInput] = useState("")
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState("")
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const startCamera = async () => {
    try {
      setError("")
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        setIsScanning(true)
      }
    } catch (err) {
      setError("Не удалось получить доступ к камере")
      console.error("Camera error:", err)
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    setIsScanning(false)
  }

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (manualInput.trim()) {
      onScan(manualInput.trim())
      setManualInput("")
    }
  }

  const simulateQRScan = () => {
    // Симуляция сканирования QR кода для демонстрации
    const mockQRData = `QR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    onScan(mockQRData)
  }

  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  return (
    <div className="space-y-4">
      <div className="text-center">
        <Button
          onClick={isScanning ? stopCamera : startCamera}
          variant={isScanning ? "destructive" : "default"}
          className="w-full mb-4"
        >
          <Camera className="h-4 w-4 mr-2" />
          {isScanning ? "Остановить камеру" : "Включить камеру"}
        </Button>

        {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

        {isScanning && (
          <div className="relative">
            <video ref={videoRef} autoPlay playsInline className="w-full h-48 bg-black rounded-lg" />
            <div className="absolute inset-0 border-2 border-blue-500 rounded-lg pointer-events-none">
              <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-blue-500"></div>
              <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-blue-500"></div>
              <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-blue-500"></div>
              <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-blue-500"></div>
            </div>
          </div>
        )}

        {/* Кнопка для симуляции сканирования */}
        <Button onClick={simulateQRScan} variant="outline" className="w-full mt-2 bg-transparent">
          Симулировать сканирование QR
        </Button>
      </div>

      <div className="border-t pt-4">
        <form onSubmit={handleManualSubmit} className="space-y-3">
          <Label htmlFor="manual-input" className="flex items-center">
            <Type className="h-4 w-4 mr-2" />
            Ручной ввод кода
          </Label>
          <div className="flex gap-2">
            <Input
              id="manual-input"
              type="text"
              placeholder="Введите код вручную"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
            />
            <Button type="submit" disabled={!manualInput.trim()}>
              Добавить
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
