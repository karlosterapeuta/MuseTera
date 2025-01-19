'use client'

import { useEffect, useState } from 'react'

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

  return (
    <div className={`fixed top-4 right-4 p-4 rounded-md text-white ${bgColor} shadow-lg transition-opacity`}>
      {message}
    </div>
  )
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
