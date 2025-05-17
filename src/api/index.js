import axios from 'axios'

const api = axios.create({
  baseURL: '/api/', // Changed to use the proxy
  headers: { 'Content-Type': 'application/json' }
})

// on app startup, if you have a saved token:
const token = localStorage.getItem('access_token')
if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`

export default api
