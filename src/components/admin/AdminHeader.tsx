import { Link } from '@tanstack/react-router'
import { ArrowUpRight, Menu, User } from 'lucide-react'

export function Header({ onMenu }: { onMenu: () => void }) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background px-4 sm:px-6">
      <button
        type="button"
        onClick={onMenu}
        className="grid size-8 place-items-center border border-border text-muted-foreground transition-colors hover:border-acid/40 hover:text-foreground md:hidden"
        aria-label="Open menu"
      >
        <Menu className="size-4" aria-hidden="true" />
      </button>

      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
        Admin panel
      </span>

      <div className="ml-auto flex items-center gap-2">
        <Link
          to="/"
          className="hidden items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-acid sm:inline-flex"
        >
          View site
          <ArrowUpRight className="size-3" aria-hidden="true" />
        </Link>

        <div className="flex items-center gap-2 border border-border px-2.5 py-1">
          <User className="size-3.5 text-muted-foreground" aria-hidden="true" />
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            Admin
          </span>
        </div>
      </div>
    </header>
  )
}
