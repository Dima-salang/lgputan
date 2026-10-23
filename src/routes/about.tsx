import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowUpRight, Github, Mail } from 'lucide-react'
import { bio, now, principles, site } from '#/content/site'
import { Dither } from '#/components/site/Dither'
import { LocalTime } from '#/components/site/LocalTime'

export const Route = createFileRoute('/about')({
  component: About,
})

function About() {
  return (
    <main id="main" className="page-shell py-14 sm:py-20">
      <div className="border-b border-border pb-10">
        <p className="section-label">
          <span className="index">04</span>
          <span className="text-muted-foreground/50" aria-hidden="true">
            /
          </span>
          <span>About</span>
        </p>
      </div>

      <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-8">
          <h1 className="font-display text-[clamp(3.2rem,8vw,6rem)] leading-[0.88] tracking-[-0.035em]">
            {site.displayFirst}
            <br />
            <span className="italic">{site.displayLast}</span>
            <span className="text-acid">.</span>
          </h1>

          <div className="mt-10 max-w-2xl space-y-6">
            {bio.map((paragraph, index) => (
              <p
                key={paragraph}
                className={
                  index === 0
                    ? 'text-lg leading-relaxed text-foreground sm:text-xl'
                    : 'text-base leading-relaxed text-muted-foreground'
                }
              >
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-6">
            <a
              href={`mailto:${site.email}`}
              className="link-underline text-[10px] uppercase tracking-[0.12em]"
            >
              <Mail className="size-3.5" aria-hidden="true" />
              Email me
            </a>
            <a
              href={site.github}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline text-[10px] uppercase tracking-[0.12em]"
            >
              <Github className="size-3.5" aria-hidden="true" />
              {site.githubHandle}
            </a>
            <Link
              to="/projects"
              className="link-underline text-[10px] uppercase tracking-[0.12em]"
            >
              See the work
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <aside className="lg:col-span-4">
          <div className="panel p-6">
            <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              <span>Profile</span>
              <span>2026</span>
            </div>

            <div className="my-10 flex items-end justify-between gap-4">
              <span className="font-display text-[5.5rem] leading-[0.75]">
                LP<span className="text-acid">.</span>
              </span>
              <Dither seed={site.name} rows={4} columns={6} />
            </div>

            <dl className="border-t border-border">
              {now.map((item) => (
                <div
                  key={item.label}
                  className="flex items-baseline justify-between gap-4 border-b border-border py-3"
                >
                  <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                    {item.label}
                  </dt>
                  <dd className="text-right font-mono text-[11px] text-foreground">
                    {item.value}
                  </dd>
                </div>
              ))}
              <div className="flex items-baseline justify-between gap-4 py-3">
                <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                  Local time
                </dt>
                <dd className="font-mono text-[11px] text-foreground">
                  <LocalTime />
                </dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>

      <section className="mt-16 grid gap-8 border-t border-border pt-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <h2 className="section-label">
            <span>How I work</span>
          </h2>
        </div>

        <ol className="lg:col-span-8">
          {principles.map((principle, index) => (
            <li
              key={principle}
              className="grid grid-cols-[2rem_1fr] gap-4 border-b border-border py-5 first:border-t"
            >
              <span className="pt-1 font-mono text-[10px] text-acid">
                0{index + 1}
              </span>
              <p className="font-display text-2xl leading-snug sm:text-3xl">
                {principle}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-16 border-t border-border pt-12">
        <h2 className="font-display text-[clamp(2.8rem,7vw,5rem)] leading-[0.95] tracking-[-0.03em]">
          Say hello<span className="text-acid">.</span>
        </h2>
        <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
              {site.availability}. I&apos;m happy to talk about internships,
              projects, or anything you&apos;re building.
            </p>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
              {site.location}
            </p>
          </div>
          <a
            href={`mailto:${site.email}`}
            className="link-underline break-all text-sm sm:text-base"
          >
            <Mail className="size-4" aria-hidden="true" />
            {site.email}
          </a>
        </div>
      </section>
    </main>
  )
}
