<template>
  <v-app-bar
    :height="appBarHeight"
    color="surface"
    elevation="0"
    border
    class="app-bar"
  >
    <router-link to="/" class="d-flex align-center px-1" style="text-decoration: none; color: inherit;">
      <v-img
        src="@/assets/a4cLong.png"
        :height="logoSize"
        :width="logoSize * 5.176"
        alt="Logo"
        class="ml-2"
      ></v-img>
    </router-link>

    <v-spacer></v-spacer>

    <div class="d-none d-sm-flex">
      <v-tabs
        v-model="activeTab"
        :color="primary"
        align-tabs="center"
        grow
      >
        <v-tab
          v-for="item in menuItems"
          :key="item.value"
          :value="item.value"
          :to="item.to"
          :class="textSizeClass"
          class="nav-tab"
        >
          <v-icon :icon="item.icon" start></v-icon>
          {{ $t('appMenu.' + item.title) }}
        </v-tab>
      </v-tabs>
    </div>

    <v-spacer></v-spacer>

    <v-btn
      v-if="isDevelopment"
      icon
      @click="showSchoolsDialog = true"
      :title="$t('appMenu.showSchoolsDev')"
      class="mr-2 d-none d-sm-flex" >
      <v-icon>mdi-school</v-icon>
    </v-btn>

    <div class="d-flex align-center">
      <div v-if="!userStore.isAuthenticated" class="d-none d-sm-flex align-center">
        <v-btn color="primary" variant="text" @click="openAuthModal('login')" rounded="lg">
          {{ $t('appMenu.login') }}
        </v-btn>
        <v-btn color="primary" variant="flat" class="ml-2 mr-3" @click="openAuthModal('register')" rounded="lg">
          {{ $t('appMenu.register') }}
        </v-btn>
      </div>

      <v-menu
        v-else
        v-model="userMenu"
        :close-on-content-click="false"
        location="bottom end"
        transition="slide-y-transition"
      >
        <template v-slot:activator="{ props }">
          <div class="d-flex align-center mr-1 user-activator" v-bind="props">
            <span :class="[textSizeClass, 'd-none d-md-flex']" class="mr-2">{{ userStore.isAuthenticated ? userStore.username : $t('appMenu.guest') }}</span>
            <v-avatar size="40" :class="{'mr-2': breakpoint !== 'xs'}">
              <v-img v-if="userStore.profilePicture" :src="userStore.profilePicture" alt="User" cover />
              <v-icon v-else icon="mdi-account-circle" />
            </v-avatar>
          </div>
        </template>
        <v-card min-width="220" rounded="xl" elevation="4">
          <v-list nav density="compact">
            <v-list-item prepend-icon="mdi-account-circle-outline" :title="$t('appMenu.profile')" :to="'/profile'" rounded="lg"></v-list-item>
            <v-list-item prepend-icon="mdi-cog-outline" :title="$t('appMenu.settings')" :to="'/settings'" rounded="lg"></v-list-item>
            <v-divider class="my-2"></v-divider>
            <v-list-item prepend-icon="mdi-logout" :title="$t('appMenu.logout')" @click="logout" rounded="lg" base-color="error"></v-list-item>
          </v-list>
        </v-card>
      </v-menu>
    </div>

    <v-app-bar-nav-icon
      class="d-flex d-sm-none"
      @click="mobileDrawer = !mobileDrawer"
    ></v-app-bar-nav-icon>
  </v-app-bar>

  <v-navigation-drawer
    v-model="mobileDrawer"
    temporary
    location="left"
  >
    <v-list nav>
      <v-list-item
        :title="userStore.isAuthenticated ? userStore.username : $t('appMenu.guest')"
        class="mb-2"
      >
        <template v-slot:prepend>
          <v-avatar size="40">
            <v-img v-if="userStore.profilePicture" :src="userStore.profilePicture" alt="User" cover />
            <v-icon v-else icon="mdi-account-circle" />
          </v-avatar>
        </template>
      </v-list-item>

      <v-divider></v-divider>

      <v-list-item
        v-for="item in menuItems"
        :key="item.title"
        :prepend-icon="item.icon"
        :title="$t('appMenu.' + item.title)"
        :to="item.to"
        :value="item.value"
        @click="mobileDrawer = false"
        rounded="lg"
      ></v-list-item>

      <v-list-item
        v-if="isDevelopment"
        prepend-icon="mdi-school"
        :title="$t('appMenu.showSchoolsDev')"
        @click="showSchoolsDialog = true; mobileDrawer = false"
        rounded="lg"
      ></v-list-item>

      <v-divider></v-divider>

      <template v-if="!userStore.isAuthenticated">
        <v-list-item prepend-icon="mdi-login" :title="$t('appMenu.login')" @click="openAuthModal('login'); mobileDrawer = false" rounded="lg"></v-list-item>
        <v-list-item prepend-icon="mdi-account-plus" :title="$t('appMenu.register')" @click="openAuthModal('register'); mobileDrawer = false" rounded="lg"></v-list-item>
      </template>
      <v-list-item v-else prepend-icon="mdi-logout" :title="$t('appMenu.logout')" @click="logout(); mobileDrawer = false" rounded="lg" base-color="error"></v-list-item>
    </v-list>
  </v-navigation-drawer>

  <AuthModal
    v-model="showAuthModal"
    :initial-tab="authModalTab"
    @login-success="handleLoginSuccess"
  />

  <v-dialog v-model="showSchoolsDialog" max-width="800px" v-if="isDevelopment">
    <v-card rounded="xl">
      <v-card-title>
        <span class="headline">{{ $t('appMenu.schoolsComponentDev') }}</span>
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
import { useUserStore } from '@/stores/user' // Assuming path is correct
import Schools from '@/components/Schools.vue'    // Assuming path is correct
import AuthModal from '@/components/AuthModal.vue' // Assuming path is correct
import { useRouter } from 'vue-router' // Import for navigation
import { useI18n } from 'vue-i18n'

const { t } = useI18n();

const userStore = useUserStore()
const router = useRouter() // Initialize router
const activeTab = ref('explore') // Default active tab
const userMenu = ref(false)
const mobileDrawer = ref(false)
const showSchoolsDialog = ref(false)
const showAuthModal = ref(false)
const authModalTab = ref('login')
const { name: breakpoint, primary } = useDisplay() // primary color from theme

// Initialize user store
onMounted(() => {
  userStore.initialize()
})

// Check if in development mode (Vite specific)
const isDevelopment = computed(() => import.meta.env.DEV);

// Responsive sizes based on screen size
const appBarHeight = computed(() => {
  // Using Vuetify's breakpoint names
  switch (breakpoint.value) {
    case 'xs': return 56 // Increased slightly for better touch on mobile
    case 'sm': return 56
    case 'md': return 64
    default: return 64 // lg and xl
  }
})

const logoSize = computed(() => {
  switch (breakpoint.value) {
    case 'xs': return 36 // Slightly increased
    case 'sm': return 36
    case 'md': return 40
    default: return 40 // lg and xl
  }
})

// Using standard Vuetify typography classes for consistency
// Or use your custom classes if they are defined elsewhere
const textSizeClass = computed(() => {
  switch (breakpoint.value) {
    case 'xs': return 'text-caption font-weight-medium' // Smallest standard for tabs/text
    case 'sm': return 'text-body-2 font-weight-medium'
    case 'md': return 'text-body-2 font-weight-medium'
    default: return 'text-body-1 font-weight-medium' // lg and xl
  }
})

const menuItems = [
  {
    title: 'home',
    icon: 'mdi-view-dashboard-outline',
    value: 'home',
    to: '/home',
  },
  {
    title: 'explore',
    icon: 'mdi-compass-outline',
    value: 'explore',
    to: '/explore',
  },
  {
    title: 'profile',
    icon: 'mdi-account-circle-outline',
    value: 'profile',
    to: '/profile',
  },
  {
    title: 'settings',
    icon: 'mdi-cog-outline',
    value: 'settings',
    to: '/settings',
  },
]

// Open auth modal with specific tab
const openAuthModal = (tab) => {
  authModalTab.value = tab
  showAuthModal.value = true
  mobileDrawer.value = false // Close drawer if opening modal from it
}

// Handle successful login
const handleLoginSuccess = (userData) => {
  showAuthModal.value = false
  // User data is handled by the store, potentially redirect or update UI
  // Example: router.push(userStore.redirectUrl || '/dashboard')
}

// Logout function
const logout = () => {
  userStore.logout()
  userMenu.value = false
  mobileDrawer.value = false // Close drawer if logging out from it
  // Redirect to home or login page after logout
  if (router.currentRoute.value.meta.requiresAuth) {
    router.push('/')
  }
}
</script>

<style scoped>
.app-bar {
  /* This makes the border on the app-bar more subtle */
  border-bottom: 1px solid rgba(0, 0, 0, 0.1) !important;
}

.nav-tab {
  text-transform: none; /* Prevents uppercase text in tabs */
  letter-spacing: normal;
}

.user-activator {
  cursor: pointer;
  padding: 4px;
  border-radius: 24px;
  transition: background-color 0.2s ease-in-out;
}

.user-activator:hover {
  background-color: rgba(0,0,0,0.05);
}
</style>