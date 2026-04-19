import { Github, Linkedin, ArrowUpRight } from 'lucide-react'

interface QuickLink {
  href: string
  label: string
  icon: 'github' | 'linkedin' | 'external'
}

interface QuickLinksProps {
  links: QuickLink[]
}

const iconMap = {
  github: Github,
  linkedin: Linkedin,
  external: ArrowUpRight,
}

export function QuickLinks({ links }: QuickLinksProps) {
  return (
    <div className="space-y-1">
      {links.map((link) => {
        const Icon = iconMap[link.icon]
        return (
          <a
            key={link.href + link.label}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-[var(--link-bg-hover)] transition-colors -mx-3"
          >
            <Icon className="size-4 text-[var(--muted-foreground)]" />
            {link.label}
            <ArrowUpRight className="size-3 ml-auto text-[var(--muted-foreground)]" />
          </a>
        )
      })}
    </div>
  )
}
