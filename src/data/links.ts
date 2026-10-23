import { site } from './site'

export type SocialLink = {
  name: string
  url: string
  icon: 'github' | 'linkedin' | 'globe'
}

export const links: SocialLink[] = [
  {
    name: 'GitHub',
    url: site.github,
    icon: 'github',
  },
]
