import { trpc } from '#/integrations/trpc/react'

export function BlogPage() {
  const { data: posts } = trpc.blog.getPosts.useQuery()

  return (
    <div>
      <h1>Blog</h1>
      {posts?.map((post) => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  )
}
