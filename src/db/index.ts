import { drizzle } from 'drizzle-orm/libsql'

import { skill } from '../models/skill'
import { profile } from '../models/profile'
import { quick_links } from '../models/quick_link'
import { posts } from '../models/post'
import { projects } from '../models/project'

export async function getDb() {
    try {
        const db = drizzle(process.env.DATABASE_URL!, { schema: { skill, profile, posts, quick_links, projects } })
        return db
    } catch (error) {
        throw error
    }
}