<template>
  <v-app>
      <div>★ Hello from App.vue ★</div>
    <router-view />
  </v-app>
</template>

<script setup>
  //
  import Schools from '@/components/Schools.vue';
  import { inject, onMounted } from 'vue'
  const api = inject('api')    // <-- now injected

  onMounted(() => {
    api.get('schools/').then(/* … */)
  })
</script>
