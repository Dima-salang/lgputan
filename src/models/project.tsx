// project model

import { sql } from 'drizzle-orm'
import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core'
import z from 'zod'

export const projects = sqliteTable('projects', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  image_url: text('image_url'),
  description: text('description'),
  url: text('url'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
})

export type Project = typeof projects.$inferSelect
export type NewProject = typeof projects.$inferInsert


// schema
export const projectSchema = z.object({
    name: z.string(),
    image_url: z.string(),
    description: z.string(),
    url: z.string(),
})

export const deleteProject = z.object({
    id: z.number(),
})

export const updateProject = z.object({
    id: z.number(),
    name: z.string(),
    image_url: z.string(),
    description: z.string(),
    url: z.string(),
})
