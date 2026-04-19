import { createFileRoute } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { Separator } from '#/components/ui/separator'
import { trpc } from '#/integrations/trpc/react'
import {
  Terminal,
  Code2,
  FolderOpen,
  Layers,
  ChevronRight,
  ExternalLink,
  Wifi,
  Battery,
  Clock,
} from 'lucide-react'
import { ProfileCard } from '#/components/ProfileCard'
import { SkillBadge } from '#/components/SkillBadge'
import { QuickLinks } from '#/components/QuickLinks'
import type { Skill } from '#/models/skill'
import type { Project } from '#/models/project'
import { useEffect, useRef, useState } from 'react'

export const Route = createFileRoute('/')({ component: App })

// ─── Typing animation hook ────────────────────────────────────────────────────
function useTypewriter(text: string, speed = 40, delay = 0) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  useEffect(() => {
    let i = 0
    setDisplayed('')
    setDone(false)
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayed(text.slice(0, i + 1))
        i++
        if (i >= text.length) {
          clearInterval(interval)
          setDone(true)
        }
      }, speed)
      return () => clearInterval(interval)
    }, delay)
    return () => clearTimeout(timer)
  }, [text, speed, delay])
  return { displayed, done }
}

// ─── ASCII rain canvas background ─────────────────────────────────────────────
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

    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノ{}[]<>/\\|'
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

// ─── Blinking cursor ───────────────────────────────────────────────────────────
function Cursor({ show = true }: { show?: boolean }) {
  const [visible, setVisible] = useState(true)
  useEffect(() => {
    const t = setInterval(() => setVisible((v) => !v), 530)
    return () => clearInterval(t)
  }, [])
  if (!show) return null
  return (
    <span
      className="inline-block w-[8px] h-[1.1em] bg-[var(--lagoon)] align-middle ml-0.5"
      style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.08s' }}
    />
  )
}

// ─── Terminal line with typewriter ────────────────────────────────────────────
function TerminalLine({
  cmd,
  output,
  delay = 0,
  speed = 35,
  onDone,
}: {
  cmd: string
  output?: React.ReactNode
  delay?: number
  speed?: number
  onDone?: () => void
}) {
  const { displayed, done } = useTypewriter(cmd, speed, delay)
  useEffect(() => { if (done && onDone) onDone() }, [done])

  return (
    <div className="font-mono text-sm leading-relaxed">
      <div className="flex items-center gap-2 group">
        <span className="text-[#00ff66] select-none">
          <span className="text-[#00b4d8]">lgab</span>
          <span className="text-[#888]">@</span>
          <span className="text-[#9d4edd]">portfolio</span>
          <span className="text-[#888]">:~$</span>
        </span>
        <span className="text-[#e2e8f0]">{displayed}</span>
        <Cursor show={!done} />
      </div>
      {done && output && (
        <div className="mt-0.5 pl-0 text-[#94a3b8] animate-[fadeIn_0.3s_ease]">
          {output}
        </div>
      )}
    </div>
  )
}

// ─── System status bar ─────────────────────────────────────────────────────────
function StatusBar() {
  const [time, setTime] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  return (
    <div className="flex items-center justify-between px-4 py-1 bg-[#0d1117] border-b border-[#00ff6622] font-mono text-[11px] text-[#4a5568]">
      <div className="flex items-center gap-3">
        <span className="text-[#00ff66]">●</span>
        <span>bash v5.2.15</span>
        <span className="text-[#2d3748]">|</span>
        <span>x86_64-linux</span>
      </div>
      <div className="flex items-center gap-3">
        <Wifi className="size-3" />
        <Battery className="size-3" />
        <Clock className="size-3" />
        <span>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
    </div>
  )
}

// ─── Terminal window wrapper ───────────────────────────────────────────────────
function TerminalWindow({
  title,
  children,
  className = '',
}: {
  title: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={`rounded-xl overflow-hidden border border-[#00ff6622] bg-[#0a0e14]/90 backdrop-blur-xl shadow-[0_0_40px_rgba(0,255,102,0.06)] ${className}`}
      style={{ boxShadow: '0 0 0 1px rgba(0,255,102,0.08), 0 20px 60px rgba(0,0,0,0.6), 0 0 80px rgba(0,180,216,0.04)' }}
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-[#0d1117] border-b border-[#00ff6622]">
        <button className="size-3 rounded-full bg-[#ff5f56] hover:brightness-110 transition-all" />
        <button className="size-3 rounded-full bg-[#ffbd2e] hover:brightness-110 transition-all" />
        <button className="size-3 rounded-full bg-[#27c93f] hover:brightness-110 transition-all" />
        <span className="ml-3 font-mono text-xs text-[#4a5568] flex-1 text-center -ml-12">
          {title}
        </span>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  )
}

// ─── Nav command item ──────────────────────────────────────────────────────────
function NavCommand({ cmd, desc, href }: { cmd: string; desc: string; href: string }) {
  return (
    <Link
      to={href}
      className="group flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-[#00ff660a] border border-transparent hover:border-[#00ff6620] transition-all duration-200"
    >
      <span className="font-mono text-[#00ff66] text-sm select-none group-hover:text-[#00ffaa] transition-colors">$</span>
      <span className="font-mono text-sm">
        <span className="text-[#00b4d8] group-hover:text-[#48cae4] transition-colors">cd</span>
        <span className="text-[#e2e8f0] ml-2">{cmd}</span>
        <span className="text-[#4a5568] ml-3">#{desc}</span>
      </span>
      <ChevronRight className="size-3.5 text-[#2d3748] ml-auto group-hover:text-[#00ff66] group-hover:translate-x-1 transition-all" />
    </Link>
  )
}

// ─── Project card ──────────────────────────────────────────────────────────────
function ProjectCard({ project }: { project: Project }) {
  return (
    <a
      href={project.url?.split(',')[0]?.trim()}
      target="_blank"
      rel="noopener noreferrer"
      className="group block p-4 rounded-lg border border-[#00ff6614] bg-[#0d1117]/60 hover:border-[#00ff6640] hover:bg-[#0d1117]/90 transition-all duration-300 relative overflow-hidden"
      style={{ backdropFilter: 'blur(8px)' }}
    >
      {/* glow line top */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#00ff6640] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[#00ff66] text-xs select-none">▸</span>
          <h3 className="font-mono text-sm font-semibold text-[#e2e8f0] group-hover:text-[#00ff99] transition-colors">
            {project.name}
          </h3>
        </div>
        <ExternalLink className="size-3.5 text-[#2d3748] opacity-0 group-hover:opacity-100 group-hover:text-[#00b4d8] transition-all shrink-0 mt-0.5" />
      </div>
      <p className="mt-2 text-xs text-[#4a5568] line-clamp-2 font-mono leading-relaxed group-hover:text-[#64748b] transition-colors">
        {project.description}
      </p>
    </a>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────
function App() {
  const { data: skills } = trpc.skills.getSkills.useQuery()
  const { data: projects } = trpc.projects.getProjects.useQuery()
  const { data: quickLinks } = trpc.quickLinks.getQuickLinks.useQuery()
  const [bootDone, setBootDone] = useState(false)

  return (
    <div className="relative min-h-screen bg-[#060810] text-[#e2e8f0]" style={{ fontFamily: '"JetBrains Mono", "Fira Code", "Courier New", monospace' }}>
      {/* Matrix rain */}
      <MatrixRain />

      {/* Scanlines overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-[1]"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)',
        }}
      />

      {/* Radial glow */}
      <div
        className="fixed inset-0 pointer-events-none z-[1]"
        style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(0,180,216,0.04) 0%, transparent 70%)' }}
      />

      {/* Content */}
      <div className="relative z-10">
        <StatusBar />

        <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
          <div className="grid gap-6 lg:grid-cols-[1fr_300px] lg:gap-8">

            {/* ── Left column ───────────────────────────────────────────── */}
            <div className="space-y-6">

              {/* Boot terminal */}
              <div
                className="animate-[fadeInUp_0.6s_ease_both]"
                style={{ animationDelay: '0ms' }}
              >
                <TerminalWindow title="~/portfolio — zsh — 120×40">
                  <TerminalLine
                    cmd="whoami"
                    output={
                      <span className="text-[#00ff99]">
                        Luis Gabrielle Putan{' '}
                        <span className="text-[#4a5568]">—</span>{' '}
                        <span className="text-[#00b4d8]">Full Stack Developer</span>
                      </span>
                    }
                    delay={200}
                    speed={30}
                  />
                  <TerminalLine
                    cmd="cat /proc/version"
                    output={
                      <span>
                        Computer Science Student{' '}
                        <span className="text-[#9d4edd]">@</span>{' '}
                        <span className="text-[#00b4d8]">Mapua University</span>
                      </span>
                    }
                    delay={900}
                    speed={28}
                  />
                  <TerminalLine
                    cmd="ls ~/routes/"
                    output={
                      <span className="flex flex-wrap gap-x-4">
                        {['about/', 'blog/', 'projects/', 'skills/'].map((d) => (
                          <span key={d} className="text-[#00b4d8]">{d}</span>
                        ))}
                      </span>
                    }
                    delay={1700}
                    speed={25}
                    onDone={() => setBootDone(true)}
                  />
                  {bootDone && (
                    <div className="flex items-center gap-2 font-mono text-sm animate-[fadeIn_0.4s_ease]">
                      <span className="text-[#00b4d8]">lgab</span>
                      <span className="text-[#888]">@</span>
                      <span className="text-[#9d4edd]">portfolio</span>
                      <span className="text-[#888]">:~$</span>
                      <Cursor show />
                    </div>
                  )}
                </TerminalWindow>
              </div>

              {/* Navigation */}
              <div
                className="animate-[fadeInUp_0.6s_ease_both]"
                style={{ animationDelay: '300ms' }}
              >
                <TerminalWindow title="navigate — cd">
                  <div className="flex items-center gap-2 mb-3 pb-3 border-b border-[#00ff6610]">
                    <Terminal className="size-4 text-[#00ff66]" />
                    <span className="font-mono text-xs text-[#4a5568] uppercase tracking-widest">
                      available routes
                    </span>
                  </div>
                  <div className="space-y-1">
                    <NavCommand cmd="about" desc="Learn more about me" href="/about" />
                    <NavCommand cmd="projects" desc="View my work" href="/projects" />
                    <NavCommand cmd="skills" desc="Tech stack & expertise" href="/skills" />
                    <NavCommand cmd="blog" desc="Read my posts" href="/blog" />
                  </div>
                </TerminalWindow>
              </div>

              {/* Projects */}
              <div
                className="animate-[fadeInUp_0.6s_ease_both]"
                style={{ animationDelay: '500ms' }}
              >
                <TerminalWindow title="ls -la ~/projects">
                  <div className="flex items-center justify-between mb-3 pb-3 border-b border-[#00ff6610]">
                    <div className="flex items-center gap-2">
                      <Code2 className="size-4 text-[#00b4d8]" />
                      <span className="font-mono text-xs text-[#4a5568] uppercase tracking-widest">
                        featured projects
                      </span>
                    </div>
                    <span className="font-mono text-xs text-[#00ff6660]">
                      [{projects?.length || 0} total]
                    </span>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {projects?.slice(0, 4).map((project: Project) => (
                      <ProjectCard key={project.id} project={project} />
                    ))}
                    {(!projects || projects.length === 0) && (
                      <div className="col-span-2 py-6 text-center">
                        <span className="font-mono text-xs text-[#2d3748]">
                          bash: no projects found — add via admin panel
                        </span>
                      </div>
                    )}
                  </div>
                  {projects && projects.length > 4 && (
                    <Link
                      to="/projects"
                      className="mt-3 inline-flex items-center gap-2 font-mono text-xs text-[#00b4d8] hover:text-[#48cae4] transition-colors group"
                    >
                      <ChevronRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
                      cat projects --all ({projects.length} entries)
                    </Link>
                  )}
                </TerminalWindow>
              </div>
            </div>

            {/* ── Right sidebar ──────────────────────────────────────────── */}
            <aside className="space-y-5 lg:sticky lg:top-24 h-fit">

              {/* Profile */}
              <div
                className="animate-[fadeInUp_0.6s_ease_both]"
                style={{ animationDelay: '150ms' }}
              >
                <div
                  className="rounded-xl border border-[#00ff6622] bg-[#0a0e14]/90 overflow-hidden"
                  style={{ boxShadow: '0 0 0 1px rgba(0,255,102,0.06), 0 20px 40px rgba(0,0,0,0.5)' }}
                >
                  {/* Glowing avatar area */}
                  <div className="relative h-16 bg-gradient-to-br from-[#0d2818] via-[#071a2e] to-[#0d0d1a] flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 opacity-20" style={{
                      background: 'radial-gradient(circle at 50% 100%, #00ff66 0%, transparent 60%)'
                    }} />
                    <div className="font-mono text-[#00ff6640] text-xs tracking-widest uppercase select-none">
                      sys/user/profile
                    </div>
                  </div>
                  <div className="p-4">
                    <ProfileCard
                      name="Luis Gabrielle Putan"
                      role="Computer Science Student"
                      location="Philippines"
                    />
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div
                className="animate-[fadeInUp_0.6s_ease_both]"
                style={{ animationDelay: '350ms' }}
              >
                <TerminalWindow title="pkg list --installed">
                  <div className="flex items-center gap-2 mb-3">
                    <Layers className="size-3.5 text-[#9d4edd]" />
                    <span className="font-mono text-xs text-[#4a5568] uppercase tracking-widest">
                      tech stack
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {skills?.map((skill: Skill) => (
                      <SkillBadge key={skill.id} icon={Code2} label={skill.name} />
                    ))}
                    {(!skills || skills.length === 0) && (
                      <span className="font-mono text-xs text-[#2d3748]">
                        no packages installed
                      </span>
                    )}
                  </div>
                </TerminalWindow>
              </div>

              {/* Links */}
              <div
                className="animate-[fadeInUp_0.6s_ease_both]"
                style={{ animationDelay: '500ms' }}
              >
                <TerminalWindow title="cat ~/.config/links">
                  <div className="flex items-center gap-2 mb-3">
                    <FolderOpen className="size-3.5 text-[#00b4d8]" />
                    <span className="font-mono text-xs text-[#4a5568] uppercase tracking-widest">
                      external links
                    </span>
                  </div>
                  <QuickLinks
                    links={(quickLinks || [])
                      .filter((link) => link.url !== null)
                      .map((link) => ({
                        href: link.url!,
                        label: link.name,
                        icon: link.icon as 'github' | 'linkedin' | 'external',
                      }))}
                  />
                  {(!quickLinks || quickLinks.length === 0) && (
                    <p className="font-mono text-xs text-[#2d3748]">
                      no links configured
                    </p>
                  )}
                </TerminalWindow>
              </div>

              {/* Uptime widget */}
              <div
                className="animate-[fadeInUp_0.6s_ease_both] rounded-xl border border-[#00ff6614] bg-[#0a0e14]/80 p-4"
                style={{ animationDelay: '650ms' }}
              >
                <SystemStatus />
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* Global keyframe styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600&display=swap');

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 4px rgba(0,255,102,0.3); }
          50% { box-shadow: 0 0 12px rgba(0,255,102,0.7); }
        }
      `}</style>
    </div>
  )
}

// ─── System status mini widget ─────────────────────────────────────────────────
function SystemStatus() {
  const [uptime, setUptime] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setUptime((u) => u + 1), 1000)
    return () => clearInterval(t)
  }, [])
  const fmt = (s: number) => {
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`
  }
  const bars = (pct: number, n = 8) =>
    Array.from({ length: n }, (_, i) => (
      <span key={i} className={i < Math.round(pct * n / 100) ? 'text-[#00ff66]' : 'text-[#1a2332]'}>█</span>
    ))
  return (
    <div className="space-y-2 font-mono text-xs">
      <div className="text-[#4a5568] uppercase tracking-widest mb-2">sys/status</div>
      <div className="flex justify-between text-[#4a5568]">
        <span>uptime</span>
        <span className="text-[#00ff99]">{fmt(uptime)}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-[#4a5568]">cpu</span>
        <span className="flex gap-px">{bars(23)}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-[#4a5568]">mem</span>
        <span className="flex gap-px">{bars(61)}</span>
      </div>
      <div className="flex justify-between text-[#4a5568]">
        <span>status</span>
        <span className="text-[#00ff66] flex items-center gap-1.5">
          <span className="inline-block size-1.5 rounded-full bg-[#00ff66] animate-pulse" />
          online
        </span>
      </div>
    </div>
  )
}
