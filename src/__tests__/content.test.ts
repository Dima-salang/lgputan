import { describe, expect, it } from 'vitest'
import { links } from '#/data/links'
import { projects } from '#/data/projects'
import { pages, site } from '#/data/site'
import { skillGroups, skills } from '#/data/skills'

describe('content data', () => {
  it('keeps project names unique', () => {
    const names = projects.map((project) => project.name)
    expect(new Set(names).size).toBe(names.length)
  })

  it('uses valid project links', () => {
    for (const project of projects) {
      for (const link of project.links) {
        expect(link.href).toMatch(/^https?:\/\//)
        expect(link.label.length).toBeGreaterThan(0)
      }
    }
  })

  it('keeps skills unique across groups', () => {
    const names = skills.map((skill) => skill.name.toLowerCase())
    expect(new Set(names).size).toBe(names.length)
    expect(skillGroups.every((group) => group.items.length > 0)).toBe(true)
  })

  it('keeps navigation targets unique', () => {
    const targets = pages.map((page) => page.to)
    expect(new Set(targets).size).toBe(targets.length)
  })

  it('exposes a GitHub link', () => {
    expect(links.some((link) => link.icon === 'github')).toBe(true)
    expect(site.github).toContain('github.com')
  })
})
