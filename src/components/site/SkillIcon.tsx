import {
  Atom,
  Boxes,
  Braces,
  Brain,
  Code2,
  Database,
  FileCode,
  Layers,
  Zap,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const icons: Record<string, LucideIcon> = {
  python: Braces,
  go: Boxes,
  typescript: FileCode,
  javascript: FileCode,
  fastapi: Zap,
  django: Layers,
  nextjs: Atom,
  react: Atom,
  tailwind: FileCode,
  'tailwind css': FileCode,
  postgresql: Database,
  sqlite: Database,
  'ai-ready': Brain,
  code: Code2,
}

export function SkillIcon({
  name,
  className,
}: {
  name: string
  className?: string
}) {
  const Icon = icons[name.toLowerCase().trim()] ?? Code2
  return <Icon className={className} aria-hidden="true" />
}
