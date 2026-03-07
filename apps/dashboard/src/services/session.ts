export const sessionKeys = {
  accessToken: 'auth.accessToken',
  selectedBusinessId: 'workspace.selectedBusinessId',
} as const

export const setAccessToken = (token: string) => {
  localStorage.setItem(sessionKeys.accessToken, token)
}

export const getAccessToken = () => localStorage.getItem(sessionKeys.accessToken)

export const clearAccessToken = () => localStorage.removeItem(sessionKeys.accessToken)

export const setSelectedBusinessId = (businessId: string) => {
  localStorage.setItem(sessionKeys.selectedBusinessId, businessId)
}

export const getSelectedBusinessId = () =>
  localStorage.getItem(sessionKeys.selectedBusinessId)

export const clearSelectedBusinessId = () =>
  localStorage.removeItem(sessionKeys.selectedBusinessId)
