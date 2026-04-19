import { Button } from '#/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Github, Linkedin, Mail } from 'lucide-react'

interface ProfileCardProps {
  name: string
  role: string
  location: string
  github?: string
  linkedin?: string
  email?: string
}

export function ProfileCard({
  name,
  role,
  location,
  github = 'https://github.com',
  linkedin = 'https://linkedin.com',
  email = 'mailto:hello@example.com',
}: ProfileCardProps) {
  return (
    <Card className="border-[var(--chip-line)] bg-[var(--surface)]/60">
      <CardHeader className="pb-3">
        <CardTitle className="font-mono text-base flex items-center gap-2">
          <span className="text-[var(--lagoon-deep)]">{'>'}</span> Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <span className="font-mono text-xs text-[var(--muted-foreground)] uppercase tracking-wider">
            Name
          </span>
          <p className="text-sm font-medium">{name}</p>
        </div>
        <div className="space-y-2">
          <span className="font-mono text-xs text-[var(--muted-foreground)] uppercase tracking-wider">
            Role
          </span>
          <p className="text-sm">{role}</p>
        </div>
        <div className="space-y-2">
          <span className="font-mono text-xs text-[var(--muted-foreground)] uppercase tracking-wider">
            Location
          </span>
          <p className="text-sm">{location}</p>
        </div>
        <div className="flex gap-2 pt-2">
          <Button size="icon" variant="ghost" asChild>
            <a href={github} target="_blank" rel="noreferrer">
              <Github className="size-4" />
            </a>
          </Button>
          <Button size="icon" variant="ghost" asChild>
            <a href={linkedin} target="_blank" rel="noreferrer">
              <Linkedin className="size-4" />
            </a>
          </Button>
          <Button size="icon" variant="ghost" asChild>
            <a href={email}>
              <Mail className="size-4" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
