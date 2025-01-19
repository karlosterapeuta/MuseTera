'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

type ToastProps = {
  message: string
  type?: 'success' | 'error' | 'info'
  duration?: number
}

const Toast = ({ message, type = 'info', duration = 3000 }: ToastProps) => {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
    }, duration)

    return () => clearTimeout(timer)
  }, [duration])

  if (!visible) return null

  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500'
  }[type]

  const toast = (
    <div 
      className="absolute top-0 right-0 w-full flex justify-end p-4 pointer-events-none"
      style={{ zIndex: 9999 }}
    >
      <div className={`max-w-sm p-4 rounded-md text-white ${bgColor} shadow-lg transition-opacity pointer-events-auto`}>
        {message}
      </div>
    </div>
  )

  // Usar createPortal para renderizar o toast no final do body
  if (typeof window !== 'undefined') {
    return createPortal(toast, document.body)
  }

  return null
}

export const Toaster = () => {
  return null // Placeholder para manter compatibilidade com a API anterior
}

export const toast = {
  success: (message: string) => {
    // Implementação simplificada
    console.log('Success:', message)
  },
  error: (message: string) => {
    // Implementação simplificada
    console.error('Error:', message)
  }
}
