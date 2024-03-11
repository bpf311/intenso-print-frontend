<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card class="elevation-10">
          <v-card-title>
            <v-row>
              <v-col cols="12" md="10">
                <h3 style="word-break: normal" class="text-center text-md-left">
                  Registrar nuevo proveedor
                </h3>
              </v-col>
              <v-col cols="12" md="2" class="text-center text-md-end">
                <v-btn
                  block
                  color="error"
                  :to="{ name: 'Listado de proveedores' }"
                >
                  <v-icon left>mdi-arrow-left </v-icon>
                  Atras
                </v-btn>
              </v-col>
            </v-row>
          </v-card-title>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-card class="elevation-10">
          <ValidationObserver v-slot="{ handleSubmit }" ref="obs">
            <v-card-text>
              <v-alert
                v-if="validacionServidor"
                outlined
                prominent
                type="error"
                elevation="2"
                text
                class="mb-8"
              >
                Por favor, revise y corrija cualquier error identificado a continuación:
                <ul>
                  <li v-for="(item, index) in errores" :key="index">
                    {{ item[0] }}
                  </li>
                </ul>
              </v-alert>
              <v-row>
                <v-col cols="12" md="4">
                  <ValidationProvider name="Razón social" rules="required" v-slot="{ errors }">
                    <v-text-field
                      v-model="proveedor.razonSocial"
                      label="Razón social"
                      outlined
                      prepend-icon="mdi-store"
                      color="blue darken-4"
                      :error-messages="obtenerValidaciones(errors, 'razon_social_proveedor')"
                    />
                  </ValidationProvider>
                </v-col>
                <v-col cols="12" md="4">
                  <ValidationProvider name="NIT/CI" rules="required|numeric|min:6" v-slot="{ errors }">
                    <v-text-field
                      v-model="proveedor.nit"
                      label="NIT/CI"
                      outlined
                      prepend-icon="mdi-numeric"
                      color="blue darken-4"
                      :error-messages="obtenerValidaciones(errors, 'nit_ci_proveedor')"
                    />
                  </ValidationProvider>
                </v-col>
                <v-col cols="12" md="4">
                  <ValidationProvider name="Telefono" rules="required|numeric|min:6" v-slot="{ errors }">
                    <v-text-field
                      v-model="proveedor.telefono"
                      label="Telefono"
                      outlined
                      prepend-icon="mdi-phone"
                      color="blue darken-4"
                      :error-messages="obtenerValidaciones(errors, 'telefono_proveedor')"
                    />
                  </ValidationProvider>
                </v-col>
                <v-col cols="12" md="2">
                  <v-checkbox
                    v-model="checkbox"
                    label="Persona de contacto"
                  ></v-checkbox>
                </v-col>
                <v-col cols="12" md="5" v-if="checkbox">
                  <v-text-field
                    v-model="contacto.nombre"
                    label="Nombre completo"
                    outlined
                    prepend-icon="mdi-account-circle"
                    color="blue darken-4"
                  />
                </v-col>
                <v-col cols="12" md="5" v-if="checkbox">
                  <v-text-field
                    v-model="contacto.celular"
                    label="Telefono/celular"
                    outlined
                    prepend-icon="mdi-cellphone"
                    color="blue darken-4"
                  />
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions class="mb-2 mr-2">
              <v-spacer />
              <v-btn
                :loading="botonCargando"
                color="green"
                class="white--text"
                @click="handleSubmit(registrarProveedor)"
              >
                Registrar
              </v-btn>
            </v-card-actions>
          </ValidationObserver>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'CrearProveedor',
  data: () => ({
    checkbox: false,
    botonCargando: false,
    respuestaServidor: null,
    validacionServidor: false,
    roles: [],
    errores: {},
    proveedor: {
      razonSocial: null,
      nit: null,
      telefono: null
    },
    contacto: {
      nombre: null,
      celular: null
    }
  }),
  methods: {
    registrarProveedor () {
      this.botonCargando = true
      this.$api({
        method: 'post',
        url: 'proveedores/registrar-proveedor',
        headers: { Authorization: 'Bearer ' + localStorage.token },
        data: this.generarDatos()
      })
        .then((response) => {
          this.errores = []
          this.reiniciarDatos(this.proveedor)
          this.reiniciarDatos(this.contacto)
          this.respuestaServidor = response.data.mensaje
          this.$store.commit('recargarDatos')
        })
        .catch((error) => {
          this.validacionServidor = true
          this.errores = error.response.data.errors
        })
        .finally(() => {
          this.botonCargando = false
          this.checkbox = false
          this.activarNotificacion()
        })
    },
    generarDatos () {
      const datos = {
        razon_social_proveedor: this.proveedor.razonSocial,
        nit_ci_proveedor: this.proveedor.nit,
        telefono_proveedor: this.proveedor.telefono
      }

      if (this.checkbox) {
        datos.persona_contacto = this.contacto.nombre
        datos.numero_persona_contacto = this.contacto.celular
      }

      return datos
    },
    reiniciarDatos (obj) {
      for (const key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          this.reiniciarDatos(obj[key])
        } else {
          obj[key] = null
        }
      }
    },
    activarNotificacion () {
      if (Object.keys(this.errores).length > 0) {
        const mensaje = 'No se pudo completar la acción, por favor verifique los errores.'
        this.$toast.error(mensaje)
      } else {
        this.validacionServidor = false
        this.$refs.obs.reset()
        this.$toast.success(this.respuestaServidor)
      }
    },
    obtenerValidaciones (errors, field) {
      const veeErrors = errors || []
      const serverErrors = this.errores[field] || []
      return [...veeErrors, ...serverErrors]
    }
    // TODO: Implementar resetValidation para que se limpien los errores al corregirlos tanto del servidor como del cliente
    /* resetValidation (field) {
      console.log(this.errores.length)
      if (this.errores.length === 0) {
        this.validacionServidor = false
      }
      this.$refs[`${field}_Provider`].reset()
      delete this.errores[field]
    } */
  }
}
</script>
