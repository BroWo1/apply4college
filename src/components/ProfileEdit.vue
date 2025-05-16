<template>
  <v-card class="mx-auto" max-width="600">
    <v-card-title>Edit Your Profile</v-card-title>
    <v-divider />
    <v-card-text>
      <v-form ref="form" @submit.prevent="onSubmit">
        <v-text-field
          v-model.number="form.sat_reading"
          label="SAT Reading"
          type="number"
          :rules="[val => val >= 200 && val <= 800 && val % 10 === 0 || '200–800 in 10‑pt steps']"
          required
          class="mb-3"
        />
        <v-text-field
          v-model.number="form.sat_math"
          label="SAT Math"
          type="number"
          :rules="[val => val >= 200 && val <= 800 && val % 10 === 0 || '200–800 in 10‑pt steps']"
          required
          class="mb-3"
        />
        <v-text-field
          v-model.number="form.gpa"
          label="GPA"
          type="number"
          step="0.05"
          :rules="[val => val >= 0 && val <= 4 && Math.round(val*20)%1===0 || '0.00–4.00 in .05 steps']"
          required
          class="mb-3"
        />
        <v-select
          v-model="form.intended_major"
          :items="majors"
          label="Intended Major"
          required
          class="mb-3"
        />
        <v-select
          v-model="form.recommendation_strength"
          :items="[1,2,3,4]"
          label="Recommendation Strength"
          required
          class="mb-3"
        />
        <v-text-field
          v-model="form.nationality"
          label="Nationality"
          required
          class="mb-3"
        />
        <v-select
          v-model="form.gender"
          :items="genders"
          label="Gender"
          required
          class="mb-3"
        />
        <v-alert v-if="error" type="error" class="mb-3">{{ error }}</v-alert>
        <v-btn
          type="submit"
          :loading="loading"
          color="primary"
          block
        >
          Save Changes
        </v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api'

const router = useRouter()
const form = ref({
  sat_reading: 200,
  sat_math: 200,
  gpa: 0.00,
  intended_major: '',
  recommendation_strength: 1,
  nationality: '',
  gender: ''
})
const majors = [
  { text: 'Engineering', value: 'ENG' },
  { text: 'Mathematics', value: 'MTH' },
  { text: 'Physics', value: 'PHY' },
  { text: 'Chemistry', value: 'CHM' },
  { text: 'Biology', value: 'BIO' },
  { text: 'English', value: 'ENGG' },
  { text: 'History', value: 'HIS' },
  // …add the rest…
]
const genders = [
  { text: 'Male', value: 'M' },
  { text: 'Female', value: 'F' },
  { text: 'Other / Prefer not to say', value: 'O' },
]

const loading = ref(false)
const error = ref('')

async function fetchProfile() {
  loading.value = true
  try {
    const { data } = await api.get('profile/')
    Object.assign(form.value, data)
  } catch (err) {
    error.value = err.response?.data?.detail || 'Failed to load profile.'
  } finally {
    loading.value = false
  }
}

async function onSubmit() {
  loading.value = true
  error.value = ''
  try {
    await api.patch('profile/', form.value)
    router.push('/profile')   // back to view
  } catch (err) {
    error.value = err.response?.data || 'Update failed.'
  } finally {
    loading.value = false
  }
}

onMounted(fetchProfile)
</script>

<style scoped>
/* Styles as needed */
</style>
