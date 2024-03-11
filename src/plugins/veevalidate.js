import Vue from 'vue'
import { ValidationObserver, ValidationProvider, extend, localize } from 'vee-validate'

import * as rules from 'vee-validate/dist/rules'

function loadLocale (code) {
  return import(`vee-validate/dist/locale/${code}.json`).then(locale => {
    localize(code, locale)
  })
}
// Set default language
loadLocale('es')

// Install rules and localization
Object.keys(rules).forEach(rule => {
  extend(rule, rules[rule])
})

extend('seleccion', {
  validate: (value) => {
    if (Object.keys(value).length > 0) {
      return true
    }
    return 'Debe seleccionar un elemento'
  }
})

extend('seleccionMultiple', {
  validate: (value) => {
    if (value.length > 0) {
      return true
    }
    return 'Debe seleccionar al menos un elemento'
  }
})

// Install components globally
Vue.component('ValidationObserver', ValidationObserver)
Vue.component('ValidationProvider', ValidationProvider)
