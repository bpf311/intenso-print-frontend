import axios from 'axios'
import Vue from 'vue'
import router from '@/router'

const desarrollo = iniciarAPI('http://127.0.0.1:8000/api/')
// const produccion = iniciarAPI('https://intenso-print-backend-production.up.railway.app/api/')

function iniciarAPI (baseURL) {
  const instance = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json'
    }
  })

  // Interceptor para manejar errores de respuesta
  instance.interceptors.response.use(
    response => response,
    error => {
      if (error.response && error.response.status === 403 && error.response.data.motivo === 'inactivo') {
        router.replace({ name: 'Cuenta desactivada' })
        Vue.$toast.error(error.response.data.mensaje)
      }
      if (error.response.status === 500) {
        Vue.$toast.error('Ocurrio un error interno en el servidor, por favor intente más tarde')
      }
      return Promise.reject(error)
    }
  )

  return instance
}

export default {
  install () {
    Vue.prototype.$api = desarrollo
    // Vue.prototype.$api = produccion
  }
}
