import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
  CornerDownLeft,
  FileText,
  FolderOpen,
  Github,
  Layers,
  Mail,
  Search,
  User,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { pages, site } from '#/content/site'

type PageTo = (typeof pages)[number]['to']

type Action = {
  id: string
  label: string
  description: string
  icon: LucideIcon
  to?: PageTo
  href?: string
}

const pageIcons: Record<string, LucideIcon> = {
  '/projects': FolderOpen,
  '/skills': Layers,
  '/blog': FileText,
  '/about': User,
}

const actions: Action[] = [
  ...pages.map((page) => ({
    id: page.to,
    label: page.label,
    description: page.description,
    icon: pageIcons[page.to] ?? FolderOpen,
    to: page.to,
  })),
  {
    id: 'github',
    label: 'GitHub',
    description: `Projects and code on ${site.githubHandle}`,
    icon: Github,
    href: site.github,
  },
  {
    id: 'email',
    label: 'Email',
    description: site.email,
    icon: Mail,
    href: `mailto:${site.email}`,
  },
]

export function CommandPalette() {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)

  const filtered = useMemo(() => {
    const value = query.trim().toLowerCase()
    if (!value) return actions
    return actions.filter(
      (action) =>
        action.label.toLowerCase().includes(value) ||
        action.description.toLowerCase().includes(value),
    )
  }, [query])

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
    setActive(0)
  }, [query])

  useEffect(() => {
    const option = document.getElementById(`palette-option-${active}`)
    option?.scrollIntoView({ block: 'nearest' })
  }, [active])

  function run(action: Action) {
    close()

    if (action.to) {
      navigate({ to: action.to })
      return
    }

    if (!action.href) return

    if (action.href.startsWith('mailto:')) {
      window.location.href = action.href
    } else {
      window.open(action.href, '_blank', 'noopener,noreferrer')
    }
  }

  function onInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
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
      const action = filtered[active]
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
          <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={onInputKeyDown}
            placeholder="Search pages, GitHub, email…"
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
                    isActive ? 'bg-secondary text-foreground' : 'text-muted-foreground'
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
