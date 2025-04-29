<template>
  <v-app-bar
    :height="appBarHeight"
    color="surface"
    elevation="2"
  >
    <!-- Logo Section (Left) -->
    <div class="d-flex align-center">
      <v-img
        src="@/assets/gpe.png"
        :width="logoSize * 3"
        :height="logoSize"
        alt="Logo"
        class="ml-2"
      ></v-img>
    </div>

    <!-- Spacer -->
    <v-spacer></v-spacer>

    <!-- Navigation Tabs (Middle) - Hidden on xs screens -->
    <div class="d-none d-sm-flex">
      <v-tabs
        v-model="activeTab"
        :color="primary"
        align-tabs="center"
      >
        <v-tab
          v-for="item in menuItems"
          :key="item.value"
          :value="item.value"
          :to="item.to"
          :class="textSizeClass"
        >
          <v-icon :icon="item.icon" class="mr-2"></v-icon>
          {{ item.title }}
        </v-tab>
      </v-tabs>
    </div>

    <!-- Spacer -->
    <v-spacer></v-spacer>

    <!-- User Profile Section (Right) -->
    <div class="d-flex align-center">
      <v-menu
        v-model="userMenu"
        :close-on-content-click="false"
        location="bottom"
      >
        <template v-slot:activator="{ props }">
          <div class="d-flex align-center" v-bind="props">
            <span :class="[textSizeClass, 'd-none d-md-flex']" class="mr-2">{{ username }}</span>
            <v-avatar size="40" class="mr-2">
              <img alt="User" src="@/assets/logo.png"/>
            </v-avatar>
          </div>
        </template>
        <v-card min-width="200">
          <v-list>
            <v-list-item prepend-icon="mdi-account" title="Profile" :to="'/profile'"></v-list-item>
            <v-list-item prepend-icon="mdi-cog" title="Settings" :to="'/settings'"></v-list-item>
            <v-divider></v-divider>
            <v-list-item prepend-icon="mdi-logout" title="Logout" @click="logout"></v-list-item>
          </v-list>
        </v-card>
      </v-menu>
    </div>

    <!-- Mobile Menu Button (visible only on xs screens) -->
    <v-app-bar-nav-icon
      class="d-flex d-sm-none"
      @click="mobileDrawer = !mobileDrawer"
    ></v-app-bar-nav-icon>
  </v-app-bar>

  <!-- Mobile Navigation Drawer (for small screens) -->
  <v-navigation-drawer
    v-model="mobileDrawer"
    temporary
    location="left"
  >
    <v-list>
      <v-list-item
        :title="username"
      >
        <template v-slot:prepend>
          <v-avatar size="40">
            <img alt="User" src="@/assets/logo.png"/>
          </v-avatar>
        </template>
      </v-list-item>

      <v-divider></v-divider>

      <v-list-item
        v-for="item in menuItems"
        :key="item.title"
        :prepend-icon="item.icon"
        :title="item.title"
        :to="item.to"
        :value="item.value"
      ></v-list-item>

      <v-divider></v-divider>

      <v-list-item prepend-icon="mdi-logout" title="Logout" @click="logout"></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
  import {ref, computed} from 'vue'
  import {useDisplay} from 'vuetify'

  const username = ref('Andy Wang')
  const activeTab = ref('explore')
  const userMenu = ref(false)
  const mobileDrawer = ref(false)
  const {name: breakpoint} = useDisplay()

  // Responsive sizes based on screen size
  const appBarHeight = computed(() => {
    if (breakpoint.value === 'xs') return 40
    if (breakpoint.value === 'sm') return 48
    if (breakpoint.value === 'md') return 56
    return 64 // lg and xl
  })

  const logoSize = computed(() => {
    if (breakpoint.value === 'xs') return 28
    if (breakpoint.value === 'sm') return 32
    if (breakpoint.value === 'md') return 36
    return 40 // lg and xl
  })

  const textSizeClass = computed(() => {
    if (breakpoint.value === 'xs') return 'text-body-4 font-weight-medium'
    if (breakpoint.value === 'sm') return 'text-body-3 font-weight-medium'
    if (breakpoint.value === 'md') return 'text-body-2 font-weight-medium'
    return 'text-body-1 font-weight-medium' // lg and xl
  })

  const menuItems = [
    {
      title: 'Home',
      icon: 'mdi-view-dashboard',
      value: 'home',
      to: '/',
    },
    {
      title: 'Explore',
      icon: 'mdi-folder',
      value: 'explore',
      to: '/explore',
    },
    {
      title: 'Profile',
      icon: 'mdi-account-group',
      value: 'profile',
      to: '/profile',
    },
    {
      title: 'Settings',
      icon: 'mdi-cog',
      value: 'settings',
      to: '/settings',
    },
  ]

  const logout = () => {
    // Logic for logging out
    console.log('Logging out...')
  }
</script>

<style scoped>
.v-app-bar {
  transition: 0.2s ease-in-out;
}
</style>
