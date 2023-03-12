import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import CoreuiVue from '@coreui/vue'
import CIcon from '@coreui/icons-vue'
import { iconsSet as icons } from '@/assets/icons'
import VCode from '@/components/VCode.vue'
import Action from '@/components/Action.vue'

import axios from 'axios'
import VueAxios from 'vue-axios'

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }

    return config
  },

  (error) => {
    return Promise.reject(error)
  },
)

const app = createApp(App)
app.use(store)
app.use(router)
app.use(CoreuiVue)

app.use(VueAxios, axios)
app.provide('axios', app.config.globalProperties.axios)

app.provide('icons', icons)
app.component('CIcon', CIcon)
app.component('VCode', VCode)
app.component('Action', Action)

app.mount('#app')
