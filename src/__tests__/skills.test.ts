import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client'
import { skill } from '#/models/skill'
import { unlinkSync, existsSync } from 'node:fs'
import {
  createCallerFactory,
  createTRPCRouter,
  type Context,
} from '#/integrations/trpc/init'
import { skillRouter } from '#/routes/skills'
import { TRPCError } from '@trpc/server'

const TEST_DB = './test.db'

async function mockDb() {
  try {
    if (existsSync(TEST_DB)) {
      unlinkSync(TEST_DB)
    }
  } catch {}

  const client = createClient({ url: `file:${TEST_DB}` })
  const db = drizzle(client, { schema: { skill } })

  await db.run(`
    CREATE TABLE IF NOT EXISTS skill (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      icon TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `)

  return db
}

async function seedDb(db: ReturnType<typeof drizzle>) {
  await db
    .insert(skill)
    .values([
      { name: 'TypeScript', icon: 'code' },
      { name: 'React', icon: 'react' },
    ])
    .run()
}

describe('skillRouter', () => {
  let db: ReturnType<typeof drizzle>
  const createCaller = createCallerFactory(createTRPCRouter(skillRouter))

  beforeEach(async () => {
    db = await mockDb()
    await seedDb(db)
  })

  afterEach(() => {
    if (existsSync(TEST_DB)) {
      unlinkSync(TEST_DB)
    }
  })

  describe('getSkills', () => {
    it('returns all skills via router', async () => {
      const caller = createCaller({ db } as Context)
      const result = await caller.getSkills()

      expect(result).toHaveLength(2)
      expect(result[0].name).toBe('TypeScript')
    })
  })

  describe('getSkill', () => {
    it('returns skill by id via router', async () => {
      const skills = await db.select().from(skill)
      const caller = createCaller({ db } as Context)
      const result = await caller.getSkill({ id: skills[0].id })

      expect(result?.name).toBe('TypeScript')
    })

    it('throws TRPCError for non-existent id via router', async () => {
      const caller = createCaller({ db } as Context)

      await expect(caller.getSkill({ id: 9999 })).rejects.toThrow(TRPCError)
    })
  })

  describe('addSkill', () => {
    it('adds a new skill via router', async () => {
      const caller = createCaller({ db } as Context)
      const result = await caller.addSkill({ name: 'Go', icon: 'golang' })

      expect(result.name).toBe('Go')
    })
  })

  describe('deleteSkill', () => {
    it('deletes a skill via router', async () => {
      const skills = await db.select().from(skill)
      const caller = createCaller({ db } as Context)
      await caller.deleteSkill({ id: skills[0].id })

      const remaining = await db.select().from(skill)
      expect(remaining).toHaveLength(1)
    })
  })
})
