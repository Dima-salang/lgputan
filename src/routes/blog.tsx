import { publicProcedure } from '#/integrations/trpc/init'
import { TRPCError, type TRPCRouterRecord } from '@trpc/server'
import { getDb } from '#/db'
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
    .query(async ({ input }) => {
      const db = await getDb()
      try {
        const result = await db
          .select()
          .from(posts)
          .where(eq(posts.id, input.id))
        return result[0]
      } catch (error) {
        console.error(error)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Post not found',
        })
      }
    }),
  getPosts: publicProcedure.query(async () => {
    const db = await getDb()
    try {
      const blogs = await db.select().from(posts)
      return blogs
    } catch (error) {
      console.error(error)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Posts not found',
      })
    }
  }),
  addPost: publicProcedure.input(postSchema).mutation(async ({ input }) => {
    const db = await getDb()
    try {
      const result = await db.insert(posts).values(input).returning()
      return result[0]
    } catch (error) {
      console.error(error)
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to add post',
      })
    }
  }),
  updatePost: publicProcedure
    .input(updatePostSchema)
    .mutation(async ({ input }) => {
      const db = await getDb()
      try {
        const result = await db
          .update(posts)
          .set(input)
          .where(eq(posts.id, input.id))
          .returning()
        return result[0]
      } catch (error) {
        console.error(error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update post',
        })
      }
    }),
  deletePost: publicProcedure
    .input(deletePostSchema)
    .mutation(async ({ input }) => {
      const db = await getDb()
      try {
        const result = await db
          .delete(posts)
          .where(eq(posts.id, input.id))
          .returning()
        return result[0]
      } catch (error) {
        console.error(error)
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
