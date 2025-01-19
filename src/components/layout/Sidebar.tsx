'use client'

import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import {
  XMarkIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  ArrowRightOnRectangleIcon,
  HomeIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSidebar } from '@/contexts/SidebarContext'
import { signOut } from 'next-auth/react'

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: HomeIcon
  },
  {
    name: 'Profissional-MT',
    href: '/profissional',
    icon: UserGroupIcon
  },
  {
    name: 'Pacientes',
    href: '/pacientes',
    icon: UserGroupIcon
  },
  {
    name: 'Processos',
    href: '/processos',
    icon: ClipboardDocumentListIcon
  },
  {
    name: 'Hawkins',
    href: '/biblioteca',
    icon: BookOpenIcon
  }
]

export function Sidebar() {
  const { isOpen, toggle, close } = useSidebar()
  const pathname = usePathname()

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' })
  }

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  const getItemClass = (isActiveItem: boolean) => {
    return `group flex items-center gap-x-3 rounded-lg p-3 text-base font-semibold leading-7 ${
      isActiveItem
        ? 'bg-indigo-50 text-indigo-600'
        : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50 transition-all duration-200'
    }`
  }

  const getIconClass = (isActiveItem: boolean) => {
    return `h-7 w-7 shrink-0 ${
      isActiveItem
        ? 'text-indigo-600'
        : 'text-gray-500 group-hover:text-indigo-600 transition-colors duration-200'
    }`
  }

  return (
    <>
      {/* Mobile sidebar */}
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog 
          as="div" 
          className="lg:hidden" 
          onClose={close}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="absolute inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="absolute inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
                  <div className="flex h-20 shrink-0 items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Image
                        src="/logo-musicoterapia.png"
                        alt="Logo Musicoterapia"
                        width={40}
                        height={40}
                        className="object-contain"
                      />
                      <h1 className="text-xl font-bold text-indigo-600">MuseTera</h1>
                    </div>
                    <button 
                      onClick={close}
                      className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                    >
                      <XMarkIcon className="h-7 w-7" />
                    </button>
                  </div>
                  <nav className="flex flex-1 flex-col justify-between">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                      {navigation.map((item) => (
                        <li key={item.name}>
                          <Link
                            href={item.href}
                            className={getItemClass(isActive(item.href))}
                            onClick={close}
                          >
                            <item.icon
                              className={getIconClass(isActive(item.href))}
                              aria-hidden="true"
                            />
                            <span>{item.name}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <div className="border-t border-gray-200 pt-4">
                      <button
                        onClick={handleLogout}
                        className="group flex w-full items-center gap-x-3 rounded-lg p-3 text-base font-semibold leading-7 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                      >
                        <ArrowRightOnRectangleIcon className="h-7 w-7 shrink-0 text-gray-500 group-hover:text-red-600 transition-colors duration-200" />
                        <span>Sair</span>
                      </button>
                    </div>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Desktop sidebar */}
      <aside className={`hidden lg:block w-72 xl:w-80 ${isOpen ? 'block' : 'hidden'}`}>
        <div className="flex h-full flex-col gap-y-5 border-r border-gray-200 bg-white px-6 pb-4">
          <div className="flex h-20 shrink-0 items-center justify-between">
            <div className="flex items-center gap-3">
              <Image
                src="/logo-musicoterapia.png"
                alt="Logo Musicoterapia"
                width={40}
                height={40}
                className="object-contain"
              />
              <h1 className="text-xl font-bold text-indigo-600">MuseTera</h1>
            </div>
            <button 
              onClick={close}
              className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              <XMarkIcon className="h-7 w-7" />
            </button>
          </div>
          <nav className="flex flex-1 flex-col justify-between">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={getItemClass(isActive(item.href))}
                  >
                    <item.icon
                      className={getIconClass(isActive(item.href))}
                      aria-hidden="true"
                    />
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="border-t border-gray-200 pt-4">
              <button
                onClick={handleLogout}
                className="group flex w-full items-center gap-x-3 rounded-lg p-3 text-base font-semibold leading-7 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
              >
                <ArrowRightOnRectangleIcon className="h-7 w-7 shrink-0 text-gray-500 group-hover:text-red-600 transition-colors duration-200" />
                <span>Sair</span>
              </button>
            </div>
          </nav>
        </div>
      </aside>
    </>
  )
}