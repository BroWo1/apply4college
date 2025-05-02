<template>
  <v-container>
    <v-card>
      <v-card-title>Schools</v-card-title>
      <v-card-text>
        <!-- try this first: -->
        <pre>{{ schools }}</pre>

        <!-- then this: -->
        <v-data-table
          :headers="headers"
          :items="schools"
          :loading="loading"
          class="elevation-1"
        />
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api'

const schools = ref([])
const loading = ref(false)

const headers = [
  { text: 'ID',          value: 'id' },
  { text: 'Code',        value: 'school_id' },
  { text: 'Name',        value: 'name' },
  { text: 'Location',    value: 'location' },
  { text: 'Description', value: 'description' },
]

onMounted(async () => {
  console.log('🔄 onMounted firing')
  loading.value = true
  try {
    const res = await api.get('schools/')
    console.log('📬 got schools:', res.data)
    schools.value = res.data
  } catch (err) {
    console.error('❌ Failed to load schools:', err)
  } finally {
    loading.value = false
  }
})

</script>
