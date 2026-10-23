import { z } from 'zod'

import { createTRPCRouter, publicProcedure } from './init-server'

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

import { skillRouter } from '../../server/routers/skills'
import { projectRouter } from '../../server/routers/projects'
import { blogRouter } from '../../server/routers/blog'
import { authRouter } from '../../server/admin'
import { quickLinksRouter } from '../../server/routers/quick_links'

export const trpcRouter = createTRPCRouter({
  todos: todosRouter,
  skills: skillRouter,
  projects: projectRouter,
  blog: blogRouter,
  auth: authRouter,
  quickLinks: quickLinksRouter,
})
export type TRPCRouter = typeof trpcRouter
