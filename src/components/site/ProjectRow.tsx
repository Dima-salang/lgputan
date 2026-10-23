import { ArrowUpRight } from 'lucide-react'
import type { Project } from '#/data/projects'
import { primaryProjectLink } from '#/data/projects'

export function ProjectRow({ project }: { project: Project }) {
  const primary = primaryProjectLink(project)

  return (
    <article className="group border-t border-border py-7">
      <h3 className="text-base leading-snug">
        {primary ? (
          <a
            href={primary.href}
            target="_blank"
            rel="noopener noreferrer"
            className="row-link inline-flex items-baseline gap-1.5"
          >
            {project.name}
            <ArrowUpRight
              className="size-3.5 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </a>
        ) : (
          project.name
        )}
      </h3>

      <p className="mt-2 max-w-xl text-sm leading-7 text-muted-foreground">
        {project.description || 'No description added yet.'}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs">
        {project.links.length > 0 ? (
          project.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline"
            >
              {link.label}
              <ArrowUpRight className="size-3" aria-hidden="true" />
            </a>
          ))
        ) : (
          <span className="text-muted-foreground/70">No public link yet</span>
        )}
      </div>
    </article>
  )
}
