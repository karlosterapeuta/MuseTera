import { NextResponse } from 'next/server'
import { withAuth } from 'next-auth/middleware'

export default withAuth(
  function middleware(req) {
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
    pages: {
      signIn: '/login',
      signOut: '/login'
    }
  }
)

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/pacientes/:path*',
    '/processos/:path*',
    '/biblioteca/:path*'
  ]
}