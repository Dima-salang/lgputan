import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client'
import { posts } from '#/models/post'
import { unlinkSync, existsSync } from 'node:fs'
import {
  createCallerFactory,
  createTRPCRouter,
  type Context,
} from '#/integrations/trpc/init'
import { blogRouter } from '#/routes/blog'
import { TRPCError } from '@trpc/server'

const TEST_DB = './test-blog.db'

async function mockDb() {
  try {
    if (existsSync(TEST_DB)) {
      unlinkSync(TEST_DB)
    }
  } catch {}

  const client = createClient({ url: `file:${TEST_DB}` })
  const db = drizzle(client, { schema: { posts } })

  await db.run(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `)

  return db
}

async function seedDb(db: ReturnType<typeof drizzle>) {
  await db.insert(posts).values([
    { title: 'TypeScript', content: 'code' },
    { title: 'React', content: 'react' },
  ])
  return db
}

describe('blogRouter', () => {
  let db: ReturnType<typeof drizzle>
  const createCaller = createCallerFactory(createTRPCRouter(blogRouter))

  beforeEach(async () => {
    db = await mockDb()
    await seedDb(db)
  })

  afterEach(() => {
    if (existsSync(TEST_DB)) {
      db.$client.close()
      unlinkSync(TEST_DB)
    }
  })

  describe('getPosts', () => {
    it('returns all posts via router', async () => {
      const caller = createCaller({ db } as Context)
      const result = await caller.getPosts()

      expect(result).toHaveLength(2)
      expect(result[0].title).toBe('TypeScript')
    })
  })

  describe('getPost', () => {
    it('returns post by id via router', async () => {
      const allPosts = await db.select().from(posts)
      const caller = createCaller({ db } as Context)
      const result = await caller.getPost({ id: allPosts[0].id })

      expect(result?.title).toBe('TypeScript')
    })

    it('throws TRPCError for non-existent id via router', async () => {
      const caller = createCaller({ db } as Context)

      await expect(caller.getPost({ id: 9999 })).rejects.toThrow(TRPCError)
      await expect(caller.getPost({ id: 9999 })).rejects.toHaveProperty(
        'code',
        'NOT_FOUND',
      )
    })
  })

  describe('addPost', () => {
    it('adds a new post via router', async () => {
      const caller = createCaller({ db } as Context)
      const result = await caller.addPost({ title: 'Go', content: 'golang' })

      expect(result.title).toBe('Go')
    })
  })

  describe('deletePost', () => {
    it('deletes a post via router', async () => {
      const caller = createCaller({ db } as Context)
      const allPosts = await caller.getPosts()
      await caller.deletePost({ id: allPosts[0].id })

      const remaining = await caller.getPosts()
      expect(remaining).toHaveLength(1)
    })
  })
})
