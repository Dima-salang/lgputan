import { getDb } from '../db'
import {
  projects,
  projectSchema,
  deleteProject as deleteProjectSchema,
  updateProject as updateProjectSchema,
} from '../models/project'
import { eq } from 'drizzle-orm'
import { publicProcedure } from '#/integrations/trpc/init'
import { TRPCError, type TRPCRouterRecord } from '@trpc/server'
import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'

export const projectRouter = {
  getProject: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb()
      try {
        const result = await db
          .select()
          .from(projects)
          .where(eq(projects.id, input.id))
        return result[0]
      } catch (error) {
        console.error(error)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Project not found',
        })
      }
    }),
  getProjects: publicProcedure.query(async () => {
    const db = await getDb()
    try {
      const result_projects = await db.select().from(projects)
      return result_projects
    } catch (error) {
      console.error(error)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Projects not found',
      })
    }
  }),
  addProject: publicProcedure
    .input(projectSchema)
    .mutation(async ({ input }) => {
      const db = await getDb()
      try {
        const result = await db.insert(projects).values(input).returning()
        return result[0]
      } catch (error) {
        console.error(error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to add project',
        })
      }
    }),
  updateProject: publicProcedure
    .input(updateProjectSchema)
    .mutation(async ({ input }) => {
      const db = await getDb()
      try {
        const result = await db
          .update(projects)
          .set(input)
          .where(eq(projects.id, input.id))
          .returning()
        return result[0]
      } catch (error) {
        console.error(error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update project',
        })
      }
    }),
  deleteProject: publicProcedure
    .input(deleteProjectSchema)
    .mutation(async ({ input }) => {
      const db = await getDb()
      try {
        const result = await db
          .delete(projects)
          .where(eq(projects.id, input.id))
          .returning()
        return result[0]
      } catch (error) {
        console.error(error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete project',
        })
      }
    }),
} satisfies TRPCRouterRecord

import { ProjectsPage } from '#/pages/ProjectsPage'

export const Route = createFileRoute('/projects')({
  component: ProjectsPage,
})
