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
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-xl">
        <div className="page-shell flex h-16 items-center gap-8">
          <a
            href="/"
            className="group inline-flex shrink-0 items-baseline gap-0.5 font-mono text-sm tracking-tight"
            aria-label={`${site.wordmark} — home`}
          >
            <span className="text-foreground transition-colors group-hover:text-acid">
              {site.wordmark}
            </span>
            <span className="text-acid" aria-hidden="true">
              .
            </span>
          </a>

          <nav
            className="hidden items-center gap-7 md:flex"
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

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={openPalette}
              className="hidden items-center gap-2 border border-border bg-card/60 px-2.5 py-1.5 text-muted-foreground transition-colors hover:border-acid/40 hover:text-foreground sm:flex"
              aria-label="Open search menu"
            >
              <Search className="size-3.5" aria-hidden="true" />
              <span className="font-mono text-[10px] uppercase tracking-[0.12em]">
                Search
              </span>
              <kbd className="kbd ml-1">⌘K</kbd>
            </button>

            <button
              type="button"
              onClick={openPalette}
              className="grid size-9 place-items-center border border-border text-muted-foreground transition-colors hover:border-acid/40 hover:text-foreground sm:hidden"
              aria-label="Open search menu"
            >
              <Search className="size-4" aria-hidden="true" />
            </button>

            <ThemeToggle />

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="grid size-9 place-items-center border border-border text-muted-foreground transition-colors hover:border-acid/40 hover:text-foreground md:hidden"
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
          <div className="page-shell flex h-16 shrink-0 items-center justify-between border-b border-border">
            <span className="font-mono text-sm">
              {site.wordmark}
              <span className="text-acid">.</span>
            </span>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              autoFocus
              className="grid size-9 place-items-center border border-border text-muted-foreground transition-colors hover:border-acid/40 hover:text-foreground"
              aria-label="Close menu"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>

          <nav
            className="page-shell flex-1 py-4"
            aria-label="Mobile navigation"
          >
            {pages.map((page, index) => {
              const active = isCurrentPath(pathname, page.to)
              return (
                <a
                  key={page.to}
                  href={page.to}
                  onClick={() => setMenuOpen(false)}
                  className="group flex items-baseline justify-between gap-4 border-b border-border py-5"
                  aria-current={active ? 'page' : undefined}
                >
                  <span className="font-display text-4xl leading-none transition-colors group-hover:text-acid">
                    {page.label}
                  </span>
                  <span className="font-mono text-[11px] text-muted-foreground">
                    0{index + 1}
                  </span>
                </a>
              )
            })}
          </nav>

          <div className="page-shell shrink-0 space-y-3 border-t border-border py-6">
            <a
              href={`mailto:${site.email}`}
              className="flex items-center justify-between font-mono text-xs text-muted-foreground transition-colors hover:text-acid"
            >
              {site.email}
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </a>
            <a
              href={site.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between font-mono text-xs text-muted-foreground transition-colors hover:text-acid"
            >
              GitHub / {site.githubHandle}
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </a>
            <div className="flex items-center justify-between pt-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                Theme
              </span>
              <ThemeToggle />
            </div>
          </div>
        </div>
      ) : null}

      <CommandPalette posts={posts} projects={projects} />
    </>
  )
}
