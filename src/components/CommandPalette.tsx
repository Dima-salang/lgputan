import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  CornerDownLeft,
  FileText,
  FolderOpen,
  GithubIcon,
  Layers,
  Mail,
  Search,
  User,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { pages, site } from '#/data/site'
import type { PalettePost, PaletteProject } from '#/lib/search'

type Action = {
  id: string
  label: string
  description: string
  icon: LucideIcon
  href: string
}

const pageIcons: Record<string, LucideIcon> = {
  '/projects': FolderOpen,
  '/skills': Layers,
  '/blog': FileText,
  '/about': User,
}

export function CommandPalette({
  posts,
  projects,
}: {
  posts: PalettePost[]
  projects: PaletteProject[]
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)

  const actions = useMemo<Action[]>(
    () => [
      ...pages.map((page) => ({
        id: page.to,
        label: page.label,
        description: page.description,
        icon: pageIcons[page.to] ?? FolderOpen,
        href: page.to,
      })),
      ...posts.map((post) => ({
        id: `post-${post.slug}`,
        label: post.title,
        description: `Writing · ${post.description}`,
        icon: FileText,
        href: `/blog/${post.slug}`,
      })),
      ...projects.map((project) => ({
        id: `project-${project.name}`,
        label: project.name,
        description: `Work · ${project.description}`,
        icon: FolderOpen,
        href: project.href ?? '/projects',
      })),
      {
        id: 'github',
        label: 'GitHub',
        description: `Projects and code on ${site.githubHandle}`,
        icon: GithubIcon,
        href: site.github,
      },
      {
        id: 'email',
        label: 'Email',
        description: site.email,
        icon: Mail,
        href: `mailto:${site.email}`,
      },
    ],
    [posts, projects],
  )

  const filtered = useMemo(() => {
    const value = query.trim().toLowerCase()
    if (!value) return actions
    return actions.filter(
      (action) =>
        action.label.toLowerCase().includes(value) ||
        action.description.toLowerCase().includes(value),
    )
  }, [actions, query])

  const open = useCallback(() => {
    if (dialogRef.current?.open) return
    setQuery('')
    setActive(0)
    dialogRef.current?.showModal()
    window.requestAnimationFrame(() => inputRef.current?.focus())
  }, [])

  const close = useCallback(() => {
    dialogRef.current?.close()
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        if (dialogRef.current?.open) close()
        else open()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('open-command-palette', open)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('open-command-palette', open)
    }
  }, [open, close])

  useEffect(() => {
    const option = document.getElementById(`palette-option-${active}`)
    option?.scrollIntoView({ block: 'nearest' })
  }, [active])

  function run(action: Action) {
    close()

    if (action.href.startsWith('mailto:') || action.href.startsWith('/')) {
      window.location.assign(action.href)
      return
    }

    window.open(action.href, '_blank', 'noopener,noreferrer')
  }

  function onInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (filtered.length === 0) return

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActive((current) => Math.min(current + 1, filtered.length - 1))
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActive((current) => Math.max(current - 1, 0))
    }

    if (event.key === 'Enter') {
      event.preventDefault()
      const action = filtered.at(active)
      if (action) run(action)
    }
  }

  return (
    <dialog
      ref={dialogRef}
      aria-label="Search the site"
      className="fixed inset-0 m-auto h-fit"
      onClose={() => setQuery('')}
      onClick={(event) => {
        if (event.target === dialogRef.current) close()
      }}
    >
      <div className="panel w-[min(92vw,38rem)] overflow-hidden">
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <Search
            className="size-4 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setActive(0)
            }}
            onKeyDown={onInputKeyDown}
            placeholder="Search pages, writing, work…"
            aria-label="Search"
            aria-controls="palette-results"
            aria-activedescendant={
              filtered.length > 0 ? `palette-option-${active}` : undefined
            }
            className="w-full bg-transparent font-mono text-sm text-foreground outline-none placeholder:text-muted-foreground/70"
          />
          <kbd className="kbd">Esc</kbd>
        </div>

        <div
          id="palette-results"
          role="listbox"
          aria-label="Results"
          className="max-h-[min(60vh,22rem)] overflow-y-auto p-2"
        >
          {filtered.length === 0 ? (
            <p className="px-3 py-8 text-center font-mono text-xs text-muted-foreground">
              No matches for “{query}”
            </p>
          ) : (
            filtered.map((action, index) => {
              const Icon = action.icon
              const isActive = index === active

              return (
                <button
                  key={action.id}
                  id={`palette-option-${index}`}
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  onMouseEnter={() => setActive(index)}
                  onClick={() => run(action)}
                  className={`flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors ${
                    isActive
                      ? 'bg-secondary text-foreground'
                      : 'text-muted-foreground'
                  }`}
                >
                  <Icon
                    className={`size-4 shrink-0 ${isActive ? 'text-acid' : ''}`}
                    aria-hidden="true"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block font-mono text-[13px] text-foreground">
                      {action.label}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {action.description}
                    </span>
                  </span>
                  {isActive ? (
                    <CornerDownLeft
                      className="size-3.5 shrink-0 text-muted-foreground"
                      aria-hidden="true"
                    />
                  ) : null}
                </button>
              )
            })
          )}
        </div>

        <div className="flex items-center gap-4 border-t border-border px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          <span>↑↓ to move</span>
          <span>↵ to open</span>
          <span className="ml-auto">Esc to close</span>
        </div>
      </div>
    </dialog>
  )
}
