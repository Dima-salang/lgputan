import { publicProcedure, protectedProcedure } from '#/integrations/trpc/init'
import { TRPCError } from '@trpc/server'
import { verifyAdminPassword, createToken, loginSchema } from './auth'

export const authRouter = {
  login: publicProcedure.input(loginSchema).mutation(async ({ input }) => {
    const isValid = verifyAdminPassword(input.password)
    if (!isValid) {
      throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid password' })
    }
    const token = createToken()
    return { token }
  }),

  verify: protectedProcedure.mutation(async () => {
    return { valid: true }
  }),
}
