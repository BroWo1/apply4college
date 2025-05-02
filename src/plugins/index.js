/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import vuetify from './vuetify'
import pinia from '@/stores'
import router from '@/router'

import { createVuetify } from 'vuetify'
import ApiPlugin from './api'

export function registerPlugins (app) {
  const vuetify = createVuetify(/* … your config */)
  app.use(vuetify)
  app.use(ApiPlugin)

  app
    .use(vuetify)
    .use(router)
    .use(pinia)
}
