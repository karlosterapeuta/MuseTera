import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      {children}
    </div>
  )
}
