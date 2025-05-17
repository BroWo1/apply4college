import axios from 'axios'

const api = axios.create({
  baseURL: 'https://server.gpeclub.com:8080/api/',
  headers: { 'Content-Type': 'application/json' }
})

// on app startup, if you have a saved token:
const token = localStorage.getItem('access_token')
if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`

export default api
