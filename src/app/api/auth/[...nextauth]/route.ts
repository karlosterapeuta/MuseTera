import NextAuth from 'next-auth'
import type { AuthOptions, User } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials): Promise<User | null> {
        console.log('Iniciando processo de autenticação')

        if (!credentials?.email || !credentials?.password) {
          console.log('Credenciais ausentes')
          return null
        }

        try {
          console.log('Tentando conectar ao banco de dados...')
          await prisma.$connect()
          console.log('Conexão com banco de dados estabelecida')

          console.log('Buscando usuário:', credentials.email)
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email.toLowerCase().trim()
            }
          })

          if (!user) {
            console.log('Usuário não encontrado')
            return null
          }

          if (!user.password) {
            console.log('Senha não definida para o usuário')
            return null
          }

          const isValid = await bcrypt.compare(credentials.password, user.password)
          
          if (!isValid) {
            console.log('Senha inválida')
            return null
          }

          console.log('Autenticação bem-sucedida')
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image
          }
        } catch (error) {
          console.error('Erro durante autenticação:', error)
          return null
        } finally {
          await prisma.$disconnect()
        }
      }
    })
  ],
  pages: {
    signIn: '/login',
    error: '/login'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id as string
      }
      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET
}

export const { auth, handlers: { GET, POST } } = NextAuth(authOptions)

export { GET, POST }