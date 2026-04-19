import { Link, useLocation } from '@tanstack/react-router'
import { 
  LayoutDashboard, 
  Terminal, 
  Table2, 
  Briefcase, 
  FileText, 
  Link2,
  LogOut,
  ChevronRight
} from 'lucide-react'
import { cn } from '#/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Projects', href: '/admin/projects', icon: Briefcase },
  { name: 'Skills', href: '/admin/skills', icon: Table2 },
  { name: 'Blog', href: '/admin/blog', icon: FileText },
  { name: 'Quick Links', href: '/admin/quick-links', icon: Link2 },
]

export function Sidebar() {
  const location = useLocation()
  
  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    document.cookie = 'admin_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    window.location.href = '/admin/login'
  }

  const currentPath = location.pathname

  return (
    <aside className="hidden w-64 flex-col bg-zinc-950 border-r border-zinc-800 md:flex">
      <div className="flex h-14 items-center border-b border-zinc-800 px-4">
        <Link to="/" className="flex items-center gap-2">
          <Terminal className="h-5 w-5 text-zinc-500" />
          <span className="font-mono text-sm font-semibold text-zinc-300">
            ADMIN_PANEL
          </span>
        </Link>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {navigation.map((item) => {
          const isActive = item.href === '/admin' 
            ? currentPath === '/admin' 
            : currentPath.startsWith(item.href)
          
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center justify-between gap-2 px-3 py-2.5 text-sm font-mono transition-all",
                isActive 
                  ? "bg-zinc-900 text-zinc-100 border-l-2 border-zinc-400" 
                  : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </div>
              {isActive && <ChevronRight className="h-3 w-3" />}
            </Link>
          )
        })}
      </nav>
      <div className="border-t border-zinc-800 p-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-3 py-2.5 text-sm font-mono text-zinc-500 hover:text-red-400 hover:bg-red-950/20 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span>LOGOUT</span>
        </button>
      </div>
    </aside>
  )
}