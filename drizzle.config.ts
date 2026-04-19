import { config } from 'dotenv'
import { defineConfig } from 'drizzle-kit'

config({ path: ['.env.local', '.env'] })

export default defineConfig({
  out: './drizzle',
  schema: [
    './src/models/skill.tsx',
    './src/models/project.tsx',
    './src/models/post.tsx',
    './src/models/profile.tsx',
    './src/models/quick_link.tsx',
  ],
  dialect: 'sqlite',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? './dev.db',
  },
})
