import { Link } from '@tanstack/react-router'
import { ArrowUpRight } from 'lucide-react'
import {
  excerpt,
  formatDate,
  isDraft,
  readingTime,
} from '#/lib/data'
import type { Post } from '#/models/post'

export function ArchiveRow({
  post,
  showExcerpt = true,
}: {
  post: Post
  showExcerpt?: boolean
}) {
  const draft = isDraft(post.content)
  const summary = showExcerpt && !draft ? excerpt(post.content) : ''

  return (
    <Link
      to="/blog/$id"
      params={{ id: String(post.id) }}
      className="group grid gap-1 border-t border-border py-5 transition-colors hover:bg-card/40 sm:grid-cols-[7rem_1fr_auto] sm:items-baseline sm:gap-6 sm:px-2"
    >
      <time
        dateTime={post.createdAt ?? undefined}
        className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground"
      >
        {formatDate(post.createdAt)}
      </time>

      <div className="min-w-0">
        <h3 className="font-display text-2xl leading-tight transition-colors group-hover:text-acid sm:text-3xl">
          {post.title}
        </h3>
        {summary ? (
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {summary}
          </p>
        ) : null}
      </div>

      <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
        {draft ? <span className="text-signal">Draft</span> : readingTime(post.content)}
        <ArrowUpRight
          className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-acid"
          aria-hidden="true"
        />
      </span>
    </Link>
  )
}
