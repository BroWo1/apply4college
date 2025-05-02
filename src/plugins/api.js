// src/plugins/api.js

import api from '@/api'

export default {
  install(app) {
    // for Options API:
    app.config.globalProperties.$api = api
    // for Composition API inject:
    app.provide('api', api)
  },

  mounted() {
    this.$api.get('schools/').then(/* … */)
  }
}
