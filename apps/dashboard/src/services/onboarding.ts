import apiFetch from './req-api'

export const resolveOnboarding = async (token: string) => {
  const response = await apiFetch.get('/invites/resolve-onboarding', {
    params: { token },
  })
  return response.data
}

export const completeOnboarding = async (payload: {
  token: string
  fullName: string
  password: string
}) => {
  const response = await apiFetch.post('/invites/complete-onboarding', payload)
  return response.data
}
