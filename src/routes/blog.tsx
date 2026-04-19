import { publicProcedure } from "#/integrations/trpc/init";
import type { TRPCRouterRecord } from "@trpc/server";
import { getDb } from "#/db";
import { posts, postSchema, deletePostSchema, updatePostSchema } from "#/models/post";
import { eq } from "drizzle-orm";
import z from "zod";
import { createFileRoute } from "@tanstack/react-router";

export const blogRouter = {
    getPost: publicProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ input }) => {
            const db = await getDb()
            try {
                const result = await db.select().from(posts).where(eq(posts.id, input.id))
                return result[0]
            } catch (error) {
                console.error(error)
                return null
            }
        }),
    getPosts: publicProcedure
        .query(async () => {
            const db = await getDb()
            const blogs = await db.select().from(posts)
            return blogs
        }),
    addPost: publicProcedure
        .input(postSchema)
        .mutation(async ({ input }) => {
            const db = await getDb()
            const result = await db.insert(posts).values(input).returning()
            return result[0]
        }),
    updatePost: publicProcedure
        .input(updatePostSchema)
        .mutation(async ({ input }) => {
            const db = await getDb()
            const result = await db.update(posts).set(input).where(eq(posts.id, input.id)).returning()
            return result[0]
        }),
    deletePost: publicProcedure
        .input(deletePostSchema)
        .mutation(async ({ input }) => {
            const db = await getDb()
            const result = await db.delete(posts).where(eq(posts.id, input.id)).returning()
            return result[0]
        }),
} satisfies TRPCRouterRecord


export const blogFileRouter = createFileRoute('/blog')({
    component: BlogPage,
})


export function BlogPage() {
    return (
        <div>
            <h1>Blog</h1>
        </div>
    )
}