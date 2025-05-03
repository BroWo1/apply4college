<template>
  <v-container class="d-flex justify-center">
    <v-card max-width="500">
      <v-card-title>Register</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="onSubmit" ref="form">
          <v-text-field
            v-model="username"
            label="Username"
            required
          />
          <v-text-field
            v-model="email"
            label="Email"
            type="email"
            required
          />
          <v-text-field
            v-model="password"
            label="Password"
            type="password"
            required
          />
          <v-textarea
            v-model="biography"
            label="Biography"
            rows="3"
          />
          <v-file-input
            v-model="profilePicture"
            label="Profile Picture"
            accept="image/*"
          />
          <v-btn
            type="submit"
            :loading="loading"
            color="primary"
            class="mt-4"
            block
          >
            Register
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { registerUser } from '@/api/register'

const router = useRouter()
const username = ref('')
const email    = ref('')
const password = ref('')
const biography = ref('')
const profilePicture = ref(null)
const loading = ref(false)

async function onSubmit() {
  loading.value = true
  try {
    const user = await registerUser({
      username: username.value,
      email: email.value,
      password: password.value,
      biography: biography.value,
      profile_picture: profilePicture.value
    })
    console.log('Registered user:', user)
    // optionally navigate to login or home
    router.push('/')
  } catch (err) {
    console.error('Registration failed:', err.response?.data || err.message)
    // show error feedback here
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.v-card { margin-top: 80px; }
</style>
