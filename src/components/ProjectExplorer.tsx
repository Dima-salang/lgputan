import { useMemo, useState } from 'react'
import { Search, X } from 'lucide-react'
import type { Project } from '#/data/projects'
import { ProjectRow } from './site/ProjectRow'

type Filter = 'all' | 'live' | 'code'

const FILTERS: Array<{ value: Filter; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'live', label: 'Live' },
  { value: 'code', label: 'Source only' },
]

export function ProjectExplorer({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<Filter>('all')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase()

    return projects.filter((project) => {
      const hasLive = project.links.some((link) => link.kind === 'live')
      const hasCode = project.links.some((link) => link.kind === 'code')

      const matchesFilter =
        filter === 'all' ||
        (filter === 'live' && hasLive) ||
        (filter === 'code' && hasCode)

      const matchesSearch =
        search.length === 0 ||
        project.name.toLowerCase().includes(search) ||
        project.description.toLowerCase().includes(search) ||
        project.links.some((link) => link.label.toLowerCase().includes(search))

      return matchesFilter && matchesSearch
    })
  }, [projects, filter, query])

  return (
    <>
      <div className="mt-8 flex flex-col gap-4 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div
          className="flex flex-wrap items-center gap-5"
          role="group"
          aria-label="Filter projects"
        >
          {FILTERS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setFilter(option.value)}
              aria-pressed={filter === option.value}
              className={`text-xs transition-colors ${
                filter === option.value
                  ? 'text-foreground underline underline-offset-4'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <label className="flex w-full items-center gap-2 border-b border-border py-1 transition-colors focus-within:border-foreground sm:w-64">
          <Search
            className="size-3.5 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
          <span className="sr-only">Search projects</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search projects"
            className="w-full bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground/70"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="size-3.5" aria-hidden="true" />
            </button>
          ) : null}
        </label>
      </div>

      <div>
        {filtered.length > 0 ? (
          filtered.map((project) => (
            <ProjectRow key={project.name} project={project} />
          ))
        ) : (
          <div className="border-t border-border py-16 text-center">
            <p className="text-sm text-foreground">Nothing matches.</p>
            <p className="mt-2 text-xs text-muted-foreground">
              Try a different search or filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setFilter('all')
                setQuery('')
              }}
              className="link-underline mt-6 text-xs"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>
    </>
  )
}
