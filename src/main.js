import Vue from 'vue'
import App from './App.vue'
import router from './router'
import StoreData from './store'
import vuetify from './plugins/vuetify'
import api from './services/api.config'
import Vuex from 'vuex'
import { validarRutas } from './middlewares/validarRutas'

Vue.config.productionTip = false

Vue.use(api)
Vue.use(Vuex)

const store = new Vuex.Store(StoreData)

validarRutas(store, router)

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App)
}).$mount('#app')
