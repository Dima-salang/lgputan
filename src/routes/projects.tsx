import {
  projects,
  projectSchema,
  deleteProject as deleteProjectSchema,
  updateProject as updateProjectSchema,
} from '../models/project'
import { eq } from 'drizzle-orm'
import { publicProcedure, type Context } from '#/integrations/trpc/init'
import { TRPCError, type TRPCRouterRecord } from '@trpc/server'
import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'

export const projectRouter = {
  getProject: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const db = ctx.db as Context['db']
      const result = await db
        .select()
        .from(projects)
        .where(eq(projects.id, input.id))
      if (!result[0]) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Project not found',
        })
      }
      return result[0]
    }),
  getProjects: publicProcedure.query(async ({ ctx }) => {
    const db = ctx.db as Context['db']
    const result_projects = await db.select().from(projects)
    return result_projects
  }),
  addProject: publicProcedure
    .input(projectSchema)
    .mutation(async ({ input, ctx }) => {
      const db = ctx.db as Context['db']
      const result = await db.insert(projects).values(input).returning()
      return result[0]
    }),
  updateProject: publicProcedure
    .input(updateProjectSchema)
    .mutation(async ({ input, ctx }) => {
      const db = ctx.db as Context['db']
      const result = await db
        .update(projects)
        .set(input)
        .where(eq(projects.id, input.id))
        .returning()
      if (!result[0]) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Project not found',
        })
      }
      return result[0]
    }),
  deleteProject: publicProcedure
    .input(deleteProjectSchema)
    .mutation(async ({ input, ctx }) => {
      const db = ctx.db as Context['db']
      const result = await db
        .delete(projects)
        .where(eq(projects.id, input.id))
        .returning()
      if (!result[0]) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Project not found',
        })
      }
      return result[0]
    }),
} satisfies TRPCRouterRecord

import { ProjectsPage } from '#/pages/ProjectsPage'

export const Route = createFileRoute('/projects')({
  component: ProjectsPage,
})
