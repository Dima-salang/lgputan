import { Link, useLocation } from '@tanstack/react-router'
import {
  ArrowUpRight,
  Briefcase,
  FileText,
  LayoutDashboard,
  Link2,
  LogOut,
  Table2,
  X,
} from 'lucide-react'
import { cn } from '#/lib/utils'

const navigation = [
  { name: 'Overview', href: '/admin', icon: LayoutDashboard },
  { name: 'Projects', href: '/admin/projects', icon: Briefcase },
  { name: 'Skills', href: '/admin/skills', icon: Table2 },
  { name: 'Blog', href: '/admin/blog', icon: FileText },
  { name: 'Quick links', href: '/admin/quick-links', icon: Link2 },
]

export function Sidebar({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const location = useLocation()
  const currentPath = location.pathname

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    document.cookie =
      'admin_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    window.location.href = '/admin/login'
  }

  return (
    <>
      {open ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={onClose}
          aria-label="Close menu"
        />
      ) : null}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-sidebar transition-transform duration-200 md:static md:z-auto md:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-border px-4">
          <Link
            to="/"
            className="flex items-baseline gap-1.5 font-mono text-xs"
          >
            <span className="text-muted-foreground">lgputan</span>
            <span className="text-acid">/</span>
            <span className="text-foreground">admin</span>
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="grid size-8 place-items-center text-muted-foreground transition-colors hover:text-foreground md:hidden"
            aria-label="Close menu"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 p-3" aria-label="Admin navigation">
          {navigation.map((item) => {
            const isActive =
              item.href === '/admin'
                ? currentPath === '/admin' || currentPath === '/admin/'
                : currentPath.startsWith(item.href)

            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 border-l-2 px-3 py-2.5 font-mono text-[11px] transition-colors',
                  isActive
                    ? 'border-primary bg-secondary text-foreground'
                    : 'border-transparent text-muted-foreground hover:bg-secondary/60 hover:text-foreground',
                )}
              >
                <item.icon className="size-4" aria-hidden="true" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>

        <div className="space-y-1 border-t border-border p-3">
          <Link
            to="/"
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-2.5 font-mono text-[11px] text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground"
          >
            <ArrowUpRight className="size-4" aria-hidden="true" />
            <span>View site</span>
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-3 py-2.5 font-mono text-[11px] text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="size-4" aria-hidden="true" />
            <span>Log out</span>
          </button>
        </div>
      </aside>
    </>
  )
}
