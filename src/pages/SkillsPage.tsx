import { trpc } from '#/integrations/trpc/react'
import type { Skill } from '#/models/skill'

export function SkillsPage() {
  const { data: skills } = trpc.skills.getSkills.useQuery()

  return (
    <div>
      <h1>Skills</h1>
      {skills?.map((skill: Skill) => (
        <div key={skill.id}>{skill.name}</div>
      ))}
    </div>
  )
}
