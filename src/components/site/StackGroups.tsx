import {
  Atom,
  Boxes,
  Braces,
  Brain,
  Code2,
  Database,
  FileCode,
  Layers,
  Palette,
  Zap,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { skillGroups } from '#/content/site'
import type { Skill } from '#/models/skill'

const icons: Record<string, LucideIcon> = {
  python: Braces,
  go: Boxes,
  typescript: FileCode,
  javascript: FileCode,
  fastapi: Zap,
  django: Layers,
  nextjs: Atom,
  react: Atom,
  tailwind: Palette,
  'tailwind css': Palette,
  postgresql: Database,
  sqlite: Database,
  'ai-ready': Brain,
  code: Code2,
}

function iconFor(skill: Skill): LucideIcon {
  const byIcon = icons[(skill.icon ?? '').toLowerCase().trim()]
  const byName = icons[skill.name.toLowerCase().trim()]
  return byIcon ?? byName ?? Code2
}

function normalize(value: string): string {
  return value.toLowerCase().replace(/\s+/g, ' ').trim()
}

function groupSkills(skills: Skill[]) {
  const byName = new Map(skills.map((skill) => [normalize(skill.name), skill]))
  const used = new Set<string>()

  const groups = skillGroups.map((group) => {
    const items = group.items
      .map((name) => byName.get(normalize(name)))
      .filter((skill): skill is Skill => Boolean(skill))

    items.forEach((skill) => used.add(normalize(skill.name)))
    return { name: group.name, items }
  })

  const other = groups.find((group) => group.name === 'Other')
  if (other) {
    for (const skill of skills) {
      if (!used.has(normalize(skill.name))) {
        other.items.push(skill)
        used.add(normalize(skill.name))
      }
    }
  }

  return groups.filter((group) => group.items.length > 0)
}

export function StackGroups({
  skills,
  columns = 3,
}: {
  skills: Skill[]
  columns?: 2 | 3
}) {
  const groups = groupSkills(skills)

  return (
    <div
      className={
        columns === 2
          ? 'grid gap-x-10 gap-y-8 sm:grid-cols-2'
          : 'grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3'
      }
    >
      {groups.map((group) => (
        <section key={group.name}>
          <div className="mb-3 flex items-baseline justify-between gap-3">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              {group.name}
            </h3>
            <span className="font-mono text-[10px] text-muted-foreground/60">
              {String(group.items.length).padStart(2, '0')}
            </span>
          </div>
          <ul className="border-t border-border">
            {group.items.map((skill) => {
              const Icon = iconFor(skill)
              return (
                <li
                  key={skill.id}
                  className="flex items-center gap-2.5 border-b border-border py-2.5 font-mono text-[13px] text-foreground"
                >
                  <Icon className="size-3.5 shrink-0 text-acid" aria-hidden="true" />
                  {skill.name}
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </div>
  )
}
