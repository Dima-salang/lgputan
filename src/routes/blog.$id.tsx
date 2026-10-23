import { createFileRoute, Link } from '@tanstack/react-router'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ArrowLeft, ArrowUpRight, Loader2 } from 'lucide-react'
import { trpc } from '#/integrations/trpc/react'
import { formatDate, isDraft, readingTime } from '#/lib/data'
import { site } from '#/content/site'

export const Route = createFileRoute('/blog/$id')({
  component: BlogPostPage,
})

export function BlogPostPage() {
  const { id } = Route.useParams()
  const postId = Number.parseInt(id, 10)
  const { data: post, isLoading, error } = trpc.blog.getPost.useQuery(
    { id: postId },
    { enabled: Number.isFinite(postId) },
  )

  if (isLoading) {
    return (
      <main id="main" className="page-shell py-20">
        <div className="flex items-center gap-3 font-mono text-xs text-muted-foreground">
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          Loading post
        </div>
        <div className="mt-8 space-y-4">
          <div className="h-3 w-24 animate-pulse bg-secondary" />
          <div className="h-16 w-3/4 animate-pulse bg-secondary" />
        </div>
      </main>
    )
  }

  if (error || !post) {
    return (
      <main id="main" className="page-shell py-20">
        <p className="section-label">
          <span className="index">03</span>
          <span className="text-muted-foreground/50" aria-hidden="true">
            /
          </span>
          <span>Writing</span>
        </p>
        <h1 className="mt-6 font-display text-5xl leading-none sm:text-6xl">
          That post doesn&apos;t exist.
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">
          It may have been removed, or the link may be wrong.
        </p>
        <Link
          to="/blog"
          className="link-underline mt-8 text-[10px] uppercase tracking-[0.12em]"
        >
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          Back to writing
        </Link>
      </main>
    )
  }

  if (isDraft(post.content)) {
    return (
      <main id="main" className="page-shell py-20">
        <Link
          to="/blog"
          className="link-underline text-[10px] uppercase tracking-[0.12em]"
        >
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          Back to writing
        </Link>

        <div className="panel mt-10 max-w-2xl p-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-signal">
            Draft
          </p>
          <h1 className="mt-4 font-display text-5xl leading-none">
            {post.title}
          </h1>
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
            This post is still being written. It isn&apos;t published yet.
          </p>
          <a
            href={`mailto:${site.email}`}
            className="link-underline mt-8 text-[10px] uppercase tracking-[0.12em]"
          >
            Ask me about it
          </a>
        </div>
      </main>
    )
  }

  return (
    <main id="main" className="page-shell py-14 sm:py-20">
      <Link
        to="/blog"
        className="link-underline text-[10px] uppercase tracking-[0.12em]"
      >
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        Back to writing
      </Link>

      <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-12">
        <aside className="lg:col-span-2">
          <dl className="flex flex-row gap-6 lg:sticky lg:top-24 lg:flex-col lg:gap-4">
            <div>
              <dt className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                Published
              </dt>
              <dd className="mt-1 font-mono text-[11px] text-foreground">
                {formatDate(post.createdAt)}
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                Read time
              </dt>
              <dd className="mt-1 font-mono text-[11px] text-foreground">
                {readingTime(post.content)}
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                Author
              </dt>
              <dd className="mt-1 font-mono text-[11px] text-foreground">
                {site.name}
              </dd>
            </div>
          </dl>
        </aside>

        <article className="min-w-0 lg:col-span-10">
          <h1 className="max-w-3xl font-display text-[clamp(2.6rem,6vw,4.5rem)] leading-[0.95] tracking-[-0.03em]">
            {post.title}
          </h1>

          <div className="prose mt-10 border-t border-border pt-8">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </div>

          <footer className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
            <Link
              to="/blog"
              className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-acid"
            >
              More writing
            </Link>
            <a
              href={`mailto:${site.email}`}
              className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-acid"
            >
              Reply by email
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </a>
          </footer>
        </article>
      </div>
    </main>
  )
}
