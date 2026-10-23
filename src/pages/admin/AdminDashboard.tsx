import { Link } from '@tanstack/react-router'
import {
  ArrowUpRight,
  Briefcase,
  FileText,
  Link2,
  Loader2,
  Table2,
} from 'lucide-react'
import { trpc } from '#/integrations/trpc/react'
import { formatDate, isDraft } from '#/lib/data'

export function AdminDashboard() {
  const { data: projects, isLoading: projectsLoading } =
    trpc.projects.getProjects.useQuery()
  const { data: skills, isLoading: skillsLoading } =
    trpc.skills.getSkills.useQuery()
  const { data: posts, isLoading: postsLoading } = trpc.blog.getPosts.useQuery()
  const { data: links, isLoading: linksLoading } =
    trpc.quickLinks.getQuickLinks.useQuery()

  const isLoading =
    projectsLoading || skillsLoading || postsLoading || linksLoading

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2
          className="size-6 animate-spin text-muted-foreground"
          aria-hidden="true"
        />
        <span className="sr-only">Loading overview</span>
      </div>
    )
  }

  const stats = [
    {
      label: 'Projects',
      value: projects?.length ?? 0,
      href: '/admin/projects' as const,
      icon: Briefcase,
      tone: 'text-acid',
    },
    {
      label: 'Skills',
      value: skills?.length ?? 0,
      href: '/admin/skills' as const,
      icon: Table2,
      tone: 'text-signal',
    },
    {
      label: 'Blog posts',
      value: posts?.length ?? 0,
      href: '/admin/blog' as const,
      icon: FileText,
      tone: 'text-soft',
    },
    {
      label: 'Quick links',
      value: links?.length ?? 0,
      href: '/admin/quick-links' as const,
      icon: Link2,
      tone: 'text-muted-foreground',
    },
  ]

  const latestPosts = [...(posts ?? [])]
    .sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''))
    .slice(0, 4)

  const latestProjects = [...(projects ?? [])].reverse().slice(0, 4)

  return (
    <div className="mx-auto max-w-5xl">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="font-display text-4xl leading-none">
            Overview<span className="text-acid">.</span>
          </h1>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            Everything you can edit on the site
          </p>
        </div>
      </header>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            to={stat.href}
            className="group border border-border bg-card/40 p-5 transition-colors hover:border-acid/40"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                {stat.label}
              </span>
              <stat.icon className={`size-4 ${stat.tone}`} aria-hidden="true" />
            </div>
            <p className="mt-6 font-display text-5xl leading-none">
              {stat.value}
            </p>
            <span className="mt-3 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground transition-colors group-hover:text-acid">
              Manage
              <ArrowUpRight className="size-3" aria-hidden="true" />
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="border border-border bg-card/40">
          <header className="flex items-center justify-between gap-3 border-b border-border px-5 py-3">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              Latest writing
            </h2>
            <Link
              to="/admin/blog"
              className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground transition-colors hover:text-acid"
            >
              All posts
            </Link>
          </header>
          <ul>
            {latestPosts.length > 0 ? (
              latestPosts.map((post) => (
                <li
                  key={post.id}
                  className="flex items-center justify-between gap-4 border-b border-border px-5 py-3 last:border-0"
                >
                  <span className="truncate font-mono text-xs text-foreground">
                    {post.title}
                  </span>
                  <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                    {isDraft(post.content) ? (
                      <span className="text-signal">Draft</span>
                    ) : (
                      formatDate(post.createdAt)
                    )}
                  </span>
                </li>
              ))
            ) : (
              <li className="px-5 py-8 text-center font-mono text-xs text-muted-foreground">
                No posts yet.
              </li>
            )}
          </ul>
        </section>

        <section className="border border-border bg-card/40">
          <header className="flex items-center justify-between gap-3 border-b border-border px-5 py-3">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              Latest projects
            </h2>
            <Link
              to="/admin/projects"
              className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground transition-colors hover:text-acid"
            >
              All projects
            </Link>
          </header>
          <ul>
            {latestProjects.length > 0 ? (
              latestProjects.map((project) => (
                <li
                  key={project.id}
                  className="flex items-center justify-between gap-4 border-b border-border px-5 py-3 last:border-0"
                >
                  <span className="truncate font-mono text-xs text-foreground">
                    {project.name}
                  </span>
                  <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                    {formatDate(project.createdAt)}
                  </span>
                </li>
              ))
            ) : (
              <li className="px-5 py-8 text-center font-mono text-xs text-muted-foreground">
                No projects yet.
              </li>
            )}
          </ul>
        </section>
      </div>
    </div>
  )
}
