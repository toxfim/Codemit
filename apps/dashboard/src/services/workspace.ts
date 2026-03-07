import apiFetch from './req-api'

export const fetchWorkspaces = async () => {
  const response = await apiFetch.get('/workspaces')
  return response.data
}
