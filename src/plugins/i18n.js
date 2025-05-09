import { createI18n } from 'vue-i18n'

// Import locale messages
import en from '../locales/en.json'
import zh from '../locales/zh.json'
// Add more imports for other languages as needed

export const i18n = createI18n({
  legacy: false, // Use Composition API
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    zh,
    // Add other languages here
  },
}) 