<template>
  <v-app>
      <div>★ Hello from GPE Club ★</div>
    <!--ProfileView/-->
    <!--ProfileEdit/-->
    <router-view />
  </v-app>
</template>

<script setup>
  //
  import Schools from '@/components/Schools.vue';
  import { inject, onMounted } from 'vue'
  import Register from "@/components/Register.vue";
  import ProfileView from "@/components/ProfileView.vue";
  import ProfileEdit from "@/components/ProfileEdit.vue";
  const api = inject('api')    // <-- now injected

  onMounted(() => {
    api.get('schools/').then(/* … */)
  })
</script>
