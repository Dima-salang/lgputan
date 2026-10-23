import { ArrowUpRight, ExternalLink, Github } from 'lucide-react'
import { splitLinks } from '#/lib/data'
import type { Project } from '#/models/project'
import { Dither } from './Dither'

export function ProjectRow({
  project,
  index,
}: {
  project: Project
  index: number
}) {
  const links = splitLinks(project.url)
  const primary = links.at(0)

  return (
    <article className="group -mx-4 grid grid-cols-[2.25rem_1fr] gap-x-4 border-t border-border px-4 py-8 transition-colors duration-300 hover:bg-card/50 sm:grid-cols-[3.5rem_1fr_auto] sm:gap-x-8 sm:py-9">
      <span className="pt-1.5 font-mono text-[11px] text-muted-foreground">
        {String(index).padStart(2, '0')}
      </span>

      <div className="min-w-0">
        <h3 className="font-display text-3xl leading-none tracking-tight sm:text-4xl">
          {primary ? (
            <a
              href={primary.href}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors group-hover:text-acid"
            >
              {project.name}
            </a>
          ) : (
            <span className="transition-colors group-hover:text-acid">
              {project.name}
            </span>
          )}
        </h3>

        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
          {project.description || 'No description added yet.'}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
          {links.length > 0 ? (
            links.map((link) => {
              const Icon = link.kind === 'code' ? Github : ExternalLink
              return (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground transition-colors hover:text-acid"
                >
                  <Icon className="size-3" aria-hidden="true" />
                  {link.label}
                </a>
              )
            })
          ) : (
            <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground/70">
              No links yet
            </span>
          )}
        </div>
      </div>

      <div className="hidden flex-col items-end justify-between gap-4 sm:flex">
        <Dither seed={project.name} />
        <ArrowUpRight
          className="size-5 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-acid"
          aria-hidden="true"
        />
      </div>
    </article>
  )
}
