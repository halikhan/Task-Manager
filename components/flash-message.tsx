"use client"

import { useEffect, useState } from "react"
import { CheckCircle, AlertTriangle, X } from "lucide-react"

interface FlashMessageProps {
  type: "success" | "error"
  message: string
}

export function FlashMessage({ type, message }: FlashMessageProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 4500)

    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  return (
    <div
      className={`glass-morphism rounded-xl p-4 flex items-center gap-3 shadow-lg ${
        type === "error" ? "border-red-500/20 bg-red-500/10" : "border-green-500/20 bg-green-500/10"
      } fade-in-up`}
    >
      <div className={`flex-shrink-0 ${type === "error" ? "text-red-400" : "text-green-400"}`}>
        {type === "error" ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
      </div>
      <div className="flex-1">
        <div className={`font-semibold ${type === "error" ? "text-red-300" : "text-green-300"}`}>
          {type === "error" ? "Error!" : "Success!"}
        </div>
        <div className="text-slate-300 text-sm">{message}</div>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="flex-shrink-0 text-slate-400 hover:text-slate-300 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
