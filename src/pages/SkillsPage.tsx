import { ArrowUpRight, Github, Mail } from 'lucide-react'
import { trpc } from '#/integrations/trpc/react'
import { principles, site } from '#/content/site'
import { StackGroups } from '#/components/site/StackGroups'

export function SkillsPage() {
  const { data: skills, isLoading } = trpc.skills.getSkills.useQuery()
  const list = skills ?? []

  return (
    <main id="main" className="page-shell py-14 sm:py-20">
      <div className="border-b border-border pb-10">
        <p className="section-label">
          <span className="index">02</span>
          <span className="text-muted-foreground/50" aria-hidden="true">
            /
          </span>
          <span>Skills</span>
        </p>
        <h1 className="mt-6 max-w-3xl font-display text-[clamp(3.2rem,8vw,6rem)] leading-[0.9] tracking-[-0.035em]">
          What I work with<span className="text-acid">.</span>
        </h1>
        <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          The languages, frameworks, and tools I reach for most, grouped by what
          they do. No ratings — just the things I actually use.
        </p>
      </div>

      <div className="mt-12 grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-8">
          {isLoading ? (
            <div className="grid gap-8 sm:grid-cols-2">
              {[0, 1, 2, 3].map((item) => (
                <div key={item} className="space-y-3">
                  <div className="h-3 w-20 animate-pulse bg-secondary" />
                  <div className="h-9 w-full animate-pulse bg-secondary" />
                  <div className="h-9 w-full animate-pulse bg-secondary" />
                </div>
              ))}
            </div>
          ) : list.length > 0 ? (
            <StackGroups skills={list} columns={2} />
          ) : (
            <div className="border border-border py-16 text-center">
              <p className="font-display text-3xl">Nothing here yet.</p>
              <p className="mt-2 font-mono text-xs text-muted-foreground">
                Skills added in the admin panel will appear here.
              </p>
            </div>
          )}
        </div>

        <aside className="space-y-8 lg:col-span-4">
          <section className="panel p-6">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              How I work
            </h2>
            <ol className="mt-5 space-y-4">
              {principles.map((principle, index) => (
                <li key={principle} className="flex gap-3 text-sm leading-relaxed">
                  <span className="font-mono text-[10px] text-acid">
                    0{index + 1}
                  </span>
                  <span className="text-foreground/85">{principle}</span>
                </li>
              ))}
            </ol>
          </section>

          <section className="panel p-6">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              Find me
            </h2>
            <div className="mt-5 space-y-3">
              <a
                href={site.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-foreground/80 transition-colors hover:text-acid"
              >
                <Github className="size-4" aria-hidden="true" />
                {site.githubHandle}
                <ArrowUpRight className="ml-auto size-3.5" aria-hidden="true" />
              </a>
              <a
                href={`mailto:${site.email}`}
                className="flex items-center gap-2 text-sm text-foreground/80 transition-colors hover:text-acid"
              >
                <Mail className="size-4" aria-hidden="true" />
                Email
                <ArrowUpRight className="ml-auto size-3.5" aria-hidden="true" />
              </a>
            </div>
          </section>

          <p className="font-mono text-[10px] uppercase leading-relaxed tracking-[0.12em] text-muted-foreground">
            {site.availability}
          </p>
        </aside>
      </div>
    </main>
  )
}
