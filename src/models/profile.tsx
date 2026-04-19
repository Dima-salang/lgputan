import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import z from "zod";

export const profile = sqliteTable('profile', {
    id: integer('id').primaryKey(),
    name: text('name').notNull(),
    image_url: text('image_url'),
    description: text('description'),
    experience: text('experience'),
    education: text('education'),
    createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
})

export type Profile = typeof profile.$inferSelect
export type NewProfile = typeof profile.$inferInsert



// schema
export const profileSchema = z.object({
    name: z.string(),
    image_url: z.string(),
    description: z.string(),
    experience: z.string(),
    education: z.string(),
})

export const updateProfile = z.object({
    id: z.number(),
    name: z.string(),
    image_url: z.string(),
    description: z.string(),
    experience: z.string(),
    education: z.string(),
})

export const deleteProfile = z.object({
    id: z.number(),
})
