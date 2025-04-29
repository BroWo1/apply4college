<template>
  <v-navigation-drawer
    v-model="drawer"
    :rail="rail"
    permanent
    @click="rail = false"
  >
    <v-list-item
      :title="username"
      nav
    >
      <template v-slot:prepend>
        <v-avatar v-if="!rail" size="40">
          <img src="@/assets/logo.png" alt="Logo" />
        </v-avatar>
      </template>
      <template v-slot:append>
        <v-btn
          variant="text"
          :icon="rail ? 'mdi-chevron-right' : 'mdi-chevron-left'"
          @click.stop="rail = !rail"
        ></v-btn>
      </template>
    </v-list-item>

    <v-divider></v-divider>

    <v-list density="compact" nav>
      <v-list-item
        v-for="item in menuItems"
        :key="item.title"
        :value="item.value"
        :prepend-icon="item.icon"
        :title="item.title"
        :to="item.to"
      ></v-list-item>
    </v-list>

    <template v-slot:append>
      <div class="pa-2">
        <v-btn block color="primary" @click="logout">
          <v-icon start>mdi-logout</v-icon>
          <span v-if="!rail" >Logout</span>
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script setup>
import { ref } from 'vue'

const drawer = ref(true)
const rail = ref(false)
const username = ref('Andy Wang')

const menuItems = [
  {
    title: 'Explore',
    icon: 'mdi-view-dashboard',
    value: 'explore',
    to: '/'
  },
  {
    title: 'Plans',
    icon: 'mdi-folder',
    value: 'plans',
    to: '/plans'
  },
  {
    title: 'Profile',
    icon: 'mdi-account-group',
    value: 'profile',
    to: '/profile'
  },
  {
    title: 'Settings',
    icon: 'mdi-cog',
    value: 'settings',
    to: '/settings'
  }
]

const logout = () => {
  // Logic for logging out
  console.log('Logging out...')
}
</script>

<style scoped>
.v-navigation-drawer {
  transition: 0.2s ease-in-out;
}
</style>
