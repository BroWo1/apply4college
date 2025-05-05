<template>
  <v-card-text class="pa-5">
    <div class="text-h5 mb-4">Create an Account</div>
    <v-alert
      v-if="error"
      type="error"
      density="compact"
      variant="tonal"
      class="mb-3"
    >
      {{ error }}
    </v-alert>
    <v-alert
      v-if="successMessage"
      type="success"
      density="compact"
      variant="tonal"
      class="mb-3"
    >
      {{ successMessage }}
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
        v-model="email"
        label="Email"
        type="email"
        required
        prepend-inner-icon="mdi-email"
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
        class="mb-3"
      />
      <v-file-input
        v-model="profilePicture"
        label="Profile Picture"
        accept="image/*"
        prepend-icon="mdi-camera"
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
        Register
      </v-btn>
    </v-form>
  </v-card-text>
</template>

<script setup>
import { ref, defineEmits } from 'vue'
import api from '@/api'

const emit = defineEmits(['register-success'])
const username = ref('')
const email = ref('')
const password = ref('')
const profilePicture = ref(null)
const loading = ref(false)
const error = ref('')
const successMessage = ref('')

async function onSubmit() {
  error.value = ''
  successMessage.value = ''
  loading.value = true

  try {
    // Validate username length according to backend model (max 30 chars)
    if (username.value.length > 30) {
      throw new Error('Username must be 30 characters or fewer')
    }

    // Create proper FormData object for uploading files
    const formData = new FormData()
    formData.append('username', username.value)
    formData.append('email', email.value)
    formData.append('password', password.value)

    if (profilePicture.value) {
      formData.append('profile_picture', profilePicture.value)
    }

    // Call the registration API with FormData
    const response = await api.post('register/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    console.log('Registered user:', response.data)
    successMessage.value = 'Registration successful! You can now log in.'

    // Clear form after successful registration
    username.value = ''
    email.value = ''
    password.value = ''
    profilePicture.value = null

    // Emit success event and wait a moment for the user to see the success message
    setTimeout(() => {
      emit('register-success')
    }, 1500)

  } catch (err) {
    console.error('Registration failed:', err.response?.data || err.message)

    // Provide user-friendly error message
    if (err.response?.data) {
      // Format API validation errors
      if (typeof err.response.data === 'object') {
        const errors = []
        for (const [field, messages] of Object.entries(err.response.data)) {
          if (Array.isArray(messages)) {
            errors.push(`${field}: ${messages.join(', ')}`)
          } else {
            errors.push(`${field}: ${messages}`)
          }
        }
        error.value = errors.join('. ')
      } else {
        error.value = 'Registration failed. Please check your information and try again.'
      }
    } else if (err.message) {
      error.value = err.message
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
