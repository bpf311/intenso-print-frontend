import axios from 'axios'
import Vue from 'vue'

const desarrollo = iniciarAPI('http://127.0.0.1:8000/api/')
// const produccion = iniciarAPI('http://localhost:3000')

function iniciarAPI (baseURL) {
  return axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export default {
  install () {
    Vue.prototype.$api = desarrollo
  }
}
