import * as React from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { trpc } from '#/integrations/trpc/react'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { AlertCircle, Loader2 } from 'lucide-react'

export function AdminLogin() {
  const [password, setPassword] = React.useState('')
  const [error, setError] = React.useState<string | null>(null)
  const navigate = useNavigate()

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: (data) => {
      localStorage.setItem('admin_token', data.token)

      const expires = new Date(Date.now() + 7 * 864e5).toUTCString()
      document.cookie = `admin_token=${data.token}; expires=${expires}; path=/; samesite=lax`

      navigate({ to: '/admin' })
    },
    onError: (err) => {
      setError(err.message || 'That password did not work.')
    },
  })

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)
    loginMutation.mutate({ password })
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-10 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          lgputan / admin
        </p>
        <h1 className="mt-4 font-display text-5xl leading-none">
          Sign in<span className="text-acid">.</span>
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Enter your password to manage the site.
        </p>
      </div>

      <div className="panel p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground"
            >
              Password
            </Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="Your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="h-11 border-border bg-background font-mono text-sm"
            />
          </div>

          {error ? (
            <div className="flex items-start gap-2 border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
              <AlertCircle
                className="mt-0.5 size-3.5 shrink-0"
                aria-hidden="true"
              />
              <span>{error}</span>
            </div>
          ) : null}

          <Button
            type="submit"
            className="h-11 w-full font-mono text-[11px] uppercase tracking-[0.12em]"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                Signing in
              </span>
            ) : (
              'Sign in'
            )}
          </Button>
        </form>
      </div>

      <p className="mt-6 text-center">
        <Link
          to="/"
          className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-acid"
        >
          Back to the site
        </Link>
      </p>
    </div>
  )
}
