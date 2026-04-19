import { createFileRoute } from '@tanstack/react-router'

export const blogIdFileRouter = createFileRoute('/blog/$id')({
  component: BlogIdPage,
})

function BlogIdPage() {
  return <div>Hello "/blog/$id"!</div>
}
