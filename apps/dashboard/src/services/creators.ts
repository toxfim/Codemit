import { creatorsResponseSchema } from '@codemit/shared/api-contracts'

import apiFetch from './req-api'

export const fetchCreators = async (page = 1, limit = 20) => {
  const response = await apiFetch.get('/creators', {
    params: { page, limit },
  })

  return creatorsResponseSchema.parse(response.data).data
}
