<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card class="elevation-10">
          <v-card-title>
            <v-row>
              <v-col cols="12" md="10">
                <h3 style="word-break: normal" class="text-center text-md-left">
                  Editar datos del proveedor
                </h3>
              </v-col>
              <v-col cols="12" md="2" class="text-center text-md-end">
                <v-btn
                  block
                  color="error"
                  :to="{ name: 'Listado de proveedores' }"
                >
                  <v-icon left>mdi-arrow-left</v-icon>
                  Atras
                </v-btn>
              </v-col>
            </v-row>
          </v-card-title>
        </v-card>
      </v-col>
      <v-col cols="12">
        <ValidationObserver v-slot="{ handleSubmit }" ref="obs">
          <v-row>
            <v-col cols="12" md="6">
              <v-card class="fill-height elevation-10">
                <v-card-title>
                  <v-container class="elevation-4">
                    <v-row>
                      <v-col cols="12">
                        <h4 class="text-center">Datos generales</h4>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-title>
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
                    Por favor, corrija los siguientes errores
                    <ul>
                      <li v-for="(item, index) in errores" :key="index">
                        {{ item[0] }}
                      </li>
                    </ul>
                  </v-alert>
                  <v-row>
                    <v-col cols="12">
                      <ValidationProvider name="Razón social" rules="required" v-slot="{ errors }">
                        <v-text-field
                          v-model="proveedor.razon_social_proveedor"
                          label="Raón social"
                          outlined
                          prepend-icon="mdi-store"
                          color="blue darken-4"
                          :error-messages="obtenerValidaciones(errors, 'razon_social_proveedor')"
                        />
                      </ValidationProvider>
                    </v-col>
                    <v-col cols="12">
                      <ValidationProvider name="NIT/CI" rules="required|numeric|min:6" v-slot="{ errors }">
                        <v-text-field
                          v-model="proveedor.nit_ci_proveedor"
                          label="NIT"
                          outlined
                          prepend-icon="mdi-numeric"
                          color="blue darken-4"
                          :error-messages="obtenerValidaciones(errors, 'nit_ci_proveedor')"
                        />
                      </ValidationProvider>
                    </v-col>
                    <v-col cols="12">
                      <ValidationProvider name="Telefono" rules="required|numeric|min:6" v-slot="{ errors }">
                        <v-text-field
                          v-model="proveedor.telefono_proveedor"
                          label="Telefono"
                          outlined
                          prepend-icon="mdi-phone"
                          color="blue darken-4"
                          :error-messages="obtenerValidaciones(errors, 'telefono_proveedor')"
                        />
                      </ValidationProvider>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" md="6">
              <v-card class="fill-height elevation-10">
                <v-card-title>
                  <v-container class="elevation-4">
                    <v-row>
                      <v-col cols="12">
                        <h4 class="text-center">Persona de contacto</h4>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model="proveedor.persona_contacto"
                        label="Nombre completo"
                        outlined
                        prepend-icon="mdi-account-circle"
                        color="blue darken-4"
                      />
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="proveedor.numero_persona_contacto"
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
                    @click="handleSubmit(modificarProveedor)"
                  >
                    Modificar
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </ValidationObserver>
      </v-col>
    </v-row>
    <v-overlay :value="overlay" absolute dark opacity="0.8" color="#212121">
      <v-progress-circular indeterminate :size="90" :width="8">
        Cargando
      </v-progress-circular>
    </v-overlay>
  </v-container>
</template>

<script>
export default {
  name: 'EditarProvedor',
  data: () => ({
    botonCargando: false,
    respuestaServidor: null,
    overlay: true,
    roles: [],
    errores: {},
    proveedor: {},
    validacionServidor: false
  }),
  created () {
    this.obtenerProveedor()
  },
  methods: {
    modificarProveedor () {
      this.botonCargando = true
      this.$api({
        method: 'put',
        url: 'proveedores/modificar-proveedor/' + this.$route.params.id,
        headers: { Authorization: 'Bearer ' + localStorage.token },
        data: this.generarDatos()
      })
        .then((response) => {
          this.errores = []
          this.respuestaServidor = response.data.mensaje
          this.$store.commit('recargarDatos')
        })
        .catch((error) => {
          this.validacionServidor = true
          this.errores = error.response.data.errors
        }).finally(() => {
          this.botonCargando = false
          this.activarNotificacion()
        })
    },
    obtenerProveedor () {
      this.$api({
        method: 'get',
        url: 'proveedores/editar-proveedor/' + this.$route.params.id,
        headers: { Authorization: 'Bearer ' + localStorage.token }
      }).then((response) => {
        this.proveedor = response.data.proveedor
        this.overlay = false
      })
    },
    generarDatos () {
      return {
        razon_social_proveedor: this.proveedor.razon_social_proveedor,
        nit_ci_proveedor: this.proveedor.nit_ci_proveedor,
        telefono_proveedor: this.proveedor.telefono_proveedor,
        persona_contacto: this.proveedor.persona_contacto,
        numero_persona_contacto: this.proveedor.numero_persona_contacto
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
  }
}
</script>
