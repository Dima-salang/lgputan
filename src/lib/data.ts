export type ProjectLink = {
  href: string
  label: string
  kind: 'code' | 'live'
  host: string
}

/**
 * Project URLs are stored as a comma-separated string.
 * This turns them into labelled links without inventing any data.
 */
export function splitLinks(url?: string | null): ProjectLink[] {
  return (url ?? '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)
    .map((href) => {
      let host = ''
      try {
        host = new URL(href).hostname.replace(/^www\./, '')
      } catch {
        host = ''
      }

      const isCode =
        /github\.com|gitlab\.com|codeberg\.org|bitbucket\.org/i.test(href)

      return {
        href,
        label: isCode ? 'Source code' : 'Live site',
        kind: isCode ? 'code' : 'live',
        host,
      }
    })
}

function parseDate(value: string): Date | null {
  const normalized = value.includes('T') ? value : `${value.replace(' ', 'T')}Z`
  const date = new Date(normalized)
  return Number.isNaN(date.getTime()) ? null : date
}

export function formatDate(value?: string | null): string {
  if (!value) return '—'
  const date = parseDate(value)
  if (!date) return '—'
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date)
}

export function formatYear(value?: string | null): string {
  if (!value) return 'Undated'
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

export function isDraft(content?: string | null): boolean {
  return !content || content.trim().length === 0
}

export function readingTime(content?: string | null): string {
  if (isDraft(content)) return 'Draft'
  const words = stripMarkdown(content ?? '')
    .split(/\s+/)
    .filter(Boolean).length
  const minutes = Math.max(1, Math.ceil(words / 200))
  return `${minutes} min read`
}
