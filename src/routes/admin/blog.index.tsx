import { createFileRoute } from '@tanstack/react-router'
import { AdminListBlog } from '#/pages/admin/AdminListBlog'

export const Route = createFileRoute('/admin/blog/')({
  component: AdminListBlog,
})
