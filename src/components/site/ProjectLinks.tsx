import { ArrowUpRight } from 'lucide-react'
import type { ProjectLink } from '#/data/projects'
import { isExternalProjectLink } from '#/data/projects'

export function ProjectLinks({
  links,
  className = '',
}: {
  links: ProjectLink[]
  className?: string
}) {
  if (links.length === 0) {
    return (
      <p className={`text-xs text-muted-foreground/70 ${className}`}>
        No public link yet
      </p>
    )
  }

  return (
    <div
      className={`flex flex-wrap items-center gap-x-5 gap-y-2 text-xs ${className}`}
    >
      {links.map((link) => {
        const external = isExternalProjectLink(link.href)

        return (
          <a
            key={`${link.kind}-${link.href}`}
            href={link.href}
            target={external ? '_blank' : undefined}
            rel={external ? 'noopener noreferrer' : undefined}
            className="link-underline"
          >
            {link.label}
            <ArrowUpRight className="size-3" aria-hidden="true" />
          </a>
        )
      })}
    </div>
  )
}
