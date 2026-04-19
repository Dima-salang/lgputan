import { initTRPC } from '@trpc/server'
import superjson from 'superjson'

import type { Db } from '../../db'

export interface Context {
  db: Db
}

const t = initTRPC.context<Context>().create({
  transformer: superjson,
})

export const createTRPCRouter = t.router
export const publicProcedure = t.procedure
export const createCallerFactory = t.createCallerFactory
