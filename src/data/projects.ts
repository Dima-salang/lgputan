export type ProjectLink = {
  label: string
  href: string
  kind: 'code' | 'live' | 'other'
}

export type Project = {
  name: string
  description: string
  links: ProjectLink[]
}

export function isExternalProjectLink(href: string): boolean {
  return /^https?:\/\//.test(href)
}

export function primaryProjectLink(project: Project): ProjectLink | undefined {
  return (
    project.links.find((link) => link.kind === 'live') ?? project.links.at(0)
  )
}

export const projects: Project[] = [
  {
    name: 'Aika',
    description: 'Time Logging for Teams',
    links: [
      {
        label: 'code',
        href: 'https://github.com/Dima-salang/aika',
        kind: 'code',
      },
      {
        label: 'site',
        href: 'https://aika-logger.vercel.app',
        kind: 'live',
      },
    ],
  },
  {
    name: 'Excelsior Academy',
    description: 'Site for learning with AI through flashcards and lectures',
    links: [
      {
        label: 'code',
        href: 'https://github.com/Dima-salang/excelsior-learning',
        kind: 'code',
      },
      {
        label: 'site',
        href: 'https://excelsior-learning.vercel.app/login',
        kind: 'live',
      },
    ],
  },
  {
    name: 'MangaMangos',
    description: 'Manga Hub for Readers',
    links: [
      {
        label: 'code',
        href: 'https://github.com/Dima-Salang/manga-mangos',
        kind: 'code',
      },
      {
        label: 'site',
        href: 'https://manga-mangos.vercel.app',
        kind: 'live',
      },
    ],
  },
  {
    name: 'PomoLite',
    description: 'CLI-based Pomodoro Timer',
    links: [
      {
        label: 'code',
        href: 'https://github.com/Dima-salang/pomolite',
        kind: 'code',
      },
    ],
  },
]
