<template>
  <v-app>
      <div>★ Hello from GPE Club ★</div>
    <router-view />
  </v-app>
</template>

<script setup>
  //
  import Schools from '@/components/Schools.vue';
  import { inject, onMounted } from 'vue'
  import Register from "@/components/Register.vue";
  const api = inject('api')    // <-- now injected

  onMounted(() => {
    api.get('schools/').then(/* … */)
  })
</script>
