export type Skill = {
  name: string
  icon: string
}

export type SkillGroup = {
  name: string
  items: Skill[]
}

/**
 * Skills are curated by hand. Keep this list limited to tools
 * that are actually used on the site's projects.
 */
export const skillGroups: SkillGroup[] = [
  {
    name: 'Languages',
    items: [
      { name: 'Python', icon: 'python' },
      { name: 'Go', icon: 'go' },
      { name: 'TypeScript', icon: 'typescript' },
    ],
  },
  {
    name: 'Backend',
    items: [
      { name: 'FastAPI', icon: 'fastapi' },
      { name: 'Django', icon: 'django' },
    ],
  },
  {
    name: 'Frontend',
    items: [{ name: 'NextJS', icon: 'nextjs' }],
  },
  {
    name: 'Data',
    items: [{ name: 'PostgreSQL', icon: 'postgresql' }],
  },
  {
    name: 'Other',
    items: [{ name: 'AI-Ready', icon: 'ai-ready' }],
  },
]

export const skills = skillGroups.flatMap((group) => group.items)
