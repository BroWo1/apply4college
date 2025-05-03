<template>
  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <v-tabs v-model="activeTab" grow>
        <v-tab value="login">Login</v-tab>
        <v-tab value="register">Register</v-tab>
      </v-tabs>

      <v-window v-model="activeTab">
        <v-window-item value="login">
          <Login @login-success="handleLoginSuccess" />
        </v-window-item>

        <v-window-item value="register">
          <Register @register-success="switchToLogin" />
        </v-window-item>
      </v-window>

      <v-card-actions class="d-flex justify-end">
        <v-btn color="grey-darken-1" variant="text" @click="dialog = false">
          Cancel
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, defineEmits, defineProps, watch } from 'vue';
import Login from '@/components/Login.vue';
import Register from '@/components/Register.vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  initialTab: {
    type: String,
    default: 'login'
  }
});

const emit = defineEmits(['update:modelValue', 'login-success']);

// Dialog visibility state bound to v-model
const dialog = ref(props.modelValue);
const activeTab = ref(props.initialTab);

// Two-way binding for v-model
watch(dialog, (value) => {
  emit('update:modelValue', value);
});

watch(() => props.modelValue, (value) => {
  dialog.value = value;
});

watch(() => props.initialTab, (value) => {
  activeTab.value = value;
});

// Switch to login tab after successful registration
const switchToLogin = () => {
  activeTab.value = 'login';
};

// Handle successful login
const handleLoginSuccess = (userData) => {
  dialog.value = false;
  emit('login-success', userData);
};
</script>

<style scoped>
.v-card {
  margin-top: 0;
}
</style>