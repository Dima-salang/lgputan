import { Badge } from '#/components/ui/badge'
import type { LucideIcon } from 'lucide-react'

interface SkillBadgeProps {
  icon: LucideIcon
  label: string
}

export function SkillBadge({ icon: Icon, label }: SkillBadgeProps) {
  return (
    <Badge
      variant="outline"
      className="gap-1.5 px-3 py-1 font-mono text-xs border-[var(--chip-line)] bg-[var(--chip-bg)] hover:bg-[var(--link-bg-hover)] transition-all duration-200"
    >
      <Icon className="size-3" />
      {label}
    </Badge>
  )
}

interface SkillStackProps {
  skills: Array<{ icon: LucideIcon; label: string }>
}

export function SkillStack({ skills }: SkillStackProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {skills.map((skill) => (
        <SkillBadge key={skill.label} icon={skill.icon} label={skill.label} />
      ))}
    </div>
  )
}
