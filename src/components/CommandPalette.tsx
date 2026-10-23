import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CornerDownLeft, Search } from 'lucide-react'
import { pages, site } from '#/data/site'
import type { PalettePost, PaletteProject } from '#/lib/search'

type Action = {
  id: string
  label: string
  description: string
  href: string
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
        href: page.to,
      })),
      ...posts.map((post) => ({
        id: `post-${post.slug}`,
        label: post.title,
        description: `Writing · ${post.description}`,
        href: `/blog/${post.slug}`,
      })),
      ...projects.map((project) => ({
        id: `project-${project.name}`,
        label: project.name,
        description: `Work · ${project.description}`,
        href: project.href ?? '/projects',
      })),
      {
        id: 'github',
        label: 'GitHub',
        description: `Projects and code on ${site.githubHandle}`,
        href: site.github,
      },
      {
        id: 'email',
        label: 'Email',
        description: site.email,
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
      <div className="w-[min(92vw,36rem)] border border-border bg-background shadow-2xl">
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
            placeholder="Search pages, writing, work"
            aria-label="Search"
            aria-controls="palette-results"
            aria-activedescendant={
              filtered.length > 0 ? `palette-option-${active}` : undefined
            }
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/70"
          />
          <kbd className="kbd">Esc</kbd>
        </div>

        <div
          id="palette-results"
          role="listbox"
          aria-label="Results"
          className="max-h-[min(60vh,22rem)] overflow-y-auto"
        >
          {filtered.length === 0 ? (
            <p className="px-4 py-10 text-center text-xs text-muted-foreground">
              No matches for “{query}”
            </p>
          ) : (
            filtered.map((action, index) => {
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
                  className={`flex w-full items-baseline justify-between gap-6 border-b border-border/60 px-4 py-3 text-left transition-colors last:border-0 ${
                    isActive ? 'bg-secondary/60' : ''
                  }`}
                >
                  <span className="min-w-0">
                    <span
                      className={`block text-sm ${
                        isActive
                          ? 'text-foreground underline underline-offset-4'
                          : 'text-foreground/80'
                      }`}
                    >
                      {action.label}
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-muted-foreground">
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

        <div className="flex items-center gap-4 border-t border-border px-4 py-2.5 text-[11px] text-muted-foreground">
          <span>↑↓ move</span>
          <span>↵ open</span>
          <span className="ml-auto">esc close</span>
        </div>
      </div>
    </dialog>
  )
}
