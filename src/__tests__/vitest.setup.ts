import 'dotenv/config'
import bcrypt from 'bcryptjs'

export const TEST_PASSWORD = 'admin'
export const TEST_JWT_SECRET = 'dev-secret-key-change-in-production'
export const TEST_TOKEN_EXPIRY = '15m'

process.env.JWT_SECRET = TEST_JWT_SECRET
process.env.ADMIN_PASSWORD_HASH = bcrypt.hashSync(TEST_PASSWORD, 4)
