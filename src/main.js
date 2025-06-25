/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'
import { i18n } from '@/plugins/i18n'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

// Styles
import 'unfonts.css'
import '@/styles/global.css'

const app = createApp(App)

// Set language from localStorage before mounting
const savedLang = localStorage.getItem('app_language')
if (savedLang && savedLang !== i18n.global.locale.value) {
  i18n.global.locale.value = savedLang
}

registerPlugins(app)

app.mount('#app')

