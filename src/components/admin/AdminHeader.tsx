import { User, Terminal } from 'lucide-react'
import { Button } from '#/components/ui/button'

export function Header() {
  return (
    <header className="flex h-14 items-center justify-between border-b border-zinc-800 bg-zinc-950 px-6">
      <div className="flex items-center gap-3">
        <span className="text-xs font-mono text-zinc-500">
          ~/admin
        </span>
        <span className="text-zinc-700">$</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-800">
          <User className="h-3.5 w-3.5 text-zinc-500" />
          <span className="text-xs font-mono text-zinc-400">admin</span>
        </div>
      </div>
    </header>
  )
}