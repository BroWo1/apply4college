/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import vuetify from './vuetify'
import pinia from '@/stores'
import router from '@/router'
import { i18n } from './i18n'

import ApiPlugin from './api'

export function registerPlugins (app) {
  app.use(ApiPlugin)

  app
    .use(vuetify)
    .use(router)
    .use(pinia)
    .use(i18n)
}
