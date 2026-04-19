import 'dotenv/config'
import bcrypt from 'bcryptjs'

export const TEST_PASSWORD = 'admin'
export const TEST_JWT_SECRET = 'dev-secret-key-change-in-production'
export const TEST_TOKEN_EXPIRY = '15m'
export const DATABASE_URL = 'file:./local.db'

process.env.JWT_SECRET = TEST_JWT_SECRET
process.env.ADMIN_PASSWORD_HASH = bcrypt.hashSync(TEST_PASSWORD, 4)
process.env.DATABASE_URL = DATABASE_URL
