import { createFileRoute, Link, useParams } from '@tanstack/react-router'
import { trpc } from '#/integrations/trpc/react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ArrowLeft, Loader2 } from 'lucide-react'

export const Route = createFileRoute('/blog/$id')({
  component: BlogIdPage,
})

function BlogIdPage() {
  const { id } = useParams({ strict: false })
  const {
    data: post,
    isLoading,
    error,
  } = trpc.blog.getPost.useQuery({ id: parseInt(id!) }, { enabled: !!id })

  if (isLoading) {
    return (
      <div className="page-wrap py-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--lagoon-deep)]" />
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="page-wrap py-8">
        <div className="border border-[var(--line)] rounded-lg p-6 bg-[var(--card)]">
          <p className="text-[var(--destructive)] font-mono">Post not found</p>
          <Link
            to="/blog"
            className="mt-4 inline-flex items-center gap-2 text-[var(--lagoon-deep)] hover:text-[var(--lagoon)]"
          >
            <ArrowLeft className="size-4" />
            Back to blog
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="page-wrap py-8 sm:py-12">
      <article className="max-w-3xl mx-auto">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-sm font-mono text-[var(--muted-foreground)] hover:text-[var(--lagoon-deep)] mb-8"
        >
          <ArrowLeft className="size-4" />
          cd ../blog
        </Link>

        <header className="mb-8">
          <h1 className="text-3xl font-bold font-mono text-[var(--foreground)] mb-2">
            {post.title}
          </h1>
          <time className="text-sm font-mono text-[var(--muted-foreground)]">
            {post.createdAt
              ? new Date(post.createdAt).toLocaleDateString()
              : 'Unknown date'}
          </time>
        </header>

        <div className="prose prose-lg max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </div>
      </article>
    </div>
  )
}
