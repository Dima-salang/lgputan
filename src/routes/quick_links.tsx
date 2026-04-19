import { publicProcedure, type Context} from "#/integrations/trpc/init";
import { quick_links } from "#/models/quick_link";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import z from "zod";

export const quickLinksRouter = ({
    getQuickLinks: publicProcedure.query(async ({ ctx }) => {
        try {
            const db = ctx.db as Context['db']
            const result = await db.select().from(quick_links)
            return result
        } catch (error) {
            console.error(error)
            if (error instanceof TRPCError) {
                throw error
            }
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to fetch quick links',
            })
        }
    }),
    getQuickLink: publicProcedure.input(z.object({ id: z.number() })).query(async ({ ctx, input }) => {
        try {
            const db = ctx.db as Context['db']
            const result = await db.select().from(quick_links).where(eq(quick_links.id, input.id))
            if (result.length === 0) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Quick link not found',
                })
            }
            return result[0]
        } catch (error) {
            console.error(error)
            if (error instanceof TRPCError) {
                throw error
            }
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to fetch quick link',
            })
        }
    }),
    addQuickLink: publicProcedure.input(z.object({ name: z.string(), url: z.string(), icon: z.string(), type: z.string() })).mutation(async ({ ctx, input }) => {
        try {
            const db = ctx.db as Context['db']
            const result = await db.insert(quick_links).values(input).returning()
            return result[0]
        } catch (error) {
            console.error(error)
            if (error instanceof TRPCError) {
                throw error
            }
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to add quick link',
            })
        }
    }),
    deleteQuickLink: publicProcedure.input(z.object({ id: z.number() })).mutation(async ({ ctx, input }) => {
        try {
            const db = ctx.db as Context['db']
            const result = await db.delete(quick_links).where(eq(quick_links.id, input.id)).returning()
            if (result.length === 0) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Quick link not found',
                })
            }
            return result[0]
        } catch (error) {
            console.error(error)
            if (error instanceof TRPCError) {
                throw error
            }
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to delete quick link',
            })
        }
    }),
})