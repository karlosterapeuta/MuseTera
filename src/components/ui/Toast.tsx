'use client'

import dynamic from 'next/dynamic'

const Toaster = dynamic(
  () => import('react-hot-toast').then((mod) => mod.Toaster),
  {
    ssr: false,
  }
)

const toast = dynamic(
  () => import('react-hot-toast').then((mod) => mod.toast),
  {
    ssr: false,
  }
)

export { Toaster, toast }
