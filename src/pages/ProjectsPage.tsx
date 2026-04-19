import { trpc } from '#/integrations/trpc/react'

export function ProjectsPage() {
  const { data: projects } = trpc.projects.getProjects.useQuery()

  return (
    <div>
      <h1>Projects</h1>
      {projects?.map((project) => (
        <div key={project.id}>{project.name}</div>
      ))}
    </div>
  )
}
