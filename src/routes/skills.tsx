import {
  skill,
  skillSchema,
  deleteSkill as deleteSkillSchema,
  updateSkill as updateSkillSchema,
} from '../models/skill'
import { eq } from 'drizzle-orm'
import z from 'zod'
import { publicProcedure, type Context } from '#/integrations/trpc/init'
import { TRPCError, type TRPCRouterRecord } from '@trpc/server'
import { createFileRoute } from '@tanstack/react-router'

export const skillRouter = {
  getSkill: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const db = ctx.db as Context['db']
      const result = await db.select().from(skill).where(eq(skill.id, input.id))
      if (!result[0]) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Skill not found',
        })
      }
      return result[0]
    }),
  getSkills: publicProcedure.query(async ({ ctx }) => {
    const db = ctx.db as Context['db']
    try {
      const skills = await db.select().from(skill)
      return skills
    } catch (error) {
      console.error(error)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Skills not found',
      })
    }
  }),
  addSkill: publicProcedure
    .input(skillSchema)
    .mutation(async ({ input, ctx }) => {
      const db = ctx.db as Context['db']
      try {
        const result = await db.insert(skill).values(input).returning()
        return result[0]
      } catch (error) {
        console.error(error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to add skill',
        })
      }
    }),
  updateSkill: publicProcedure
    .input(updateSkillSchema)
    .mutation(async ({ input, ctx }) => {
      const db = ctx.db as Context['db']
      try {
        const result = await db
          .update(skill)
          .set(input)
          .where(eq(skill.id, input.id))
          .returning()
        return result[0]
      } catch (error) {
        console.error(error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update skill',
        })
      }
    }),
  deleteSkill: publicProcedure
    .input(deleteSkillSchema)
    .mutation(async ({ input, ctx }) => {
      const db = ctx.db as Context['db']
      try {
        const result = await db
          .delete(skill)
          .where(eq(skill.id, input.id))
          .returning()
        return result[0]
      } catch (error) {
        console.error(error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete skill',
        })
      }
    }),
} satisfies TRPCRouterRecord

// file router
import { SkillsPage } from '#/pages/SkillsPage'

export const Route = createFileRoute('/skills')({
  component: SkillsPage,
})
