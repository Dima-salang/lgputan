import { config } from 'dotenv'
import { initTRPC, TRPCError } from '@trpc/server'

config({ path: '.env.local', override: true })
import superjson from 'superjson'
import * as jose from 'jose'
import z from 'zod'
import type { Db } from '../../db'
export interface Context {
  db: Db
  headers: Headers
}

const JWT_SECRET = process.env.JWT_SECRET || ''
const secret = new TextEncoder().encode(JWT_SECRET)

if (!secret.byteLength && process.env.NODE_ENV === 'production') {
  throw new Error('JWT_SECRET is required in production')
}

const t = initTRPC.context<Context>().create({
  transformer: superjson,
})

const payloadSchema = z.object({
  admin: z.boolean(),
})

const adminMiddleware = t.middleware(async ({ ctx, next }) => {
  let token: string | undefined

  const authHeader = ctx.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.slice(7)
  } else {
    const cookieHeader = ctx.headers.get('cookie')
    token = cookieHeader
      ?.split('; ')
      .find((row) => row.startsWith('admin_token='))
      ?.split('=')[1]
  }

  if (!token) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'No token' })
  }

  try {
    const { payload } = await jose.jwtVerify(token, secret)
    const result = payloadSchema.safeParse(payload)
    if (!result.success || !result.data.admin) {
      throw new TRPCError({ code: 'FORBIDDEN' })
    }
    return next()
  } catch (err) {
    if (err instanceof TRPCError) throw err
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid token' })
  }
})

export const createTRPCRouter = t.router
export const publicProcedure = t.procedure
export const protectedProcedure = t.procedure.use(adminMiddleware)
export const createCallerFactory = t.createCallerFactory
