import { describe, it, expect } from 'vitest'
import jwt from 'jsonwebtoken'
import { authRouter } from '#/server/admin'
import {
  createCallerFactory,
  createTRPCRouter,
  type Context,
} from '#/integrations/trpc/init'
import { TRPCError } from '@trpc/server'

const TEST_PASSWORD = 'admin'
const TEST_JWT_SECRET = 'dev-secret-key-change-in-production'
const TEST_TOKEN_EXPIRY = '15m'

function createTestToken() {
  return jwt.sign({ admin: true }, TEST_JWT_SECRET, {
    expiresIn: TEST_TOKEN_EXPIRY,
  })
}

describe('authRouter', () => {
  const createCaller = (ctx: Context) =>
    createCallerFactory(createTRPCRouter(authRouter))(ctx)

  describe('login', () => {
    it('returns token for valid password', async () => {
      const caller = createCaller({ db: {} as any, headers: new Headers() })
      const result = await caller.login({ password: TEST_PASSWORD })
      expect(result.token).toBeDefined()
    })

    it('throws TRPCError for invalid password', async () => {
      const caller = createCaller({ db: {} as any, headers: new Headers() })
      await expect(
        caller.login({ password: 'wrong-password' }),
      ).rejects.toThrow(TRPCError)
    })
  })

  describe('verify', () => {
    it('returns valid: true for protected procedure', async () => {
      const token = createTestToken()
      const caller = createCaller({
        db: {} as any,
        headers: new Headers({ authorization: `Bearer ${token}` }),
      })
      const result = await caller.verify()
      expect(result.valid).toBe(true)
    })
  })
})
