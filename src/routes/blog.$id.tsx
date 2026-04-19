import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/blog/$id')({
  component: BlogIdPage,
})

function BlogIdPage() {
  return <div>Hello "/blog/$id"!</div>
}
