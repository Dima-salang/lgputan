import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight, ArrowUpRight, Github, Mail } from 'lucide-react'
import { trpc } from '#/integrations/trpc/react'
import { now, site } from '#/content/site'
import { isDraft } from '#/lib/data'
import { ArchiveRow } from '#/components/site/ArchiveRow'
import { LocalTime } from '#/components/site/LocalTime'
import { Marquee } from '#/components/site/Marquee'
import { ProjectRow } from '#/components/site/ProjectRow'
import { SectionHead } from '#/components/site/SectionHead'
import { StackGroups } from '#/components/site/StackGroups'

export const Route = createFileRoute('/')({ component: Home })

function NowPanel() {
  return (
    <div className="panel relative overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="size-2 rounded-full bg-signal/70" />
          <span className="size-2 rounded-full bg-acid/60" />
          <span className="size-2 rounded-full bg-soft/60" />
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          Now
        </span>
      </div>

      <dl>
        {now.map((item) => (
          <div
            key={item.label}
            className="flex items-baseline justify-between gap-4 border-b border-border px-4 py-3.5"
          >
            <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
              {item.label}
            </dt>
            <dd className="text-right font-mono text-xs text-foreground">
              {item.value}
            </dd>
          </div>
        ))}

        <div className="flex items-baseline justify-between gap-4 border-b border-border px-4 py-3.5">
          <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            Local time
          </dt>
          <dd className="font-mono text-xs text-foreground">
            <LocalTime />
          </dd>
        </div>

        <div className="flex items-baseline justify-between gap-4 px-4 py-3.5">
          <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            GitHub
          </dt>
          <dd>
            <a
              href={site.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-mono text-xs text-foreground transition-colors hover:text-acid"
            >
              {site.githubHandle}
              <ArrowUpRight className="size-3" aria-hidden="true" />
            </a>
          </dd>
        </div>
      </dl>

      <div className="flex items-center justify-between border-t border-border px-4 py-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
          GMT+8
        </span>
        <span
          className="animate-blink font-mono text-xs text-acid"
          aria-hidden="true"
        >
          _
        </span>
      </div>
    </div>
  )
}

function Home() {
  const projectsQuery = trpc.projects.getProjects.useQuery()
  const skillsQuery = trpc.skills.getSkills.useQuery()
  const postsQuery = trpc.blog.getPosts.useQuery()

  const projects = projectsQuery.data ?? []
  const skills = skillsQuery.data ?? []
  const publishedPosts = (postsQuery.data ?? []).filter(
    (post) => !isDraft(post.content),
  )

  return (
    <main id="main">
      <section className="relative overflow-hidden border-b border-border">
        <div
          className="dot-grid pointer-events-none absolute inset-0 opacity-50"
          aria-hidden="true"
        />
        <div className="page-shell relative grid gap-12 pb-16 pt-14 lg:grid-cols-12 lg:gap-10 lg:pb-24 lg:pt-20">
          <div className="lg:col-span-7">
            <div className="reveal flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <span
                  className="size-1.5 rounded-full bg-acid"
                  aria-hidden="true"
                />
                {site.availability}
              </span>
              <span className="text-border" aria-hidden="true">
                /
              </span>
              <span>{site.location}</span>
            </div>

            <h1
              className="reveal mt-7 font-display text-[clamp(3.4rem,9vw,7rem)] leading-[0.86] tracking-[-0.035em]"
              style={{ animationDelay: '80ms' }}
            >
              {site.displayFirst}
              <br />
              <span className="italic">{site.displayLast}</span>
              <span className="text-acid">.</span>
            </h1>

            <p
              className="reveal mt-8 max-w-xl text-lg leading-relaxed text-foreground/90"
              style={{ animationDelay: '160ms' }}
            >
              {site.shortRole}. {site.intro}
            </p>

            <p
              className="reveal mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground"
              style={{ animationDelay: '220ms' }}
            >
              Currently building Excelsior Academy and finishing a Computer
              Science degree.
            </p>

            <div
              className="reveal mt-9 flex flex-wrap items-center gap-6"
              style={{ animationDelay: '280ms' }}
            >
              <Link
                to="/projects"
                className="group inline-flex items-center gap-3 bg-primary px-5 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-primary-foreground transition-colors hover:bg-primary/90"
              >
                See my work
                <ArrowRight
                  className="size-4 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
              <a
                href={`mailto:${site.email}`}
                className="link-underline text-[11px] uppercase tracking-[0.14em]"
              >
                <Mail className="size-3.5" aria-hidden="true" />
                Email me
              </a>
            </div>
          </div>

          <div
            className="reveal lg:col-span-5"
            style={{ animationDelay: '180ms' }}
          >
            <NowPanel />
          </div>
        </div>
      </section>

      <Marquee items={skills.map((skill) => skill.name)} />

      <div className="page-shell">
        <section className="py-16 sm:py-20">
          <SectionHead
            index="01"
            title="Selected work"
            action={
              <Link
                to="/projects"
                className="link-underline text-[10px] uppercase tracking-[0.12em]"
              >
                All projects
                <ArrowUpRight className="size-3.5" aria-hidden="true" />
              </Link>
            }
          />

          <div>
            {projectsQuery.isLoading ? (
              <div className="space-y-3 border-t border-border py-8">
                <div className="h-8 w-56 animate-pulse bg-secondary" />
                <div className="h-4 w-full max-w-md animate-pulse bg-secondary" />
              </div>
            ) : projects.length > 0 ? (
              projects
                .slice(0, 4)
                .map((project, index) => (
                  <ProjectRow
                    key={project.id}
                    project={project}
                    index={index + 1}
                  />
                ))
            ) : (
              <div className="border-t border-border py-14 text-center">
                <p className="font-mono text-xs text-muted-foreground">
                  No projects yet. New work will appear here.
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="border-t border-border py-16 sm:py-20">
          <SectionHead
            index="02"
            title="Tools I work with"
            action={
              <Link
                to="/skills"
                className="link-underline text-[10px] uppercase tracking-[0.12em]"
              >
                All skills
                <ArrowUpRight className="size-3.5" aria-hidden="true" />
              </Link>
            }
          />

          {skillsQuery.isLoading ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2].map((item) => (
                <div key={item} className="space-y-3">
                  <div className="h-3 w-20 animate-pulse bg-secondary" />
                  <div className="h-9 w-full animate-pulse bg-secondary" />
                  <div className="h-9 w-full animate-pulse bg-secondary" />
                </div>
              ))}
            </div>
          ) : skills.length > 0 ? (
            <StackGroups skills={skills} />
          ) : (
            <p className="py-10 text-center font-mono text-xs text-muted-foreground">
              No skills added yet.
            </p>
          )}
        </section>

        <section className="border-t border-border py-16 sm:py-20">
          <SectionHead
            index="03"
            title="Writing"
            action={
              <Link
                to="/blog"
                className="link-underline text-[10px] uppercase tracking-[0.12em]"
              >
                All writing
                <ArrowUpRight className="size-3.5" aria-hidden="true" />
              </Link>
            }
          />

          <div>
            {postsQuery.isLoading ? (
              <div className="space-y-3 border-t border-border py-6">
                <div className="h-3 w-24 animate-pulse bg-secondary" />
                <div className="h-7 w-72 animate-pulse bg-secondary" />
              </div>
            ) : publishedPosts.length > 0 ? (
              publishedPosts
                .slice(0, 3)
                .map((post) => <ArchiveRow key={post.id} post={post} />)
            ) : (
              <div className="border-t border-border py-12 text-center">
                <p className="font-mono text-xs text-muted-foreground">
                  No published posts yet. The first one is in progress.
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="border-t border-border py-16 sm:py-24">
          <p className="section-label">
            <span className="index">04</span>
            <span className="text-muted-foreground/50" aria-hidden="true">
              /
            </span>
            <span>Contact</span>
          </p>

          <div className="mt-8 grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <h2 className="font-display text-[clamp(2.8rem,7vw,5.5rem)] leading-[0.92] tracking-[-0.03em]">
                Let&apos;s build
                <br />
                <span className="italic">something.</span>
              </h2>
            </div>

            <div className="space-y-6 self-end lg:col-span-4">
              <p className="text-sm leading-relaxed text-muted-foreground">
                I&apos;m open to internships and happy to talk about projects,
                school, or anything you&apos;re building.
              </p>

              <a
                href={`mailto:${site.email}`}
                className="link-underline break-all text-sm sm:text-base"
              >
                <Mail className="size-4" aria-hidden="true" />
                {site.email}
              </a>

              <a
                href={site.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-fit items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-acid"
              >
                <Github className="size-4" aria-hidden="true" />
                {site.githubHandle}
                <ArrowUpRight className="size-3.5" aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
