import apiFetch from './req-api'

export type AuthPayload = {
  fullName: string
  email: string
  password: string
  businessName?: string
  businessCategory?: string
}

export const registerOwner = async (payload: AuthPayload) => {
  const response = await apiFetch.post('/auth/register', payload)
  return response.data
}

export const loginLocal = async (payload: { email: string; password: string }) => {
  const response = await apiFetch.post('/auth/login', payload)
  return response.data
}

export const loginGoogle = async (payload: {
  googleId: string
  email: string
  fullName: string
  avatarUrl?: string
}) => {
  const response = await apiFetch.post('/auth/google', payload)
  return response.data
}

export const getMe = async () => {
  const response = await apiFetch.get('/auth/me')
  return response.data
}
