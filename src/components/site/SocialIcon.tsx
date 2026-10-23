import { GithubIcon, Globe, LinkedinIcon, Mail } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const icons: Record<string, LucideIcon> = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  mail: Mail,
  email: Mail,
  globe: Globe,
}

export function SocialIcon({
  icon,
  className,
}: {
  icon: string
  className?: string
}) {
  const Icon = icons[icon.toLowerCase().trim()] ?? Globe
  return <Icon className={className} aria-hidden="true" />
}
