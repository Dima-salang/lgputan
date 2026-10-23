export type DateValue = Date | string

function parseDate(value?: DateValue | null): Date | null {
  if (!value) return null

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value
  }

  const normalized = value.includes('T') ? value : `${value.replace(' ', 'T')}Z`
  const date = new Date(normalized)
  return Number.isNaN(date.getTime()) ? null : date
}

export function formatDate(value?: DateValue | null): string {
  const date = parseDate(value)
  if (!date) return '—'

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date)
}

export function formatYear(value?: DateValue | null): string {
  const date = parseDate(value)
  if (!date) return 'Undated'

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date)
}

export function stripMarkdown(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[*_>~#|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function excerpt(markdown: string, maxLength = 160): string {
  const text = stripMarkdown(markdown)
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength).trimEnd()}…`
}

export function readingTime(content?: string | null): string {
  const words = stripMarkdown(content ?? '')
    .split(/\s+/)
    .filter(Boolean).length
  const minutes = Math.max(1, Math.ceil(words / 200))
  return `${minutes} min read`
}

export function isPublished(post: { draft: boolean }): boolean {
  return !post.draft
}

export function sortByDateDesc<T extends { date: Date }>(items: T[]): T[] {
  return [...items].sort((a, b) => b.date.getTime() - a.date.getTime())
}

export function groupByYear<T extends { date: Date }>(
  items: T[],
): Array<{ year: string; items: T[] }> {
  const groups = new Map<string, T[]>()

  for (const item of items) {
    const year = formatYear(item.date)
    const group = groups.get(year)
    if (group) group.push(item)
    else groups.set(year, [item])
  }

  return Array.from(groups, ([year, groupItems]) => ({
    year,
    items: groupItems,
  }))
}
