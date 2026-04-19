import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import z from "zod";

export const skill = sqliteTable('skill', {
    id: integer('id').primaryKey(),
    name: text('name').notNull(),
    icon: text('icon'),
    createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
})

export type Skill = typeof skill.$inferSelect
export type NewSkill = typeof skill.$inferInsert


// schema
export const skillSchema = z.object({
    name: z.string(),
    icon: z.string(),
})

export const updateSkill = z.object({
    id: z.number(),
    name: z.string(),
    icon: z.string(),
})

export const deleteSkill = z.object({
    id: z.number(),
})
