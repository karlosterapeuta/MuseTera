import { PrismaClient as PrismaClientType } from '.prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientType | undefined
}

const prismaClientSingleton = () => {
  return new PrismaClientType({
    log: ['query', 'error', 'warn'],
    errorFormat: 'pretty',
  }).$extends({
    query: {
      async $allOperations({ operation, args, query }) {
        try {
          const result = await query(args)
          return result
        } catch (error: any) {
          console.error(`Database operation failed: ${operation}`, error)
          throw error
        }
      },
    },
  })
}

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma