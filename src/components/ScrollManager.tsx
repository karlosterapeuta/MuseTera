'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function ScrollManager() {
  const pathname = usePathname()

  useEffect(() => {
    // Desabilita o scroll automático
    if (history.scrollRestoration) {
      history.scrollRestoration = 'manual'
    }

    // Reseta o scroll quando a rota muda
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
