import { z } from 'zod'

import { createTRPCRouter, publicProcedure } from './init'

import type { TRPCRouterRecord } from '@trpc/server'

const todosRouter = {
  list: publicProcedure.query(() => [
    { id: 1, name: 'Get groceries' },
    { id: 2, name: 'Buy a new phone' },
    { id: 3, name: 'Finish the project' },
  ]),
  add: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(({ input }) => {
      return { id: 3, name: input.name }
    }),
} satisfies TRPCRouterRecord

import { skillRouter } from '../../routes/skills'
import { projectRouter } from '../../routes/projects'
import { blogRouter } from '../../routes/blog'
import { quickLinksRouter } from '../../routes/quick_links'

export const trpcRouter = createTRPCRouter({
  todos: todosRouter,
  skills: skillRouter,
  projects: projectRouter,
  blog: blogRouter,
  quickLinks: quickLinksRouter,
})
export type TRPCRouter = typeof trpcRouter
