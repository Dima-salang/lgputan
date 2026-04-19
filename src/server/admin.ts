import { publicProcedure, protectedProcedure } from '#/integrations/trpc/init'
import { TRPCError } from '@trpc/server'
import { verifyAdminPassword, createToken, loginSchema } from './auth'

const rateLimitStore = new Map<
  string,
  { attempts: number; lockedUntil?: number }
>()
const MAX_ATTEMPTS = 5
const LOCKOUT_MS = 5 * 60 * 1000
const RESPONSE_DELAY_MS = 100

function getClientIp(headers: Headers): string {
  return headers.get('x-forwarded-for') || headers.get('x-real-ip') || 'unknown'
}

function checkRateLimit(ip: string): boolean {
  const record = rateLimitStore.get(ip)
  if (!record) return true
  if (record.lockedUntil && Date.now() < record.lockedUntil) {
    return false
  }
  return true
}

function recordFailedAttempt(ip: string) {
  const record = rateLimitStore.get(ip) || { attempts: 0 }
  record.attempts += 1
  if (record.attempts >= MAX_ATTEMPTS) {
    record.lockedUntil = Date.now() + LOCKOUT_MS
  }
  rateLimitStore.set(ip, record)
}

function resetRateLimit(ip: string) {
  rateLimitStore.set(ip, { attempts: 0 })
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const authRouter = {
  login: publicProcedure.input(loginSchema).mutation(async ({ input, ctx }) => {
    const ip = getClientIp(ctx.headers)

    if (!checkRateLimit(ip)) {
      await delay(RESPONSE_DELAY_MS)
      throw new TRPCError({
        code: 'TOO_MANY_REQUESTS',
        message: 'Too many failed attempts. Please try again later.',
      })
    }

    const isValid = await verifyAdminPassword(input.password)

    if (!isValid) {
      await delay(RESPONSE_DELAY_MS)
      recordFailedAttempt(ip)
      throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid password' })
    }

    resetRateLimit(ip)
    await delay(RESPONSE_DELAY_MS)
    const token = createToken()
    return { token }
  }),

  verify: protectedProcedure.query(async () => {
    return { valid: true }
  }),
}
