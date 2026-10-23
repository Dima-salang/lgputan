import { describe, expect, it } from 'vitest'
import {
  excerpt,
  formatDate,
  formatYear,
  groupByYear,
  isPublished,
  readingTime,
  sortByDateDesc,
  stripMarkdown,
} from '#/lib/data'

describe('date helpers', () => {
  it('formats dates in UTC', () => {
    expect(formatDate(new Date('2024-01-02T00:00:00Z'))).toBe('Jan 2, 2024')
    expect(formatDate('2024-01-02')).toBe('Jan 2, 2024')
  })

  it('handles missing dates', () => {
    expect(formatDate(null)).toBe('—')
    expect(formatYear(null)).toBe('Undated')
  })

  it('sorts newest first without mutating the input', () => {
    const items = [
      { title: 'Older', date: new Date('2023-01-01T00:00:00Z') },
      { title: 'Newer', date: new Date('2024-01-01T00:00:00Z') },
    ]

    expect(sortByDateDesc(items).map((item) => item.title)).toEqual([
      'Newer',
      'Older',
    ])
    expect(items[0].title).toBe('Older')
  })

  it('groups posts by year', () => {
    const items = [
      { title: 'A', date: new Date('2024-03-01T00:00:00Z') },
      { title: 'B', date: new Date('2024-01-01T00:00:00Z') },
      { title: 'C', date: new Date('2023-01-01T00:00:00Z') },
    ]

    expect(groupByYear(items)).toEqual([
      { year: '2024', items: [items[0], items[1]] },
      { year: '2023', items: [items[2]] },
    ])
  })
})

describe('markdown helpers', () => {
  it('strips common markdown syntax', () => {
    expect(stripMarkdown('# Title\n\nA [link](https://example.com).')).toBe(
      'Title A link.',
    )
  })

  it('truncates long excerpts', () => {
    expect(excerpt('one two three four', 7)).toBe('one two…')
  })

  it('calculates reading time with a one-minute minimum', () => {
    expect(readingTime('')).toBe('1 min read')
    expect(
      readingTime(Array.from({ length: 401 }, () => 'word').join(' ')),
    ).toBe('3 min read')
  })
})

describe('draft filtering', () => {
  it('keeps published posts and drops drafts', () => {
    expect(isPublished({ draft: false })).toBe(true)
    expect(isPublished({ draft: true })).toBe(false)
  })
})
