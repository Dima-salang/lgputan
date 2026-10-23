import { Link } from '@tanstack/react-router'
import { trpc } from '#/integrations/trpc/react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Terminal as TerminalIcon, FileText } from 'lucide-react'
import { TerminalWindow } from '#/components/TerminalWindow'

export function BlogPage() {
  const { data: posts } = trpc.blog.getPosts.useQuery()

  return (
    <div className="page-wrap py-8 sm:py-12">
      <div className="space-y-8">
        <section className="rise-in">
          <TerminalWindow lines={[{ command: `echo "Blog posts"` }]} />
        </section>

        <div className="grid gap-6">
          {posts?.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-zinc-700 mb-4" />
              <p className="text-zinc-500 font-mono">// no posts found</p>
            </div>
          ) : (
            posts?.map((post) => (
              <Link
                key={post.id}
                to="/blog/$id"
                params={{ id: post.id.toString() }}
                className="block group"
              >
                <article className="border border-[var(--chip-line)] bg-[var(--surface)] rounded-lg p-6 hover:border-[var(--lagoon-deep)]/30 transition-all duration-300">
                  <h2 className="text-xl font-mono font-semibold text-[var(--foreground)] group-hover:text-[var(--lagoon-deep)] transition-colors">
                    {post.title}
                  </h2>
                  <div className="mt-3 prose prose-sm prose-invert max-w-none text-[var(--muted-foreground)] line-clamp-2">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {post.content}
                    </ReactMarkdown>
                  </div>
                </article>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
