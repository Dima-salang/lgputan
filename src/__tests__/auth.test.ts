import { describe, it, expect } from 'vitest'
import * as jose from 'jose'
import { authRouter } from '#/server/admin'
import {
  createCallerFactory,
  createTRPCRouter,
  type Context,
} from '#/integrations/trpc/init-server'
import { TRPCError } from '@trpc/server'
import {
  TEST_PASSWORD,
  TEST_JWT_SECRET,
  TEST_TOKEN_EXPIRY,
} from './vitest.setup'

const secret = new TextEncoder().encode(TEST_JWT_SECRET)

async function createTestToken(
  payload = { admin: true },
  tokenSecret: Uint8Array = secret,
) {
  return await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(TEST_TOKEN_EXPIRY)
    .sign(tokenSecret)
}

async function createWrongSecretToken() {
  const wrongSecret = new TextEncoder().encode('wrong-secret')
  return await new jose.SignJWT({ admin: true })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(TEST_TOKEN_EXPIRY)
    .sign(wrongSecret)
}

async function createExpiredToken() {
  return await new jose.SignJWT({ admin: true })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('-1s')
    .sign(secret)
}

function createCookie(token: string) {
  return new Headers({ cookie: `admin_token=${token}` })
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
      const token = await createTestToken()
      const caller = createCaller({
        db: {} as any,
        headers: createCookie(token),
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

    it('throws UNAUTHORIZED when cookie is malformed', async () => {
      const caller = createCaller({
        db: {} as any,
        headers: new Headers({ cookie: 'invalid-cookie' }),
      })
      await expect(caller.verify()).rejects.toThrow(TRPCError)
      await expect(caller.verify()).rejects.toMatchObject({
        code: 'UNAUTHORIZED',
      })
    })

    it('throws UNAUTHORIZED when token is signed with wrong secret', async () => {
      const token = await createWrongSecretToken()
      const caller = createCaller({
        db: {} as any,
        headers: createCookie(token),
      })
      await expect(caller.verify()).rejects.toThrow(TRPCError)
      await expect(caller.verify()).rejects.toMatchObject({
        code: 'UNAUTHORIZED',
      })
    })

    it('throws UNAUTHORIZED when token is expired', async () => {
      const token = await createExpiredToken()
      const caller = createCaller({
        db: {} as any,
        headers: createCookie(token),
      })
      await expect(caller.verify()).rejects.toThrow(TRPCError)
      await expect(caller.verify()).rejects.toMatchObject({
        code: 'UNAUTHORIZED',
      })
    })

    it('throws FORBIDDEN when token payload lacks admin: true', async () => {
      const token = await createTestToken({ admin: false })
      const caller = createCaller({
        db: {} as any,
        headers: createCookie(token),
      })
      await expect(caller.verify()).rejects.toThrow(TRPCError)
      await expect(caller.verify()).rejects.toMatchObject({
        code: 'FORBIDDEN',
      })
    })
  })
})