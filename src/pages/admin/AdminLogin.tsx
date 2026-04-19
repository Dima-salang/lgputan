import * as React from 'react'
import { useNavigate } from '@tanstack/react-router'
import { trpc } from '#/integrations/trpc/react'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { AlertCircle, Loader2, Terminal } from 'lucide-react'

export function AdminLogin() {
  const [password, setPassword] = React.useState('')
  const [error, setError] = React.useState<string | null>(null)
  const navigate = useNavigate()

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: (data) => {
      // Set localStorage for legacy compatibility if needed
      localStorage.setItem('admin_token', data.token)
      
      // Set cookie for SSR support (7 days)
      const expires = new Date(Date.now() + 7 * 864e5).toUTCString()
      document.cookie = `admin_token=${data.token}; expires=${expires}; path=/; samesite=lax`
      
      navigate({ to: '/admin' })
    },
    onError: (err) => {
      setError(err.message || 'Authentication failed')
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    loginMutation.mutate({ password })
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-zinc-950 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(currentColor 1px, transparent 1px),
            linear-gradient(90deg, currentColor 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />
      </div>
      
      <div className="w-full max-w-sm relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-zinc-900 border border-zinc-800">
            <Terminal className="w-7 h-7 text-zinc-400" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-100 font-mono">
            ADMIN_ACCESS
          </h1>
          <p className="mt-2 text-sm text-zinc-500 font-mono">
            // authentication required
          </p>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 p-6 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 bg-zinc-950 border-zinc-800 text-zinc-100 font-mono placeholder:text-zinc-600 focus:border-zinc-600 focus:ring-0 transition-colors"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-400 bg-red-950/30 border border-red-900/50 p-3 font-mono text-xs">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>ERROR: {error}</span>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full h-12 bg-zinc-100 text-zinc-950 font-mono text-sm hover:bg-zinc-200 transition-colors"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  AUTHENTICATING...
                </span>
              ) : (
                'EXECUTE_LOGIN'
              )}
            </Button>
          </form>
        </div>

        <p className="text-center mt-6 text-xs text-zinc-600 font-mono">
          &gt; restricted access system
        </p>
      </div>
    </div>
  )
}