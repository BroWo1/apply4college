// Utilities
import { defineStore } from 'pinia'
import api from '@/api'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    isAuthenticated: false,
    accessToken: null,
    refreshToken: null,
    loading: false,
    error: null
  }),

  getters: {
    username: (state) => state.user?.username || 'Guest',
    userInitials: (state) => {
      if (!state.user?.username) return 'G'
      return state.user.username.charAt(0).toUpperCase()
    },
    profilePicture: (state) => state.user?.profile_picture || null,
    userEmail: (state) => state.user?.email || ''
  },

  actions: {
    async initialize() {
      // Check for existing tokens and user data in localStorage
      const accessToken = localStorage.getItem('access_token')
      const refreshToken = localStorage.getItem('refresh_token')
      const userData = localStorage.getItem('user_data')

      if (accessToken && refreshToken) {
        this.accessToken = accessToken
        this.refreshToken = refreshToken
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`

        if (userData) {
          try {
            this.user = JSON.parse(userData)
            this.isAuthenticated = true
          } catch (e) {
            console.error('Error parsing user data:', e)
            this.clearAuth()
          }
        } else {
          // If no user data but valid tokens, fetch user profile
          try {
            await this.fetchUserProfile()
          } catch (error) {
            console.error('Error fetching user profile:', error)
            this.clearAuth()
          }
        }
      }
    },

    async login(credentials) {
      this.loading = true
      this.error = null

      try {
        const { data } = await api.post('token/', credentials)

        // Store tokens
        this.accessToken = data.access
        this.refreshToken = data.refresh
        localStorage.setItem('access_token', data.access)
        localStorage.setItem('refresh_token', data.refresh)

        // Set authorization header
        api.defaults.headers.common['Authorization'] = `Bearer ${data.access}`

        // Store user data if available in response
        if (data.user) {
          this.user = data.user
          localStorage.setItem('user_data', JSON.stringify(data.user))
          this.isAuthenticated = true
          return data.user
        }

        // Otherwise fetch user profile
        await this.fetchUserProfile()
        return this.user

      } catch (error) {
        this.error = error.response?.data?.detail || 'Login failed'
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchUserProfile() {
      try {
        const { data } = await api.get('user/profile/')
        this.user = data
        localStorage.setItem('user_data', JSON.stringify(data))
        this.isAuthenticated = true
        return data
      } catch (error) {
        console.error('Error fetching user profile:', error)
        if (error.response?.status === 401) {
          // Token might be expired, try to refresh
          try {
            await this.refreshAccessToken()
            // Try again with new token
            const { data } = await api.get('user/profile/')
            this.user = data
            localStorage.setItem('user_data', JSON.stringify(data))
            this.isAuthenticated = true
            return data
          } catch (refreshError) {
            this.clearAuth()
            throw refreshError
          }
        } else {
          throw error
        }
      }
    },

    async refreshAccessToken() {
      try {
        const { data } = await api.post('token/refresh/', {
          refresh: this.refreshToken
        })

        this.accessToken = data.access
        localStorage.setItem('access_token', data.access)
        api.defaults.headers.common['Authorization'] = `Bearer ${data.access}`

        return data.access
      } catch (error) {
        this.clearAuth()
        throw error
      }
    },

    logout() {
      this.clearAuth()
    },

    clearAuth() {
      this.user = null
      this.isAuthenticated = false
      this.accessToken = null
      this.refreshToken = null
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user_data')
      delete api.defaults.headers.common['Authorization']
    },

    updateUserData(userData) {
      this.user = { ...this.user, ...userData }
      localStorage.setItem('user_data', JSON.stringify(this.user))
    }
  }
})
