export type ProjectLink = {
  label: string
  href: string
  kind: 'code' | 'live'
}

export type Project = {
  name: string
  description: string
  links: ProjectLink[]
}

export function primaryProjectLink(project: Project): ProjectLink | undefined {
  return (
    project.links.find((link) => link.kind === 'live') ?? project.links.at(0)
  )
}

export const projects: Project[] = [
  {
    name: 'Excelsior Academy',
    description: 'Better lectures and flashcards',
    links: [
      {
        label: 'Source code',
        href: 'https://github.com/Dima-salang/excelsior-learning',
        kind: 'code',
      },
      {
        label: 'Live site',
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
        label: 'Source code',
        href: 'https://github.com/Dima-Salang/manga-mangos',
        kind: 'code',
      },
      {
        label: 'Live site',
        href: 'https://manga-mangos.vercel.app',
        kind: 'live',
      },
    ],
  },
  {
    name: 'PomoLite',
    description: 'CLI-based Pomodoro Timer',
    links: [],
  },
  {
    name: 'Aika',
    description: 'Time Logging for Teams',
    links: [],
  },
]
