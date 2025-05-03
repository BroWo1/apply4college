<template>
  <v-container class="d-flex justify-center">
    <v-card max-width="400">
      <v-card-title>Login</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="onSubmit" ref="form">
          <v-text-field
            v-model="username"
            label="Username"
            required
          />
          <v-text-field
            v-model="password"
            label="Password"
            type="password"
            required
          />
          <v-btn
            type="submit"
            :loading="loading"
            color="primary"
            class="mt-4"
            block
          >
            Login
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api'

const router = useRouter()
const username = ref('')
const password = ref('')
const loading  = ref(false)

async function onSubmit() {
  console.log("Submiting login")
  loading.value = true
  try {
    const { data } = await api.post('token/', {
      username: username.value,
      password: password.value
    })
    // store tokens
    localStorage.setItem('access_token', data.access)
    localStorage.setItem('refresh_token', data.refresh)
    // set default header for future requests
    api.defaults.headers.common['Authorization'] = `Bearer ${data.access}`
    // redirect to home (or wherever)
    router.push({ path:'/' })
    console.log("Login success")
  } catch (err) {
    console.error('Login failed:', err)
    // you could show a snackbar or form error here
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.v-card { margin-top: 100px; }
</style>

