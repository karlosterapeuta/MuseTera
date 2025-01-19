import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/Toast'
import { Providers } from '@/components/providers'
import { ScrollManager } from '@/components/ScrollManager'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'sans-serif']
})

export const metadata = {
  title: 'Sistema de Gerenciamento',
  description: 'Sistema de Gerenciamento para Musicoterapeutas',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="h-full">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.className} h-full`}>
        <Providers>
          <ScrollManager />
          <Toaster />
          {children}
        </Providers>
      </body>
    </html>
  )
}