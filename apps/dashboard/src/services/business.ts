import apiFetch from './req-api'

export const fetchBusiness = async (businessId: string) => {
  const response = await apiFetch.get(`/businesses/${businessId}`)
  return response.data
}

export const updateBusiness = async (
  businessId: string,
  payload: { name?: string; category?: string; aiFaq?: string },
) => {
  const response = await apiFetch.patch(`/businesses/${businessId}`, payload)
  return response.data
}

export const fetchInvites = async (businessId: string) => {
  const response = await apiFetch.get(`/businesses/${businessId}/invites`)
  return response.data
}

export const createInvite = async (
  businessId: string,
  payload: { role: 'MANAGER' | 'EMPLOYEE'; expiresInHours?: number },
) => {
  const response = await apiFetch.post(`/businesses/${businessId}/invites`, payload)
  return response.data
}

export const cancelInvite = async (businessId: string, inviteId: string) => {
  const response = await apiFetch.post(`/businesses/${businessId}/invites/${inviteId}/cancel`)
  return response.data
}
