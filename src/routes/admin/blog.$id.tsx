import { createFileRoute } from '@tanstack/react-router'
import { AdminEditBlog } from '#/pages/admin/AdminEditBlog'

export const Route = createFileRoute('/admin/blog/$id')({
  component: AdminEditBlog,
})
