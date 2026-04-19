import 'dotenv/config'
import bcrypt from 'bcryptjs'

const TEST_PASSWORD = 'admin'
const TEST_JWT_SECRET = 'dev-secret-key-change-in-production'

process.env.JWT_SECRET = TEST_JWT_SECRET
process.env.ADMIN_PASSWORD_HASH = bcrypt.hashSync(TEST_PASSWORD, 12)