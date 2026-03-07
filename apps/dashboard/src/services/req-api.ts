import axios from 'axios'

const API_BASE_URL = '/api'

const apiFetch = axios.create({
  baseURL: API_BASE_URL,
})

apiFetch.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth.accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default apiFetch
