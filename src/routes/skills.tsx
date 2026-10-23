import { createFileRoute } from '@tanstack/react-router'
import { SkillsPage } from '#/pages/SkillsPage'

export const Route = createFileRoute('/skills')({
  component: SkillsPage,
})
