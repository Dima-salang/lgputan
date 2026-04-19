import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { TRPCError } from '@trpc/server'
import z from 'zod'

const JWT_SECRET = process.env.JWT_SECRET
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH
const TOKEN_EXPIRY = '15m'

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is required but not set in environment')
}
if (!ADMIN_PASSWORD_HASH) {
  throw new Error('ADMIN_PASSWORD_HASH is required but not set in environment')
}

const JWT_SECRET_STRICT: string = JWT_SECRET
const ADMIN_PASSWORD_HASH_STRICT: string = ADMIN_PASSWORD_HASH

export async function verifyAdminPassword(password: string): Promise<boolean> {
  return bcrypt.compare(password, ADMIN_PASSWORD_HASH_STRICT)
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export function createToken() {
  return jwt.sign({ admin: true }, JWT_SECRET_STRICT, {
    expiresIn: TOKEN_EXPIRY,
  })
}

export function verifyToken(token: string): { admin: boolean } {
  try {
    const payload = jwt.verify(token, JWT_SECRET_STRICT)
    if (typeof payload !== 'object' || payload === null) {
      throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid token' })
    }
    if (typeof payload.admin !== 'boolean') {
      throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid token' })
    }
    return { admin: payload.admin }
  } catch (err) {
    if (err instanceof TRPCError) throw err
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid token' })
  }
}

export const loginSchema = z.object({
  password: z.string().min(1),
})
