import { createFileRoute, Outlet, redirect, useRouterState } from '@tanstack/react-router'
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
  const routerState = useRouterState({ select: (s) => s.location })
  const isLoginPage = routerState.pathname === '/admin/login'

  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <Outlet />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
