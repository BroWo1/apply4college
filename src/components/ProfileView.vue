<template>
  <v-card class="mx-auto" max-width="500">
    <v-card-title>Your Profile</v-card-title>
    <v-divider />
    <v-card-text>
      <v-skeleton-loader
        v-if="loading"
        type="article"
      />
      <div v-else>
        <v-list dense>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>SAT Reading</v-list-item-title>
              <v-list-item-subtitle>{{ profile.sat_reading }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>SAT Math</v-list-item-title>
              <v-list-item-subtitle>{{ profile.sat_math }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>GPA</v-list-item-title>
              <v-list-item-subtitle>{{ profile.gpa }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Intended Major</v-list-item-title>
              <v-list-item-subtitle>{{ profile.intended_major }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Recommendation Strength</v-list-item-title>
              <v-list-item-subtitle>{{ profile.recommendation_strength }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Nationality</v-list-item-title>
              <v-list-item-subtitle>{{ profile.nationality }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Gender</v-list-item-title>
              <v-list-item-subtitle>{{ profile.gender }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </div>
      <v-alert v-if="error" type="error" class="mt-4">{{ error }}</v-alert>
    </v-card-text>
    <v-card-actions>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api'

const profile = ref({})
const loading = ref(true)
const error = ref('')

async function fetchProfile() {
  loading.value = true
  error.value = ''
  try {
    const { data } = await api.get('profile/')
    profile.value = data
  } catch (err) {
    error.value = err.response?.data?.detail || 'Failed to load profile.'
  } finally {
    loading.value = false
  }
}

onMounted(fetchProfile)
</script>

<style scoped>
/* Add any per‑component styling here */
</style>
