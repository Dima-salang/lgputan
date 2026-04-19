import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { TRPCError } from '@trpc/server'
import z from 'zod'

const JWT_SECRET = process.env.JWT_SECRET!
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH!
const TOKEN_EXPIRY = '15m'

const t = { JWT_SECRET, ADMIN_PASSWORD_HASH }

export function verifyAdminPassword(password: string): boolean {
  return bcrypt.compareSync(password, t.ADMIN_PASSWORD_HASH)
}

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 12)
}

export function createToken() {
  return jwt.sign({ admin: true }, t.JWT_SECRET, { expiresIn: TOKEN_EXPIRY })
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, t.JWT_SECRET) as { admin: boolean }
  } catch {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid token' })
  }
}

export const loginSchema = z.object({
  password: z.string().min(1),
})
