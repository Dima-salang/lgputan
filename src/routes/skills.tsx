import { getDb } from '../db'
import { skill, skillSchema, deleteSkill as deleteSkillSchema, updateSkill as updateSkillSchema } from '../models/skill'
import { eq } from 'drizzle-orm'
import z from 'zod'
import { publicProcedure } from '#/integrations/trpc/init'
import type { TRPCRouterRecord } from '@trpc/server'
import { createFileRoute } from '@tanstack/react-router'

export const skillRouter = {
  getSkill: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb()
      try {
        const result = await db.select().from(skill).where(eq(skill.id, input.id))
        return result[0]
      } catch (error) {
        console.error(error)
        return null
      }
    }),
  getSkills: publicProcedure
    .query(async () => {
      const db = await getDb()
      const skills = await db.select().from(skill)
      return skills
    }),
  addSkill: publicProcedure
    .input(skillSchema)
    .mutation(async ({ input }) => {
      const db = await getDb()
      const result = await db.insert(skill).values(input).returning()
      return result[0]
    }),
  updateSkill: publicProcedure
    .input(updateSkillSchema)
    .mutation(async ({ input }) => {
      const db = await getDb()
      const result = await db.update(skill).set(input).where(eq(skill.id, input.id)).returning()
      return result[0]
    }),
  deleteSkill: publicProcedure
    .input(deleteSkillSchema)
    .mutation(async ({ input }) => {
      const db = await getDb()
      const result = await db.delete(skill).where(eq(skill.id, input.id)).returning()
      return result[0]
    }),
} satisfies TRPCRouterRecord


// file router
export const Route = createFileRoute('/skills')({
  component: SkillsPage,
})


export function SkillsPage() {
  return (
    <div>
      <h1>Skills</h1>
    </div>
  )
}