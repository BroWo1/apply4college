<template>
  <v-card-text>
    <div class="text-h5 mb-4">Login to Your Account</div>
    <v-alert
      v-if="error"
      type="error"
      density="compact"
      variant="tonal"
      class="mb-3"
    >
      {{ error }}
    </v-alert>

    <v-form @submit.prevent="onSubmit" ref="form">
      <v-text-field
        v-model="username"
        label="Username"
        required
        prepend-inner-icon="mdi-account"
        variant="outlined"
        class="mb-3"
      />
      <v-text-field
        v-model="password"
        label="Password"
        type="password"
        required
        prepend-inner-icon="mdi-lock"
        variant="outlined"
        class="mb-4"
      />
      <v-btn
        type="submit"
        :loading="loading"
        color="primary"
        block
        size="large"
      >
        Login
      </v-btn>
    </v-form>
  </v-card-text>
</template>

<script setup>
import { ref, defineEmits } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api'

const router = useRouter()
const emit = defineEmits(['login-success'])
const username = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function onSubmit() {
  error.value = '' // Clear any previous errors
  loading.value = true

  try {
    const response = await api.post('token/', {
      username: username.value,
      password: password.value
    })

    const { access, refresh } = response.data

    // Store tokens
    localStorage.setItem('access_token', access)
    localStorage.setItem('refresh_token', refresh)

    // Set default header for future requests
    api.defaults.headers.common['Authorization'] = `Bearer ${access}`

    // Create basic user data from login information
    const userData = {
      username: username.value
    }

    // Store basic user data
    localStorage.setItem('user_data', JSON.stringify(userData))

    // Emit login success event with basic user data
    emit('login-success', userData)

    // Clear form after successful login
    username.value = ''
    password.value = ''

  } catch (err) {
    console.error('Login failed:', err)

    // Provide user-friendly error message
    if (err.response) {
      if (err.response.status === 401) {
        error.value = 'Invalid username or password'
      } else if (err.response.data?.detail) {
        error.value = err.response.data.detail
      } else {
        error.value = 'Login failed. Please try again.'
      }
    } else {
      error.value = 'Network error. Please check your connection.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* No styles needed as the card is managed by the parent component */
</style>
