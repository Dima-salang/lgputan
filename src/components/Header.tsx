import { Link } from '@tanstack/react-router'
import ThemeToggle from './ThemeToggle'
import { Terminal, Folder, FileText, Code2, Settings } from 'lucide-react'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--header-bg)] px-4 backdrop-blur-lg">
      <nav className="page-wrap flex flex-wrap items-center gap-x-3 gap-y-2 py-3 sm:py-4">
        <h2 className="m-0 flex-shrink-0 text-base font-semibold tracking-tight">
          <Link to="/" className="nav-logo">
            <Terminal className="size-4 text-[var(--lagoon)]" />
            <span className="font-mono text-sm">~/portfolio</span>
            <span className="animate-pulse text-[var(--lagoon)]">_</span>
          </Link>
        </h2>

        <div className="ml-auto flex items-center gap-1.5 sm:ml-0 sm:gap-2">
          <ThemeToggle />
        </div>

        <div className="order-3 flex w-full flex-wrap items-center gap-x-1 gap-y-1 pb-1 text-sm font-mono sm:order-2 sm:w-auto sm:flex-nowrap sm:pb-0">
          <Link
            to="/"
            className="nav-link"
            activeProps={{ className: 'nav-link is-active' }}
          >
            <Folder className="size-3.5" />
            <span>home</span>
          </Link>
          <Link
            to="/projects"
            className="nav-link"
            activeProps={{ className: 'nav-link is-active' }}
          >
            <Code2 className="size-3.5" />
            <span>projects</span>
          </Link>
          <Link
            to="/skills"
            className="nav-link"
            activeProps={{ className: 'nav-link is-active' }}
          >
            <FileText className="size-3.5" />
            <span>skills</span>
          </Link>
          <Link
            to="/blog"
            className="nav-link"
            activeProps={{ className: 'nav-link is-active' }}
          >
            <FileText className="size-3.5" />
            <span>blog</span>
          </Link>
          <Link
            to="/about"
            className="nav-link"
            activeProps={{ className: 'nav-link is-active' }}
          >
            <FileText className="size-3.5" />
            <span>about</span>
          </Link>
          <Link
            to="/admin"
            className="nav-link text-[var(--muted-foreground)] hover:text-[var(--destructive)]"
            activeProps={{ className: 'nav-link is-active' }}
          >
            <Settings className="size-3.5" />
            <span>admin</span>
          </Link>
        </div>
      </nav>
    </header>
  )
}
