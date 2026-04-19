import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client'
import { quick_links, type QuickLink } from '#/models/quick_link'
import { unlinkSync, existsSync } from 'node:fs'
import {
  createCallerFactory,
  createTRPCRouter,
  type Context,
} from '#/integrations/trpc/init-server'
import { TRPCError } from '@trpc/server'
import { quickLinksRouter } from '#/server/routers/quick_links'

const TEST_DB = './test-quick_links.db'

async function mockDb() {
  try {
    if (existsSync(TEST_DB)) {
      unlinkSync(TEST_DB)
    }
  } catch {}

  const client = createClient({ url: `file:${TEST_DB}` })
  const db = drizzle(client, { schema: { quick_links } })

  await db.run(`
    CREATE TABLE IF NOT EXISTS quick_links (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      url TEXT,
      icon TEXT,
      type TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `)

  return { db, client }
}

async function seedDb(db: ReturnType<typeof drizzle>) {
  await db.insert(quick_links).values([
    { name: 'GitHub', url: 'https://github.com', type: 'github' },
    { name: 'LinkedIn', url: 'https://linkedin.com', type: 'linkedin' },
  ])
  return db
}

type DbClient = ReturnType<typeof createClient>

describe('quickLinksRouter', () => {
  let db: ReturnType<typeof drizzle>
  let client: DbClient | undefined
  const createCaller = createCallerFactory(createTRPCRouter(quickLinksRouter))

  beforeEach(async () => {
    const result = await mockDb()
    db = result.db
    client = result.client
    await seedDb(db)
  })

  afterEach(async () => {
    if (client) {
      await client.close()
    }
    if (existsSync(TEST_DB)) {
      unlinkSync(TEST_DB)
    }
  })

  describe('getQuickLinks', () => {
    it('returns all quick links via router', async () => {
      const caller = createCaller({ db } as Context)
      const result = await caller.getQuickLinks()

      expect(result).toHaveLength(2)
      expect(result[0].name).toBe('GitHub')
    })
  })

  describe('getQuickLink', () => {
    it('returns quick link by id via router', async () => {
      const allQuickLinks = await db.select().from(quick_links)
      const caller = createCaller({ db } as Context)
      const result = await caller.getQuickLink({ id: allQuickLinks[0].id })

      expect(result?.name).toBe('GitHub')
    })

    it('throws TRPCError for non-existent id via router', async () => {
      const caller = createCaller({ db } as Context)

      await expect(caller.getQuickLink({ id: 9999 })).rejects.toThrow(TRPCError)
    })
  })

  describe('addQuickLink', () => {
    it('adds a new quick link via router', async () => {
      const caller = createCaller({ db } as Context)
      const result: QuickLink = await caller.addQuickLink({
        name: 'Twitter',
        url: 'https://twitter.com',
        type: 'twitter',
        icon: 'twitter',
      })
      const result_quick_links = await caller.getQuickLinks()

      expect(result.name).toBe('Twitter')
      expect(result.url).toBe('https://twitter.com')
      expect(result.type).toBe('twitter')
      expect(result.icon).toBe('twitter')
      expect(result_quick_links).toHaveLength(3)
    })
  })

  describe('deleteQuickLink', () => {
    it('deletes a quick link via router', async () => {
      const caller = createCaller({ db } as Context)
      const allQuickLinks = await caller.getQuickLinks()
      await caller.deleteQuickLink({ id: allQuickLinks[0].id })

      const remaining = await caller.getQuickLinks()
      expect(remaining).toHaveLength(1)
    })
  })
})
