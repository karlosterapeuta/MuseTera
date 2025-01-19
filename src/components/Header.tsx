'use client'

import { BellIcon, ArrowRightOnRectangleIcon, Bars3Icon } from '@heroicons/react/24/outline'
import { signOut, useSession } from 'next-auth/react'
import { useSidebar } from '@/contexts/SidebarContext'

export default function Header() {
  const { data: session } = useSession()
  const { toggle } = useSidebar()
  
  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' })
  }

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 block"
            onClick={toggle}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>

          <div>
            <h2 className="text-xl font-semibold text-gray-800">MuseTera</h2>
            <p className="text-sm text-gray-500">Bem-vindo, {session?.user?.name || 'Usuário'}!</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <BellIcon className="h-6 w-6 text-gray-600" />
          </button>

          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center">
              {session?.user?.name?.charAt(0) || 'U'}
            </div>
            <div className="text-sm">
              <p className="font-medium text-gray-700">{session?.user?.name || 'Usuário'}</p>
              <p className="text-gray-500">{session?.user?.email}</p>
            </div>
            <div className="h-8 border-l border-gray-200 mx-2"></div>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200 ease-in-out group"
              title="Sair do sistema"
            >
              <span className="text-sm font-medium">Sair</span>
              <ArrowRightOnRectangleIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}