<template>
  <v-container fluid style="max-width: 1200px">
    <!-- Header -->
    <v-row class="text-center py-6">
      <v-col cols="12">
        <h1 class="text-h2 font-weight-bold mb-6 pt-5">Settings</h1>
        <p class="text-body-1 mb-6">
          Manage your account settings and preferences
        </p>
      </v-col>
    </v-row>

    <v-row>
      <!-- Not logged in state -->
      <v-col v-if="!userStore.isAuthenticated" cols="12" class="text-center">
        <v-card class="pa-6 mx-auto" max-width="500">
          <v-card-title class="text-h5 text-center">
            Login Required
          </v-card-title>
          <v-card-text class="text-center pa-4">
            <p class="mb-6">Please login to access your account settings</p>
            <v-btn color="primary" size="large" @click="openAuthModal">
              Login
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Logged in state - Settings content -->
      <template v-else>
        <!-- Left panel - Account settings -->
        <v-col cols="12" md="6">
          <v-card class="pa-4 mb-4" rounded="lg">
            <v-card-title class="text-h5">
              <v-icon icon="mdi-account-cog" class="mr-2"></v-icon>
              Account Settings
            </v-card-title>
            <v-divider class="my-3"></v-divider>

            <v-form @submit.prevent="saveProfile">
              <!-- Profile picture -->
              <div class="text-center mb-4">
                <v-avatar size="100" class="mb-2">
                  <v-img v-if="profilePicture" :src="previewUrl || userStore.profilePicture" alt="Profile" />
                  <v-icon v-else size="64" icon="mdi-account-circle"></v-icon>
                </v-avatar>
                <div>
                  <v-file-input
                    v-model="profilePicture"
                    label="Change Profile Picture"
                    accept="image/*"
                    prepend-icon="mdi-camera"
                    variant="outlined"
                    density="compact"
                    class="mt-2"
                    @update:model-value="handleFileChange"
                  ></v-file-input>
                </div>
              </div>

              <!-- Username -->
              <v-text-field
                v-model="username"
                label="Username"
                required
                prepend-inner-icon="mdi-account"
                variant="outlined"
                readonly
                disabled
                hint="Username cannot be changed"
                persistent-hint
                class="mb-3"
              ></v-text-field>

              <!-- Email -->
              <v-text-field
                v-model="email"
                label="Email"
                type="email"
                required
                prepend-inner-icon="mdi-email"
                variant="outlined"
                class="mb-3"
              ></v-text-field>

              <!-- Biography -->
              <v-textarea
                v-model="biography"
                label="Biography"
                rows="4"
                prepend-inner-icon="mdi-card-account-details-outline"
                variant="outlined"
                class="mb-3"
              ></v-textarea>

              <!-- Save button -->
              <v-btn
                type="submit"
                color="primary"
                block
                size="large"
                :loading="loading"
                class="mt-4"
              >
                Save Profile
              </v-btn>
            </v-form>
          </v-card>

          <!-- Password Change Section -->
          <v-card class="pa-4 mb-4" rounded="lg">
            <v-card-title class="text-h5">
              <v-icon icon="mdi-lock" class="mr-2"></v-icon>
              Change Password
            </v-card-title>
            <v-divider class="my-3"></v-divider>

            <v-form @submit.prevent="changePassword">
              <v-text-field
                v-model="currentPassword"
                label="Current Password"
                type="password"
                required
                prepend-inner-icon="mdi-lock-outline"
                variant="outlined"
                class="mb-3"
              ></v-text-field>

              <v-text-field
                v-model="newPassword"
                label="New Password"
                type="password"
                required
                prepend-inner-icon="mdi-lock"
                variant="outlined"
                :rules="[v => v.length >= 8 || 'Password must be at least 8 characters']"
                class="mb-3"
              ></v-text-field>

              <v-text-field
                v-model="confirmPassword"
                label="Confirm New Password"
                type="password"
                required
                prepend-inner-icon="mdi-lock-check"
                variant="outlined"
                :rules="[v => v === newPassword || 'Passwords do not match']"
                class="mb-3"
              ></v-text-field>

              <v-btn
                type="submit"
                color="primary"
                block
                size="large"
                :loading="passwordLoading"
                :disabled="!currentPassword || !newPassword || newPassword !== confirmPassword || newPassword.length < 8"
                class="mt-4"
              >
                Update Password
              </v-btn>
            </v-form>
          </v-card>
        </v-col>

        <!-- Right panel - App settings & Notifications -->
        <v-col cols="12" md="6">
          <v-card class="pa-4 mb-4" rounded="lg">
            <v-card-title class="text-h5">
              <v-icon icon="mdi-tune" class="mr-2"></v-icon>
              Application Settings
            </v-card-title>
            <v-divider class="my-3"></v-divider>

            <div class="text-h6 mt-4 mb-3">General</div>

            <!-- Theme Preference -->
            <v-switch
              v-model="darkMode"
              label="Dark Mode"
              color="primary"
              hide-details
              class="mb-3"
            ></v-switch>

            <v-switch
              v-model="enableNotifications"
              label="Enable Notifications"
              color="primary"
              hide-details
              class="mb-3"
            ></v-switch>

            <!-- OpenAI API Key for AI Recommendations -->
            <div class="text-h6 mt-6 mb-3">AI Recommendations</div>
            <v-text-field
              v-model="openaiApiKey"
              label="OpenAI API Key"
              placeholder="sk-..."
              hint="Required for AI-powered recommendations"
              variant="outlined"
              prepend-inner-icon="mdi-key-variant"
              class="mb-3"
            ></v-text-field>

            <v-btn
              color="primary"
              block
              size="large"
              :loading="apiKeyLoading"
              :disabled="!openaiApiKey || openaiApiKey.length < 10"
              @click="saveApiKey"
              class="mt-4"
            >
              Save API Key
            </v-btn>
          </v-card>

          <!-- Data Management -->
          <v-card class="pa-4 mb-4" rounded="lg">
            <v-card-title class="text-h5">
              <v-icon icon="mdi-database" class="mr-2"></v-icon>
              Data Management
            </v-card-title>
            <v-divider class="my-3"></v-divider>

            <div class="pa-4">
              <p class="text-body-1 mb-4">
                Manage your data and account options
              </p>

              <v-btn
                color="primary"
                variant="outlined"
                block
                class="mb-3"
                @click="exportData"
              >
                <v-icon class="mr-2">mdi-download</v-icon>
                Export Your Data
              </v-btn>

              <v-btn
                color="error"
                variant="outlined"
                block
                @click="showDeleteConfirm = true"
              >
                <v-icon class="mr-2">mdi-delete</v-icon>
                Delete Account
              </v-btn>
            </div>
          </v-card>
        </v-col>
      </template>
    </v-row>

    <!-- Success/Error Alerts -->
    <v-snackbar
      v-model="showAlert"
      :color="alertType"
      :timeout="3000"
    >
      {{ alertMessage }}
      <template v-slot:actions>
        <v-btn
          variant="text"
          @click="showAlert = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>

    <!-- Delete Account Confirmation Dialog -->
    <v-dialog v-model="showDeleteConfirm" max-width="500">
      <v-card>
        <v-card-title class="text-h5 bg-error text-white">
          Delete Account
        </v-card-title>
        <v-card-text class="pa-4 mt-4">
          <p class="text-body-1">
            Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently lost.
          </p>
          <v-text-field
            v-model="deleteConfirmText"
            label="Type 'DELETE' to confirm"
            variant="outlined"
            class="mt-4"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="showDeleteConfirm = false">
            Cancel
          </v-btn>
          <v-btn
            color="error"
            variant="elevated"
            :disabled="deleteConfirmText !== 'DELETE'"
            @click="deleteAccount"
          >
            Delete My Account
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Auth Modal -->
    <AuthModal v-model="showAuthModal" />
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import AuthModal from '@/components/AuthModal.vue';
import api from '@/api';

const router = useRouter();
const userStore = useUserStore();

// Auth modal control
const showAuthModal = ref(false);

// Form fields
const username = ref('');
const email = ref('');
const biography = ref('');
const profilePicture = ref(null);
const previewUrl = ref(null);
const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const deleteConfirmText = ref('');

// App settings
const darkMode = ref(false);
const enableNotifications = ref(true);
const openaiApiKey = ref('');

// UI state
const loading = ref(false);
const passwordLoading = ref(false);
const apiKeyLoading = ref(false);
const showAlert = ref(false);
const alertMessage = ref('');
const alertType = ref('success');
const showDeleteConfirm = ref(false);

// Helper function for handling file uploads
const handleFileChange = (file) => {
  if (!file) {
    previewUrl.value = null;
    return;
  }

  // Create a preview URL
  previewUrl.value = URL.createObjectURL(file);
};

// Initialize form with user data
const initializeForm = () => {
  if (userStore.user) {
    username.value = userStore.user.username || '';
    email.value = userStore.user.email || '';
    biography.value = userStore.user.biography || '';
  }

  // Load API key from localStorage if available
  const storedApiKey = localStorage.getItem('openai_api_key');
  if (storedApiKey) {
    openaiApiKey.value = storedApiKey;
  }

  // Load app settings from localStorage
  const appSettings = localStorage.getItem('app_settings');
  if (appSettings) {
    try {
      const settings = JSON.parse(appSettings);
      darkMode.value = settings.darkMode || false;
      enableNotifications.value = settings.enableNotifications !== false; // Default to true
    } catch (e) {
      console.error('Error parsing app settings:', e);
    }
  }
};

// Watch for user authentication state
watch(() => userStore.isAuthenticated, (isAuthenticated) => {
  if (isAuthenticated) {
    initializeForm();
  }
});

// Initialize on component mount
onMounted(() => {
  if (userStore.isAuthenticated) {
    initializeForm();
  }
});

// Open authentication modal
const openAuthModal = () => {
  showAuthModal.value = true;
};

// Save profile changes
const saveProfile = async () => {
  loading.value = true;
  try {
    // Since we don't have a user/profile endpoint, we'll just update the local storage
    // In a real app, you would make an API call to update the profile

    // Create updated user data object
    const updatedUserData = {
      ...userStore.user,
      email: email.value,
      biography: biography.value
    };

    // If there's a new profile picture, we would typically upload it
    // Since we don't have an endpoint, we'll just show a message
    if (profilePicture.value) {
      // In a real app, you'd upload this file to the server
      // For now, we'll just update the UI with the preview
      updatedUserData.profile_picture = previewUrl.value;
    }

    // Update store with new user data
    userStore.updateUserData(updatedUserData);

    // Show success message
    alertMessage.value = 'Profile updated successfully (saved locally only)';
    alertType.value = 'success';
    showAlert.value = true;

    // Clear file input
    profilePicture.value = null;
    previewUrl.value = null;

  } catch (error) {
    console.error('Error updating profile:', error);
    alertMessage.value = error.message || 'Failed to update profile';
    alertType.value = 'error';
    showAlert.value = true;
  } finally {
    loading.value = false;
  }
};

// Change password
const changePassword = async () => {
  passwordLoading.value = true;
  try {
    // Since we don't have a user/change-password endpoint, we'll simulate success
    // In a real app, you would make an API call to change the password

    // Validate current password (in a real app, this would be done server-side)
    // For demo purposes, we'll just accept any non-empty password
    if (!currentPassword.value) {
      throw new Error('Current password is required');
    }

    // Wait a moment to simulate an API call
    await new Promise(resolve => setTimeout(resolve, 500));

    // Clear password fields
    currentPassword.value = '';
    newPassword.value = '';
    confirmPassword.value = '';

    // Show success message
    alertMessage.value = 'Password change simulated (no API endpoint available)';
    alertType.value = 'success';
    showAlert.value = true;

  } catch (error) {
    console.error('Error changing password:', error);
    alertMessage.value = error.message || 'Failed to change password';
    alertType.value = 'error';
    showAlert.value = true;
  } finally {
    passwordLoading.value = false;
  }
};

// Save OpenAI API Key
const saveApiKey = () => {
  apiKeyLoading.value = true;
  try {
    localStorage.setItem('openai_api_key', openaiApiKey.value);

    // Show success message
    alertMessage.value = 'API key saved successfully';
    alertType.value = 'success';
    showAlert.value = true;
  } catch (error) {
    console.error('Error saving API key:', error);
    alertMessage.value = 'Failed to save API key';
    alertType.value = 'error';
    showAlert.value = true;
  } finally {
    apiKeyLoading.value = false;
  }
};

// Save app settings
watch([darkMode, enableNotifications], () => {
  // Save settings to localStorage
  localStorage.setItem('app_settings', JSON.stringify({
    darkMode: darkMode.value,
    enableNotifications: enableNotifications.value
  }));
});

// Export user data
const exportData = async () => {
  try {
    const response = await api.get('user/export-data/');

    // Create a download link
    const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my-profile-data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Show success message
    alertMessage.value = 'Data exported successfully';
    alertType.value = 'success';
    showAlert.value = true;
  } catch (error) {
    console.error('Error exporting data:', error);
    alertMessage.value = 'Failed to export data';
    alertType.value = 'error';
    showAlert.value = true;
  }
};

// Delete account
const deleteAccount = async () => {
  try {
    // Since we don't have a user/account/ delete endpoint, we'll just simulate success
    // In a real app, you would make an API call to delete the account

    // Wait a moment to simulate an API call
    await new Promise(resolve => setTimeout(resolve, 500));

    // Logout user (this clears local storage)
    userStore.logout();

    // Show success message
    alertMessage.value = 'Account deletion simulated (data cleared locally)';
    alertType.value = 'success';
    showAlert.value = true;

    // Close dialog and redirect to home
    showDeleteConfirm.value = false;
    router.push('/');
  } catch (error) {
    console.error('Error deleting account:', error);
    alertMessage.value = error.message || 'Failed to delete account';
    alertType.value = 'error';
    showAlert.value = true;
    showDeleteConfirm.value = false;
  }
};
</script>

<style scoped>
.v-card {
  transition: all 0.3s;
}
</style>
