import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import z from "zod";

export const quick_links = sqliteTable('quick_links', {
    id: integer('id').primaryKey(),
    name: text('name').notNull(),
    url: text('url'),
    icon: text('icon'),
    type: text('type').notNull(),
    createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
})

export type QuickLink = typeof quick_links.$inferSelect
export type NewQuickLink = typeof quick_links.$inferInsert


// schema
export const quickLinkSchema = z.object({
    name: z.string(),
    url: z.string(),
    icon: z.string(),
    type: z.string(),
})

export const updateQuickLink = z.object({
    id: z.number(),
    name: z.string(),
    url: z.string(),
    icon: z.string(),
    type: z.string(),
})

export const deleteQuickLink = z.object({
    id: z.number(),
})
