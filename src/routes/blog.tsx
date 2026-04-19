import { publicProcedure, type Context } from '#/integrations/trpc/init'
import { TRPCError, type TRPCRouterRecord } from '@trpc/server'
import {
  posts,
  postSchema,
  deletePostSchema,
  updatePostSchema,
} from '#/models/post'
import { eq } from 'drizzle-orm'
import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'

export const blogRouter = {
  getPost: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const db = ctx.db as Context['db']
      try {
        const result = await db
          .select()
          .from(posts)
          .where(eq(posts.id, input.id))
        if (result.length === 0) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Post not found',
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
          message: 'Failed to get post',
        })
      }
    }),
  getPosts: publicProcedure.query(async ({ ctx }) => {
    const db = ctx.db as Context['db']
    try {
      const blogs = await db.select().from(posts)
      return blogs
    } catch (error) {
      console.error(error)
      if (error instanceof TRPCError) {
        throw error
      }
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to get posts',
      })
    }
  }),
  addPost: publicProcedure.input(postSchema).mutation(async ({ input, ctx }) => {
    const db = ctx.db as Context['db']
    try {
      const result = await db.insert(posts).values(input).returning()
      return result[0]
    } catch (error) {
      console.error(error)
      if (error instanceof TRPCError) {
        throw error
      }
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to add post',
      })
    }
  }),
  updatePost: publicProcedure
    .input(updatePostSchema)
    .mutation(async ({ input, ctx }) => {
      const db = ctx.db as Context['db']
      try {
        const result = await db
          .update(posts)
          .set(input)
          .where(eq(posts.id, input.id))
          .returning()
        if (!result[0]) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Post not found',
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
          message: 'Failed to update post',
        })
      }
    }),
  deletePost: publicProcedure
    .input(deletePostSchema)
    .mutation(async ({ input, ctx }) => {
      const db = ctx.db as Context['db']
      try {
        const result = await db
          .delete(posts)
          .where(eq(posts.id, input.id))
          .returning()
        if (!result[0]) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Post not found',
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
          message: 'Failed to delete post',
        })
      }
    }),
} satisfies TRPCRouterRecord

import { BlogPage } from '#/pages/BlogPage'

export const Route = createFileRoute('/blog')({
  component: BlogPage,
})
