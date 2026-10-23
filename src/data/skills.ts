export type Skill = {
  name: string
  icon: string
}

export type SkillGroup = {
  name: string
  items: Skill[]
}

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
    items: [
      { name: 'AI-Ready', icon: 'ai-ready' },
      { name: 'Unity', icon: 'unity' },
    ],
  },
]

export const skills = skillGroups.flatMap((group) => group.items)
