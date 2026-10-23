import { getCollection } from 'astro:content'
import { readingTime, sortByDateDesc } from './data'

export type PostSummary = {
  slug: string
  title: string
  description: string
  date: Date
  readingTime: string
}

export async function getPublishedPosts(): Promise<PostSummary[]> {
  const entries = await getCollection('writing', ({ data }) => !data.draft)

  return sortByDateDesc(
    entries.map((entry) => ({
      slug: entry.id,
      title: entry.data.title,
      description: entry.data.description,
      date: entry.data.date,
      readingTime: readingTime(entry.body),
    })),
  )
}
