import { Link } from '@tanstack/react-router'
import { Mail } from 'lucide-react'
import { trpc } from '#/integrations/trpc/react'
import { formatYear, isDraft } from '#/lib/data'
import { site } from '#/content/site'
import { ArchiveRow } from '#/components/site/ArchiveRow'

export function BlogPage() {
  const { data: posts, isLoading } = trpc.blog.getPosts.useQuery()
  const published = (posts ?? []).filter((post) => !isDraft(post.content))

  const years = Array.from(
    new Set(published.map((post) => formatYear(post.createdAt))),
  ).sort((a, b) => b.localeCompare(a))

  return (
    <main id="main" className="page-shell py-14 sm:py-20">
      <div className="border-b border-border pb-10">
        <p className="section-label">
          <span className="index">03</span>
          <span className="text-muted-foreground/50" aria-hidden="true">
            /
          </span>
          <span>Writing</span>
        </p>
        <h1 className="mt-6 font-display text-[clamp(3.5rem,9vw,7rem)] leading-[0.88] tracking-[-0.035em]">
          Writing<span className="text-acid">.</span>
        </h1>
        <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Notes on what I&apos;m learning, building, and getting wrong. Long
          enough to be useful, short enough to finish.
        </p>
      </div>

      {isLoading ? (
        <div className="mt-10 space-y-4 border-t border-border pt-6">
          <div className="h-3 w-20 animate-pulse bg-secondary" />
          <div className="h-8 w-2/3 animate-pulse bg-secondary" />
          <div className="h-3 w-24 animate-pulse bg-secondary" />
        </div>
      ) : published.length > 0 ? (
        <div className="mt-10 space-y-10">
          {years.map((year) => (
            <section key={year}>
              <h2 className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                {year}
              </h2>
              <div className="border-b border-border">
                {published
                  .filter((post) => formatYear(post.createdAt) === year)
                  .map((post) => (
                    <ArchiveRow key={post.id} post={post} />
                  ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="mt-10 border border-border px-6 py-20 text-center">
          <p className="font-display text-4xl">Nothing published yet.</p>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
            I&apos;m working on the first post. In the meantime, you can email
            me or look through the projects.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-5">
            <a
              href={`mailto:${site.email}`}
              className="link-underline text-[10px] uppercase tracking-[0.12em]"
            >
              <Mail className="size-3.5" aria-hidden="true" />
              Email me
            </a>
            <Link
              to="/projects"
              className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-acid"
            >
              See the work
            </Link>
          </div>
        </div>
      )}
    </main>
  )
}
