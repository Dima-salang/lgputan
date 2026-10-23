import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'

export const getAuthStatus = createServerFn({ method: 'GET' }).handler(
  async () => {
    const request = getRequest()
    const token = request?.headers
      .get('cookie')
      ?.split('; ')
      .find((row: string) => row.startsWith('admin_token='))
      ?.split('=')[1]

    return { isAuthenticated: !!token }
  },
)
