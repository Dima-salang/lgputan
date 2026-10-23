import { config } from 'dotenv'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { trpcRouter } from '#/integrations/trpc/router'
import { createFileRoute } from '@tanstack/react-router'
import { getDb } from '#/db'

config({ path: '.env.local', override: true })

export const Route = createFileRoute('/api/trpc/$')({
  server: {
    handlers: {
      GET: async ({ request }: { request: Request }) => {
        return fetchRequestHandler({
          req: request,
          router: trpcRouter,
          endpoint: '/api/trpc',
          createContext: async () => ({
            db: await getDb(),
            headers: request.headers,
          }),
          onError: ({ error }: { error: Error }) => {
            console.error(error)
          },
        })
      },
      POST: async ({ request }: { request: Request }) => {
        return fetchRequestHandler({
          req: request,
          router: trpcRouter,
          endpoint: '/api/trpc',
          createContext: async () => ({
            db: await getDb(),
            headers: request.headers,
          }),
          onError: ({ error }: { error: Error }) => {
            console.error(error)
          },
        })
      },
      OPTIONS: async ({ request }: { request: Request }) => {
        return fetchRequestHandler({
          req: request,
          router: trpcRouter,
          endpoint: '/api/trpc',
          createContext: async () => ({
            db: await getDb(),
            headers: request.headers,
          }),
          onError: ({ error }: { error: Error }) => {
            console.error(error)
          },
        })
      },
      PATCH: async ({ request }: { request: Request }) => {
        return fetchRequestHandler({
          req: request,
          router: trpcRouter,
          endpoint: '/api/trpc',
          createContext: async () => ({
            db: await getDb(),
            headers: request.headers,
          }),
          onError: ({ error }: { error: Error }) => {
            console.error(error)
          },
        })
      },
      DELETE: async ({ request }: { request: Request }) => {
        return fetchRequestHandler({
          req: request,
          router: trpcRouter,
          endpoint: '/api/trpc',
          createContext: async () => ({
            db: await getDb(),
            headers: request.headers,
          }),
          onError: ({ error }: { error: Error }) => {
            console.error(error)
          },
        })
      },
    },
  },
})
