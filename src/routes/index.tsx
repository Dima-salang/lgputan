import { createFileRoute } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { Separator } from '#/components/ui/separator'
import { trpc } from '#/integrations/trpc/react'
import { Terminal, Code2, FolderOpen, Layers } from 'lucide-react'
import { TerminalWindow } from '#/components/TerminalWindow'
import { ProjectCard } from '#/components/ProjectCard'
import { ProfileCard } from '#/components/ProfileCard'
import { SkillBadge } from '#/components/SkillBadge'
import { QuickLinks } from '#/components/QuickLinks'
import type { Skill } from '#/models/skill'


export const Route = createFileRoute('/')({ component: App })

const projects = [
  {
    title: 'Full-Stack Platform',
    description:
      'A modern web application with real-time features and seamless user experience.',
    tech: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
    status: 'active' as const,
  },
  {
    title: 'API Gateway',
    description:
      'Scalable microservice architecture with authentication and rate limiting.',
    tech: ['Go', 'Docker', 'Redis', 'GRPC'],
    status: 'maintained' as const,
  },
  {
    title: 'Design System',
    description: 'Component library with accessibility and dark mode support.',
    tech: ['React', 'Tailwind', 'Storybook'],
    status: 'maintained' as const,
  },
  {
    title: 'Data Pipeline',
    description: 'ETL processing with real-time analytics dashboard.',
    tech: ['Python', 'Airflow', 'ClickHouse'],
    status: 'archived' as const,
  },
]

function NavCommand({
  cmd,
  desc,
  href,
}: {
  cmd: string
  desc: string
  href: string
}) {
  return (
    <Link
      to={href}
      className="group flex items-start gap-3 rounded-lg p-3 -mx-3 hover:bg-[var(--link-bg-hover)] transition-all duration-200"
    >
      <span className="font-mono text-sm text-[var(--lagoon-deep)] shrink-0 group-hover:text-[var(--lagoon)] transition-colors">
        {cmd}
      </span>
      <span className="text-sm font-medium text-[var(--foreground)]">
        {desc}
      </span>
    </Link>
  )
}

function App() {
  const { data: skills } = trpc.skills.getSkills.useQuery()

  return (
    <div className="page-wrap py-8 sm:py-12">
      <div className="grid gap-8 lg:grid-cols-[1fr_320px] lg:gap-12">
        <div className="space-y-8">
          <section className="rise-in" style={{ animationDelay: '0ms' }}>
            <TerminalWindow
              lines={[{ command: `echo "Welcome to my digital workspace"` }]}
            />
          </section>

          <Separator className="my-6" />

          <section
            className="rise-in space-y-4"
            style={{ animationDelay: '100ms' }}
          >
            <h2 className="font-mono text-lg font-semibold flex items-center gap-2">
              <Terminal className="size-5 text-[var(--lagoon-deep)]" />
              <span className="text-[var(--foreground)]">Navigation</span>
            </h2>
            <div className="grid gap-1 sm:grid-cols-2">
              <NavCommand cmd="cd ./about" desc="About me" href="/about" />
              <NavCommand
                cmd="cd ./projects"
                desc="View projects"
                href="/projects"
              />
              <NavCommand cmd="cd ./blog" desc="Read blog posts" href="/blog" />
            </div>
          </section>

          <Separator className="my-6" />

          <section
            className="rise-in space-y-4"
            style={{ animationDelay: '200ms' }}
          >
            <h2 className="font-mono text-lg font-semibold flex items-center gap-2">
              <Code2 className="size-5 text-[var(--lagoon-deep)]" />
              <span className="text-[var(--foreground)]">
                Featured Projects
              </span>
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {projects.map((project) => (
                <ProjectCard key={project.title} {...project} />
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
          <section className="rise-in" style={{ animationDelay: '150ms' }}>
            <ProfileCard
              name="Guest Developer"
              role="Full-Stack Engineer"
              location="Remote / Worldwide"
            />
          </section>

          <section
            className="rise-in space-y-3"
            style={{ animationDelay: '250ms' }}
          >
            <h3 className="font-mono text-sm font-semibold text-[var(--muted-foreground)] flex items-center gap-2">
              <Layers className="size-4" />
              Tech Stack
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {skills?.map((skill: Skill) => (
                <SkillBadge key={skill.id} icon={Code2} label={skill.name} />
              ))}

            </div>
          </section>

          <section
            className="rise-in space-y-3"
            style={{ animationDelay: '300ms' }}
          >
            <h3 className="font-mono text-sm font-semibold text-[var(--muted-foreground)] flex items-center gap-2">
              <FolderOpen className="size-4" />
              Quick Links
            </h3>
            <QuickLinks
              links={[
                { href: 'https://github.com', label: 'GitHub', icon: 'github' },
                {
                  href: 'https://linkedin.com',
                  label: 'LinkedIn',
                  icon: 'linkedin',
                },
              ]}
            />
          </section>
        </aside>
      </div>
    </div>
  )
}
