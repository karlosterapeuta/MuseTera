import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/Toast'
import { Providers } from '@/components/providers'
import { LayoutClient } from '@/components/LayoutClient'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Sistema de Gerenciamento',
  description: 'Sistema de Gerenciamento para Musicoterapeutas',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Providers>
          <LayoutClient>
            <Toaster />
            {children}
          </LayoutClient>
        </Providers>
      </body>
    </html>
  )
}