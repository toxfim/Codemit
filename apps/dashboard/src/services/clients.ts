import { clientsResponseSchema } from '@codemit/shared/api-contracts'

import apiFetch from './req-api'

export const fetchClients = async (page = 1, limit = 20) => {
  const response = await apiFetch.get('/clients', {
    params: { page, limit },
  })

  return clientsResponseSchema.parse(response.data).data
}
