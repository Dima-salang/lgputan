import { describe, it, expect } from 'vitest'
import jwt from 'jsonwebtoken'
import { authRouter } from '#/server/admin'
import {
  createCallerFactory,
  createTRPCRouter,
  type Context,
} from '#/integrations/trpc/init'
import { TRPCError } from '@trpc/server'
import {
  TEST_PASSWORD,
  TEST_JWT_SECRET,
  TEST_TOKEN_EXPIRY,
} from './vitest.setup'

function createTestToken(payload = { admin: true }, secret = TEST_JWT_SECRET) {
  return jwt.sign(payload, secret, {
    expiresIn: TEST_TOKEN_EXPIRY,
  })
}

function createWrongSecretToken() {
  return jwt.sign({ admin: true }, 'wrong-secret', {
    expiresIn: TEST_TOKEN_EXPIRY,
  })
}

function createExpiredToken() {
  return jwt.sign({ admin: true }, TEST_JWT_SECRET, {
    expiresIn: '-1s',
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

    it('throws TOO_MANY_REQUESTS after too many failed attempts', async () => {
      const caller = createCaller({ db: {} as any, headers: new Headers() })
      for (let i = 0; i < 5; i++) {
        await expect(
          caller.login({ password: 'wrong-password' }),
        ).rejects.toThrow(TRPCError)
      }
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

    it('throws UNAUTHORIZED when authorization header is missing', async () => {
      const caller = createCaller({
        db: {} as any,
        headers: new Headers(),
      })
      await expect(caller.verify()).rejects.toThrow(TRPCError)
      await expect(caller.verify()).rejects.toMatchObject({
        code: 'UNAUTHORIZED',
      })
    })

    it('throws UNAUTHORIZED when authorization scheme is malformed', async () => {
      const caller = createCaller({
        db: {} as any,
        headers: new Headers({ authorization: 'Basic abc123' }),
      })
      await expect(caller.verify()).rejects.toThrow(TRPCError)
      await expect(caller.verify()).rejects.toMatchObject({
        code: 'UNAUTHORIZED',
      })
    })

    it('throws UNAUTHORIZED when token is signed with wrong secret', async () => {
      const token = createWrongSecretToken()
      const caller = createCaller({
        db: {} as any,
        headers: new Headers({ authorization: `Bearer ${token}` }),
      })
      await expect(caller.verify()).rejects.toThrow(TRPCError)
      await expect(caller.verify()).rejects.toMatchObject({
        code: 'UNAUTHORIZED',
      })
    })

    it('throws UNAUTHORIZED when token is expired', async () => {
      const token = createExpiredToken()
      const caller = createCaller({
        db: {} as any,
        headers: new Headers({ authorization: `Bearer ${token}` }),
      })
      await expect(caller.verify()).rejects.toThrow(TRPCError)
      await expect(caller.verify()).rejects.toMatchObject({
        code: 'UNAUTHORIZED',
      })
    })

    it('throws FORBIDDEN when token payload lacks admin: true', async () => {
      const token = createTestToken({ admin: false })
      const caller = createCaller({
        db: {} as any,
        headers: new Headers({ authorization: `Bearer ${token}` }),
      })
      await expect(caller.verify()).rejects.toThrow(TRPCError)
      await expect(caller.verify()).rejects.toMatchObject({
        code: 'FORBIDDEN',
      })
    })
  })
})
