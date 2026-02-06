import { getToken } from '@/utils/auth'
import axios from 'axios'

let unauthorizedHandler = () => {}

const setUnauthorizedHandler = (fn: () => void) => {
  unauthorizedHandler = fn
}

const instance = axios.create()

instance.interceptors.request.use((config) => {
  const token = getToken()
  const headers = config.headers.concat({
    Authorization: `Bearer ${token}`,
  })

  return { ...config, headers }
})

instance.interceptors.response.use(null, (resp) => {
  if (resp.response.status === 401) {
    unauthorizedHandler()
  }

  return Promise.reject(resp)
})

export { instance, setUnauthorizedHandler }
