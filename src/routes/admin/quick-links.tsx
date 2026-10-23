import { createFileRoute } from '@tanstack/react-router'
import { AdminQuickLinks } from '#/pages/admin/AdminQuickLinks'

export const Route = createFileRoute('/admin/quick-links')({
  component: AdminQuickLinks,
})
