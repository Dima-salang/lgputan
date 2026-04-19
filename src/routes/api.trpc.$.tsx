import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { trpcRouter } from '#/integrations/trpc/router'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/trpc/$')({
  server: {
    handlers: {
      GET: async ({ request }: { request: Request }) => {
        return fetchRequestHandler({
          req: request,
          router: trpcRouter,
          endpoint: '/api/trpc',
        })
      },
      POST: async ({ request }: { request: Request }) => {
        return fetchRequestHandler({
          req: request,
          router: trpcRouter,
          endpoint: '/api/trpc',
        })
      },
    },
  },
})
