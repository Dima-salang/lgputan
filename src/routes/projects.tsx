import { getDb } from '../db'
import { projects, projectSchema, deleteProject as deleteProjectSchema, updateProject as updateProjectSchema } from '../models/project'
import { eq } from 'drizzle-orm'
import { publicProcedure } from '#/integrations/trpc/init'
import type { TRPCRouterRecord } from '@trpc/server'
import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'

export const projectRouter = {
  getProject: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb()
      try {
        const result = await db.select().from(projects).where(eq(projects.id, input.id))
        return result[0]
      } catch (error) {
        console.error(error)
        return null
      }
    }),
  getProjects: publicProcedure
    .query(async () => {
      const db = await getDb()
      const result_projects = await db.select().from(projects)
      return result_projects
    }),
  addProject: publicProcedure
    .input(projectSchema)
    .mutation(async ({ input }) => {
      const db = await getDb()
      const result = await db.insert(projects).values(input).returning()
      return result[0]
    }),
  updateProject: publicProcedure
    .input(updateProjectSchema)
    .mutation(async ({ input }) => {
      const db = await getDb()
      const result = await db.update(projects).set(input).where(eq(projects.id, input.id)).returning()
      return result[0]
    }),
  deleteProject: publicProcedure
    .input(deleteProjectSchema)
    .mutation(async ({ input }) => {
      const db = await getDb()
      const result = await db.delete(projects).where(eq(projects.id, input.id)).returning()
      return result[0]
    }),
} satisfies TRPCRouterRecord


export const Route = createFileRoute('/projects')({
  component: ProjectsPage,
})


export function ProjectsPage() {
  return (
    <div>
      <h1>Projects</h1>
    </div>
  )
}