import * as jose from 'jose'
import bcrypt from 'bcryptjs'
import { TRPCError } from '@trpc/server'
import z from 'zod'

const TOKEN_EXPIRY = '15m'

function getSecret() {
  return new TextEncoder().encode(process.env.JWT_SECRET || '')
}

function getAdminPasswordHash() {
  const hash = process.env.ADMIN_PASSWORD_HASH || ''
  if (!hash) {
    throw new Error('ADMIN_PASSWORD_HASH is not set. Check .env file.')
  }
  return hash
}

if (!getSecret().byteLength) throw new Error('JWT_SECRET is required')
if (!getAdminPasswordHash()) throw new Error('ADMIN_PASSWORD_HASH is required')

export async function verifyAdminPassword(password: string): Promise<boolean> {
  return bcrypt.compare(password, getAdminPasswordHash())
}

export async function createToken() {
  return await new jose.SignJWT({ admin: true })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(getSecret())
}

export async function verifyToken(token: string) {
  const { payload } = await jose.jwtVerify(token, getSecret())
  if (!payload.admin) {
    throw new TRPCError({ code: 'FORBIDDEN' })
  }
  return payload
}

export const loginSchema = z.object({
  password: z.string().min(1),
})