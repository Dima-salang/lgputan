import { Link } from '@tanstack/react-router'
import { Github, Globe, Linkedin, Mail } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { pages, site } from '#/content/site'
import { trpc } from '#/integrations/trpc/react'
import { LocalTime } from './site/LocalTime'

const socialIcons: Record<string, LucideIcon> = {
  github: Github,
  linkedin: Linkedin,
  mail: Mail,
  email: Mail,
  globe: Globe,
}

export default function Footer() {
  const year = new Date().getFullYear()
  const { data: quickLinks } = trpc.quickLinks.getQuickLinks.useQuery()

  const links =
    quickLinks && quickLinks.length > 0
      ? quickLinks.filter(
          (link) =>
            Boolean(link.url) &&
            !link.url?.toLowerCase().startsWith('mailto:') &&
            link.name.toLowerCase() !== 'email',
        )
      : [
          {
            id: -1,
            name: 'GitHub',
            url: site.github,
            icon: 'github',
          },
        ]

  return (
    <footer className="mt-24 border-t border-border">
      <div className="page-shell py-14">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="font-mono text-sm text-foreground">
              {site.wordmark}
              <span className="text-acid">.</span>
            </p>
            <p className="mt-5 font-display text-4xl leading-[1.05] sm:text-5xl">
              Small tools,
              <br />
              <span className="italic text-muted-foreground">
                carefully made.
              </span>
            </p>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {site.shortRole}, based in {site.location}.
            </p>
          </div>

          <div className="md:col-span-2">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              Pages
            </h2>
            <ul className="mt-4 space-y-2.5">
              {pages.map((page) => (
                <li key={page.to}>
                  <Link
                    to={page.to}
                    className="text-sm text-foreground/80 transition-colors hover:text-acid"
                  >
                    {page.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              Find me
            </h2>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="inline-flex items-center gap-1.5 text-sm text-foreground/80 transition-colors hover:text-acid"
                >
                  <Mail className="size-3.5" aria-hidden="true" />
                  Email
                </a>
              </li>
              {links.map((link) => {
                const Icon =
                  socialIcons[(link.icon ?? 'globe').toLowerCase()] ?? Globe
                return (
                  <li key={link.id}>
                    <a
                      href={link.url ?? '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-foreground/80 transition-colors hover:text-acid"
                    >
                      <Icon className="size-3.5" aria-hidden="true" />
                      {link.name}
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>

          <div className="md:col-span-3">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              Local time
            </h2>
            <p className="mt-4 font-mono text-sm text-foreground">
              <LocalTime />
              <span className="ml-2 text-muted-foreground">
                {site.location}
              </span>
            </p>
            <p className="mt-2 font-mono text-[11px] text-muted-foreground">
              {site.availability}
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.name}
          </p>
          <div className="flex items-center gap-5">
            <span>Designed and built by Luis</span>
            <Link to="/admin" className="transition-colors hover:text-acid">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
