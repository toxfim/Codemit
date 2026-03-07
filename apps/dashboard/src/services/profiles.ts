import { profilesResponseSchema } from '@codemit/shared/api-contracts'

import apiFetch from './req-api'

export const fetchProfiles = async (page = 1, limit = 20) => {
  const response = await apiFetch.get('/profiles', {
    params: { page, limit },
  })

  return profilesResponseSchema.parse(response.data).data
}
