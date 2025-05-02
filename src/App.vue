<template>
  <v-app>
    <Login/>
    <Schools />
    <router-view />
  </v-app>
</template>

<script setup>
  //
  import Schools from '@/components/Schools.vue';
  import Login from '@/components/Login.vue'
  import { inject, onMounted } from 'vue'
  const api = inject('api')    // <-- now injected

  onMounted(() => {
    api.get('schools/').then(/* … */)
  })
</script>
