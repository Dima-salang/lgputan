import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'
import z from 'zod'

// sqlite
export const posts = sqliteTable('posts', {
  id: integer('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
})

export type Post = typeof posts.$inferSelect
export type NewPost = typeof posts.$inferInsert

export const postSchema = z.object({
  title: z.string(),
  content: z.string(),
})

export const updatePostSchema = z.object({
  id: z.number(),
  title: z.string(),
  content: z.string(),
})

export const deletePostSchema = z.object({
  id: z.number(),
})


