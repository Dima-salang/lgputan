import { useEffect, useState } from 'react'
import {
  createFileRoute,
  Outlet,
  redirect,
  useRouterState,
} from '@tanstack/react-router'
import { Header } from '#/components/admin/AdminHeader'
import { Sidebar } from '#/components/admin/AdminSidebar'

import { getAuthStatus } from '#/server/auth-server'

export const Route = createFileRoute('/admin')({
  beforeLoad: async ({ location }) => {
    const { isAuthenticated } = await getAuthStatus()

    if (!isAuthenticated && location.pathname !== '/admin/login') {
      throw redirect({
        to: '/admin/login',
      })
    }
  },
  component: AdminLayout,
})

function AdminLayout() {
  const routerState = useRouterState({ select: (state) => state.location })
  const [menuOpen, setMenuOpen] = useState(false)
  const isLoginPage = routerState.pathname === '/admin/login'

  useEffect(() => {
    setMenuOpen(false)
  }, [routerState.pathname])

  if (isLoginPage) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4 text-foreground">
        <Outlet />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header onMenu={() => setMenuOpen(true)} />
        <main id="main" className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
