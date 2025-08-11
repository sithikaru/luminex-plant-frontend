import axios from 'axios'
import { API_BASE_URL } from './constants'
import { getSession } from 'next-auth/react'

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
  timeout: 15000,
})

api.interceptors.request.use(async (config) => {
  const session = await getSession()
  const token = (session?.user as any)?.token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg = err?.response?.data?.error || err.message || 'Request failed'
    return Promise.reject(new Error(msg))
  }
)
