import { initTRPC, TRPCError } from '@trpc/server'
import superjson from 'superjson'
import jwt from 'jsonwebtoken'
import z from 'zod'
import type { Db } from '../../db'

export interface Context {
  db: Db
  headers: Headers
}

const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is required but not set in environment')
}

const t = initTRPC.context<Context>().create({
  transformer: superjson,
})

const payloadSchema = z.object({
  admin: z.boolean(),
})

const adminMiddleware = t.middleware(async ({ ctx, next }) => {
  const authHeader = ctx.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'No token provided' })
  }
  const token = authHeader.slice(7)
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    const result = payloadSchema.safeParse(decoded)
    if (!result.success || !result.data.admin) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Admin access required',
      })
    }
    return next()
  } catch (err) {
    if (err instanceof TRPCError) throw err
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid token' })
  }
})

const isAuthed = t.procedure.use(adminMiddleware)

export const createTRPCRouter = t.router
export const publicProcedure = t.procedure
export const protectedProcedure = isAuthed
export const createCallerFactory = t.createCallerFactory
