import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { projectRouter } from '#/server/routers/projects'
import {
  createCallerFactory,
  createTRPCRouter,
  type Context,
} from '#/integrations/trpc/init-server'
import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client'
import { unlinkSync, existsSync } from 'node:fs'
import { projects } from '#/models/project'
import { eq } from 'drizzle-orm'
import { TRPCError } from '@trpc/server'

const TEST_DB = './test-projects.db'

async function mockDb() {
  try {
    if (existsSync(TEST_DB)) {
      unlinkSync(TEST_DB)
    }
  } catch {}

  const client = createClient({
    url: `file:${TEST_DB}`,
  })
  const db = drizzle(client, { schema: { projects } })
  await db.run(`CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    url TEXT,
    image_url TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`)
  await db.insert(projects).values([
    {
      name: 'Project 1',
      description: 'Description 1',
      url: 'http://localhost:3001',
      image_url: 'http://localhost:3001/image.png',
    },
    {
      name: 'Project 2',
      description: 'Description 2',
      url: 'http://localhost:3002',
      image_url: 'http://localhost:3002/image.png',
    },
  ])
  return db
}

describe('projectRouter', () => {
  let db: ReturnType<typeof drizzle>
  const createCaller = createCallerFactory(createTRPCRouter(projectRouter))

  beforeEach(async () => {
    db = await mockDb()
  })

  afterEach(() => {
    if (existsSync(TEST_DB)) {
      unlinkSync(TEST_DB)
    }
  })

  describe('getProjects', () => {
    it('returns all projects via router', async () => {
      const caller = createCaller({ db } as Context)
      const result = await caller.getProjects()

      expect(result).toHaveLength(2)
      expect(result[0].name).toBe('Project 1')
    })
  })

  describe('getProject', () => {
    it('returns project by id via router', async () => {
      const caller = createCaller({ db } as Context)
      const result_projects = await caller.getProjects()
      const result = await caller.getProject({ id: result_projects[0].id })

      expect(result?.name).toBe('Project 1')
      expect(result?.url).toBe('http://localhost:3001')
    })

    it('throws TRPCError for non-existent id via router', async () => {
      const caller = createCaller({ db } as Context)

      await expect(caller.getProject({ id: 9999 })).rejects.toThrow(TRPCError)
    })
  })

  describe('addProject', () => {
    it('adds a new project via router', async () => {
      const caller = createCaller({ db } as Context)
      const result = await caller.addProject({
        name: 'Project 3',
        description: 'Description 3',
        url: 'http://localhost:3003',
        image_url: 'http://localhost:3003/image.png',
      })

      expect(result.name).toBe('Project 3')
      expect(result.url).toBe('http://localhost:3003')
      expect(result.image_url).toBe('http://localhost:3003/image.png')

      const allProjects = await db.select().from(projects)
      expect(allProjects).toHaveLength(3)
    })
  })

  describe('deleteProject', () => {
    it('deletes a project via router', async () => {
      const caller = createCaller({ db } as Context)
      const result_projects = await caller.getProjects()
      await caller.deleteProject({ id: result_projects[0].id })

      const remaining = await db.select().from(projects)
      expect(remaining).toHaveLength(1)
    })
  })

  describe('updateProject', () => {
    it('updates an existing project via router', async () => {
      const caller = createCaller({ db } as Context)
      const result_projects = await caller.getProjects()
      const result = await caller.updateProject({
        id: result_projects[0].id,
        name: 'Updated Project',
        description: 'Updated Description',
        url: 'http://localhost:3001',
        image_url: 'http://localhost:3001/image.png',
      })

      expect(result.name).toBe('Updated Project')
      expect(result.description).toBe('Updated Description')
      expect(result.url).toBe('http://localhost:3001')
      expect(result.image_url).toBe('http://localhost:3001/image.png')

      const updated = await db
        .select()
        .from(projects)
        .where(eq(projects.id, result_projects[0].id))
      expect(updated[0].name).toBe('Updated Project')
    })
  })
})
