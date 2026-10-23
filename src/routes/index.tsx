import { createFileRoute } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { trpc } from '#/integrations/trpc/react'
import {
  Code2,
  FolderOpen,
  ChevronRight,
  User,
  MapPin,
  Briefcase,
  Github,
  Linkedin,
  Globe,
} from 'lucide-react'
import type { Skill } from '#/models/skill'
import type { Project } from '#/models/project'
import type { QuickLink } from '#/models/quick-link'
import { useEffect, useRef, useState } from 'react'

export const Route = createFileRoute('/')({ component: App })

function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    let animId: number
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)
    const chars =
      '01アイウエオカキクケコサシスセソタチツテトナニヌネノ{}[]<>/\\|'
    const fontSize = 13
    let cols = Math.floor(canvas.width / fontSize)
    const drops: number[] = Array(cols).fill(1)
    const draw = () => {
      ctx.fillStyle = 'rgba(0,0,0,0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.font = `${fontSize}px "Courier New", monospace`
      cols = Math.floor(canvas.width / fontSize)
      while (drops.length < cols) drops.push(Math.random() * -100)
      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)]
        const alpha = Math.random() > 0.97 ? 1 : 0.15
        ctx.fillStyle = `rgba(0,255,102,${alpha})`
        ctx.fillText(char, i * fontSize, drops[i] * fontSize)
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975)
          drops[i] = 0
        drops[i]++
      }
      animId = requestAnimationFrame(draw)
    }
    draw()
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.07 }}
    />
  )
}

function Cursor() {
  const [visible, setVisible] = useState(true)
  useEffect(() => {
    const t = setInterval(() => setVisible((v) => !v), 530)
    return () => clearInterval(t)
  }, [])
  return (
    <span
      className="inline-block w-[8px] h-[1.1em] bg-[#00ff66] align-middle ml-0.5"
      style={{ opacity: visible ? 1 : 0 }}
    />
  )
}

function TerminalWindow({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-xl overflow-hidden border border-[#00ff6622] bg-[#0a0e14]/90 backdrop-blur-xl shadow-2xl">
      <div className="flex items-center gap-3 px-5 py-3 bg-[#0d1117] border-b border-[#00ff6622]">
        <button className="size-3.5 rounded-full bg-[#ff5f56]" />
        <button className="size-3.5 rounded-full bg-[#ffbd2e]" />
        <button className="size-3.5 rounded-full bg-[#27c93f]" />
        <span className="ml-4 font-mono text-sm text-[#4a5568] flex-1 text-center -ml-14">
          {title}
        </span>
      </div>
      <div className="p-6 space-y-5">{children}</div>
    </div>
  )
}

function StaticLine({ cmd }: { cmd: string }) {
  return (
    <div className="font-mono text-base">
      <span className="text-[#00ff66] select-none">
        <span className="text-[#00b4d8]">lgab</span>
        <span className="text-[#888]">@</span>
        <span className="text-[#9d4edd]">portfolio</span>
        <span className="text-[#888]">:~$</span>
      </span>
      <span className="text-[#e2e8f0] ml-2">{cmd}</span>
    </div>
  )
}

function ProfileSection() {
  return (
    <div className="space-y-4 mt-2">
      <div className="flex items-center gap-3 text-base">
        <User className="size-5 text-[#00b4d8]" />
        <span className="text-[#00b4d8]">NAME</span>
        <span className="text-[#4a5568]">:</span>
        <span className="text-[#e2e8f0]">Luis Gabrielle Putan</span>
      </div>
      <div className="flex items-center gap-3 text-base">
        <Briefcase className="size-5 text-[#9d4edd]" />
        <span className="text-[#9d4edd]">ROLE</span>
        <span className="text-[#4a5568]">:</span>
        <span className="text-[#e2e8f0]">Computer Science Student</span>
      </div>
      <div className="flex items-center gap-3 text-base">
        <MapPin className="size-5 text-[#00ff66]" />
        <span className="text-[#00ff66]">LOCATION</span>
        <span className="text-[#4a5568]">:</span>
        <span className="text-[#e2e8f0]">Philippines</span>
      </div>
    </div>
  )
}

function ProjectsSection({ projects }: { projects?: Project[] }) {
  return (
    <div className="mt-1">
      <div className="flex flex-wrap gap-2">
        {projects?.slice(0, 8).map((project) => (
          <a
            key={project.id}
            href={project.url?.split(',')[0]?.trim()}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 px-4 py-2 rounded-lg border border-[#00ff6614] bg-[#0d1117]/60 hover:border-[#00ff6640] hover:bg-[#0d1117]/90 transition-all font-mono text-sm"
          >
            <FolderOpen className="size-4 text-[#00ff66] shrink-0" />
            <span className="text-[#e2e8f0] group-hover:text-[#00ff99]">
              {project.name}
            </span>
          </a>
        ))}
        {(!projects || projects.length === 0) && (
          <span className="font-mono text-sm text-[#2d3748]">
            no projects found
          </span>
        )}
      </div>
    </div>
  )
}

function SkillsSection({ skills }: { skills?: Skill[] }) {
  return (
    <div className="mt-1">
      <div className="flex flex-wrap gap-2">
        {skills?.map((skill) => (
          <span
            key={skill.id}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#00ff6622] bg-[#00ff6608] font-mono text-sm text-[#00ff99]"
          >
            <Code2 className="size-4" />
            {skill.name}
          </span>
        ))}
        {(!skills || skills.length === 0) && (
          <span className="font-mono text-sm text-[#2d3748]">
            no skills installed
          </span>
        )}
      </div>
    </div>
  )
}

function SocialsSection({ links }: { links?: QuickLink[] }) {
  const getIcon = (icon: string) => {
    switch (icon) {
      case 'github':
        return <Github className="size-5" />
      case 'linkedin':
        return <Linkedin className="size-5" />
      default:
        return <Globe className="size-5" />
    }
  }
  return (
    <div className="mt-1">
      <div className="flex flex-wrap gap-3">
        {links
          ?.filter((l) => l.url)
          .map((link) => (
            <a
              key={link.id}
              href={link.url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#00b4d822] bg-[#00b4d808] hover:border-[#00b4d844] transition-all font-mono text-base text-[#00b4d8]"
            >
              {getIcon(link.icon || 'external')}
              {link.name}
            </a>
          ))}
        {(!links || links.length === 0) && (
          <span className="font-mono text-sm text-[#2d3748]">
            no links configured
          </span>
        )}
      </div>
    </div>
  )
}

function NavLinks() {
  const links = [
    { cmd: 'about', href: '/about', desc: 'Learn more about me' },
    { cmd: 'projects', href: '/projects', desc: 'View my work' },
    { cmd: 'skills', href: '/skills', desc: 'Tech stack' },
    { cmd: 'blog', href: '/blog', desc: 'Read posts' },
  ]
  return (
    <div className="mt-2 space-y-2">
      {links.map((link) => (
        <Link
          key={link.href}
          to={link.href}
          className="group flex items-center gap-4 rounded-lg px-4 py-3 hover:bg-[#00ff660a] border border-transparent hover:border-[#00ff6620] transition-all"
        >
          <span className="text-[#00ff66] font-mono">$</span>
          <span className="font-mono text-base">
            <span className="text-[#00b4d8]">cd</span>
            <span className="text-[#e2e8f0] ml-2">./{link.cmd}</span>
            <span className="text-[#4a5568] ml-3"># {link.desc}</span>
          </span>
          <ChevronRight className="size-4 text-[#2d3748] ml-auto group-hover:text-[#00ff66] group-hover:translate-x-1 transition-all" />
        </Link>
      ))}
    </div>
  )
}

function App() {
  const { data: skills } = trpc.skills.getSkills.useQuery()
  const { data: projects } = trpc.projects.getProjects.useQuery()
  const { data: quickLinks } = trpc.quickLinks.getQuickLinks.useQuery()

  useEffect(() => {
    const now = Date.now()
    localStorage.setItem('last_home_visit', now.toString())
  }, [])

  return (
    <div
      className="relative min-h-screen bg-[#060810] text-[#e2e8f0]"
      style={{
        fontFamily: '"JetBrains Mono", "Fira Code", "Courier New", monospace',
      }}
    >
      <MatrixRain />
      <div
        className="fixed inset-0 pointer-events-none z-[1]"
        style={{
          background:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)',
        }}
      />
      <div
        className="fixed inset-0 pointer-events-none z-[1]"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(0,180,216,0.04) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10">
        <div className="max-w-5xl mx-auto px-6 py-10 sm:py-16">
          <TerminalWindow title="~/portfolio — zsh">
            <StaticLine cmd="whoami" />
            <ProfileSection />

            <StaticLine cmd="ls -la ~/projects" />
            <ProjectsSection projects={projects} />

            <StaticLine cmd="cat /proc/skills" />
            <SkillsSection skills={skills} />

            <StaticLine cmd="cat ~/.config/socials" />
            <SocialsSection links={quickLinks || []} />

            <StaticLine cmd="ls -la ~/routes/" />
            <NavLinks />

            <div className="flex items-center gap-2 font-mono text-base mt-3">
              <span className="text-[#00b4d8]">lgab</span>
              <span className="text-[#888]">@</span>
              <span className="text-[#9d4edd]">portfolio</span>
              <span className="text-[#888]">:~$</span>
              <Cursor />
            </div>
          </TerminalWindow>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600&display=swap');
      `}</style>
    </div>
  )
}
