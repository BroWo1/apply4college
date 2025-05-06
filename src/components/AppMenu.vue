<template>
  <v-app-bar
    :height="appBarHeight"
    color="surface"
    elevation="2"
    class="app-bar-relative"
  >
    <!-- Logo Section (Left) - Updated to link to index/root -->
    <router-link to="/" class="d-flex align-center px-1" style="text-decoration: none; color: inherit;">
      <v-img
        src="@/assets/a4cLong.png"
        :height="logoSize"
        :width="logoSize * 5.176"
        alt="Logo"
        class="ml-2"
      ></v-img>
    </router-link>

    <!-- Spacer -->
    <v-spacer></v-spacer>

    <!-- Navigation Tabs (Middle) - Hidden on xs screens -->
    <div class="d-none d-sm-flex nav-center-absolute">
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

    <!-- Dev Button (Visible only in development) -->
    <v-btn
      v-if="isDevelopment"
      icon
      @click="showSchoolsDialog = true"
      title="Show Schools (Dev)"
      class="mr-2"
    >
      <v-icon>mdi-school</v-icon>
    </v-btn>

    <!-- User Profile Section (Right) -->
    <div class="d-flex align-center">
      <!-- Not authenticated state -->
      <div v-if="!userStore.isAuthenticated">
        <v-btn color="primary" variant="text" @click="openAuthModal('login')">
          Login
        </v-btn>
        <v-btn color="primary" variant="outlined" class="ml-2  mr-3" @click="openAuthModal('register')">
          Register
        </v-btn>
      </div>

      <!-- Authenticated state -->
      <v-menu
        v-else
        v-model="userMenu"
        :close-on-content-click="false"
        location="bottom"
      >
        <template v-slot:activator="{ props }">
          <div class="d-flex align-center" v-bind="props">
            <span :class="[textSizeClass, 'd-none d-md-flex']" class="mr-2">{{ userStore.username }}</span>
            <v-avatar size="40" class="mr-2">
              <v-img v-if="userStore.profilePicture" :src="userStore.profilePicture" alt="User" />
              <v-icon v-else icon="mdi-account" />
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
        :title="userStore.isAuthenticated ? userStore.username : 'Guest'"
      >
        <template v-slot:prepend>
          <v-avatar size="40">
            <v-img v-if="userStore.profilePicture" :src="userStore.profilePicture" alt="User" />
            <v-icon v-else icon="mdi-account" />
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

      <!-- Dev Button in Mobile Drawer -->
      <v-list-item
        v-if="isDevelopment"
        prepend-icon="mdi-school"
        title="Show Schools (Dev)"
        @click="showSchoolsDialog = true"
      ></v-list-item>

      <v-divider></v-divider>

      <!-- Authentication buttons for mobile -->
      <template v-if="!userStore.isAuthenticated">
        <v-list-item prepend-icon="mdi-login" title="Login" @click="openAuthModal('login')"></v-list-item>
        <v-list-item prepend-icon="mdi-account-plus" title="Register" @click="openAuthModal('register')"></v-list-item>
      </template>
      <v-list-item v-else prepend-icon="mdi-logout" title="Logout" @click="logout"></v-list-item>
    </v-list>
  </v-navigation-drawer>

  <!-- Auth Modal -->
  <AuthModal
    v-model="showAuthModal"
    :initial-tab="authModalTab"
    @login-success="handleLoginSuccess"
  />

  <!-- Schools Dialog (Visible only in development) -->
  <v-dialog v-model="showSchoolsDialog" max-width="800px" v-if="isDevelopment">
    <v-card>
      <v-card-title>
        <span class="headline">Schools Component (Dev View)</span>
        <v-spacer></v-spacer>
        <v-btn icon @click="showSchoolsDialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <Schools />
      </v-card-text>
    </v-card>
  </v-dialog>

</template>

<script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useDisplay } from 'vuetify'
  import { useUserStore } from '@/stores/user'
  import Schools from '@/components/Schools.vue'
  import AuthModal from '@/components/AuthModal.vue'

  const userStore = useUserStore()
  const activeTab = ref('explore')
  const userMenu = ref(false)
  const mobileDrawer = ref(false)
  const showSchoolsDialog = ref(false)
  const showAuthModal = ref(false)
  const authModalTab = ref('login')
  const {name: breakpoint} = useDisplay()

  // Initialize user store
  onMounted(() => {
    userStore.initialize()
  })

  // Check if in development mode (Vite specific)
  const isDevelopment = computed(() => import.meta.env.DEV);

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
      to: '/home',
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

  // Open auth modal with specific tab
  const openAuthModal = (tab) => {
    authModalTab.value = tab
    showAuthModal.value = true
  }

  // Handle successful login
  const handleLoginSuccess = (userData) => {
    showAuthModal.value = false
    // No need to manually set user data as it's handled by the store
  }

  // Logout function
  const logout = () => {
    userStore.logout()
    userMenu.value = false
  }
</script>

<style scoped>
.v-app-bar {
  transition: 0.2s ease-in-out;
}
/* Add relative positioning to the app bar for absolute centering context */
.app-bar-relative {
  position: relative;
}
/* Absolutely center the navigation tabs */
.nav-center-absolute {
  position: absolute;
  left: 50%;
  top: 0;
  height: 100%;
  transform: translateX(-50%);
  align-items: center;
  display: flex;
  z-index: 1;
}
</style>

