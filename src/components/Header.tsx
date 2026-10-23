import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Menu, Search, X } from 'lucide-react'
import { pages, site } from '#/data/site'
import type { PalettePost, PaletteProject } from '#/lib/search'
import ThemeToggle from './ThemeToggle'
import { CommandPalette } from './CommandPalette'

function openPalette() {
  window.dispatchEvent(new Event('open-command-palette'))
}

function normalizePath(pathname: string) {
  if (pathname === '/') return '/'
  return pathname.replace(/\/+$/, '')
}

function isCurrentPath(pathname: string, target: string) {
  const current = normalizePath(pathname)

  if (target === '/blog') {
    return current === '/blog' || current.startsWith('/blog/')
  }

  return current === target
}

export default function Header({
  pathname,
  posts,
  projects,
}: {
  pathname: string
  posts: PalettePost[]
  projects: PaletteProject[]
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        return
      }

      if (event.key !== 'Tab') return

      const focusable = menuRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )
      if (!focusable || focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [menuOpen])

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="page-shell flex h-14 items-center gap-8">
          <a
            href="/"
            className="inline-flex shrink-0 items-baseline text-[13px] tracking-tight transition-opacity hover:opacity-65"
            aria-label={`${site.wordmark} — home`}
          >
            {site.wordmark}
            <span className="text-muted-foreground" aria-hidden="true">
              .
            </span>
          </a>

          <nav
            className="hidden items-center gap-6 md:flex"
            aria-label="Main navigation"
          >
            {pages.map((page) => {
              const active = isCurrentPath(pathname, page.to)
              return (
                <a
                  key={page.to}
                  href={page.to}
                  className={active ? 'nav-link is-active' : 'nav-link'}
                  aria-current={active ? 'page' : undefined}
                >
                  {page.label}
                </a>
              )
            })}
          </nav>

          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={openPalette}
              className="hidden items-center gap-2 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
              aria-label="Open search menu"
            >
              <Search className="size-3.5" aria-hidden="true" />
              <span>Search</span>
              <kbd className="kbd ml-1">⌘K</kbd>
            </button>

            <button
              type="button"
              onClick={openPalette}
              className="grid size-8 place-items-center text-muted-foreground transition-colors hover:text-foreground sm:hidden"
              aria-label="Open search menu"
            >
              <Search className="size-4" aria-hidden="true" />
            </button>

            <ThemeToggle />

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="grid size-8 place-items-center text-muted-foreground transition-colors hover:text-foreground md:hidden"
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              <Menu className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {menuOpen ? (
        <div
          id="mobile-menu"
          ref={menuRef}
          className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-background md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          <div className="page-shell flex h-14 shrink-0 items-center justify-between border-b border-border">
            <span className="text-[13px]">
              {site.wordmark}
              <span className="text-muted-foreground">.</span>
            </span>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              autoFocus
              className="grid size-8 place-items-center text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Close menu"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>

          <nav
            className="page-shell flex-1 py-6"
            aria-label="Mobile navigation"
          >
            {pages.map((page) => {
              const active = isCurrentPath(pathname, page.to)
              return (
                <a
                  key={page.to}
                  href={page.to}
                  onClick={() => setMenuOpen(false)}
                  className="group flex items-baseline justify-between gap-4 border-b border-border py-5"
                  aria-current={active ? 'page' : undefined}
                >
                  <span
                    className={`text-2xl leading-none transition-colors group-hover:text-foreground ${
                      active ? 'text-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    {page.label}
                  </span>
                  {active ? (
                    <span className="text-xs text-muted-foreground">Here</span>
                  ) : (
                    <ArrowUpRight
                      className="size-4 text-muted-foreground/60 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
                      aria-hidden="true"
                    />
                  )}
                </a>
              )
            })}
          </nav>

          <div className="page-shell shrink-0 space-y-3 border-t border-border py-6">
            <a href={`mailto:${site.email}`} className="link-underline text-xs">
              {site.email}
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </a>
            <a
              href={site.github}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline text-xs"
            >
              GitHub / {site.githubHandle}
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </a>
            <div className="flex items-center justify-between pt-4">
              <span className="label">Theme</span>
              <ThemeToggle />
            </div>
          </div>
        </div>
      ) : null}

      <CommandPalette posts={posts} projects={projects} />
    </>
  )
}
