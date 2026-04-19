import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { Badge } from '#/components/ui/badge'

interface ProjectCardProps {
  title: string
  description: string
  tech: string[]
  status: 'active' | 'maintained' | 'archived'
  href?: string
}

export function ProjectCard({
  title,
  description,
  tech,
  status,
  href,
}: ProjectCardProps) {
  const statusColors = {
    active:
      'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    maintained:
      'bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30',
    archived:
      'bg-zinc-500/20 text-zinc-600 dark:text-zinc-400 border-zinc-500/30',
  }

  const content = (
    <Card className="group relative overflow-hidden border-[var(--chip-line)] bg-[var(--surface)] hover:border-[var(--lagoon-deep)]/30 transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--lagoon)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="font-mono text-base font-semibold tracking-tight">
            <span className="text-[var(--lagoon-deep)]">{'>'}</span> {title}
          </CardTitle>
          <Badge variant="outline" className={statusColors[status]}>
            {status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm text-[var(--muted-foreground)] mb-3">
          {description}
        </CardDescription>
        <div className="flex flex-wrap gap-1.5">
          {tech.map((t) => (
            <Badge
              key={t}
              variant="secondary"
              className="font-mono text-[10px] px-2 py-0"
            >
              {t}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )

  if (href) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className="block">
        {content}
      </a>
    )
  }

  return content
}
