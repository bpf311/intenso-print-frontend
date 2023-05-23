<template>
  <v-card elevation="5" class="rounded-lg">
    <v-card-title>
      <v-container class="elevation-4">
        <v-row>
          <v-col cols="12" lg="6">
            <h3 class="text-center text-md-left"> Editar datos del usuario </h3>
          </v-col>
        </v-row>
      </v-container>
    </v-card-title>
    <v-card-text>
      <v-form>
        <v-container>
          <v-alert
            v-if="errores.length !== 0"
            outlined
            prominent
            type="error"
            elevation="2"
            text
            class="mb-8"
          >
            Por favor, corrija el/los siguiente(s) error(es):
            <ul>
              <li v-for="(item, index) in errores" :key="index">
                {{ item[0] }}
              </li>
            </ul>
          </v-alert>
          <v-row>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="proveedor.razon_social_proveedor"
                label="Raón social"
                outlined
                prepend-icon="mdi-store"
                color="blue darken-4"
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="proveedor.nit_ci_proveedor"
                label="NIT"
                outlined
                prepend-icon="mdi-numeric"
                color="blue darken-4"
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="proveedor.telefono_proveedor"
                label="Telefono"
                outlined
                prepend-icon="mdi-phone"
                color="blue darken-4"
              />
            </v-col>
            <v-col cols="12" class="elevation-4 mb-5 text-center">
              <h2>Persona de contacto</h2>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="proveedor.persona_contacto"
                label="Nombre completo"
                outlined
                prepend-icon="mdi-account-circle"
                color="blue darken-4"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="proveedor.numero_persona_contacto"
                label="Telefono/celular"
                outlined
                prepend-icon="mdi-cellphone"
                color="blue darken-4"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-card-text>
    <v-card-actions class="mb-2 mr-2">
      <v-spacer />
      <v-btn color="error" class="ml-2" :to="{ name: 'Listado de proveedores' }">
        Atras
      </v-btn>
      <v-btn :loading="botonCargando" color="success" class="mr-0" @click="modificarProveedor()">
        Modificar
      </v-btn>
    </v-card-actions>
    <v-snackbar
      v-model="alerta"
      :timeout="4000"
      color="success"
      app
      top
      right
    >
      <v-row align="center" justify="center">
        <v-col cols="2">
          <v-icon
            large
            color="white"
          >
            mdi-check-circle-outline
          </v-icon>
        </v-col>
        <v-col cols="10" align-self="center">
          <p class="text-center font-weight-black my-auto">
            {{ respuestaServidor }}
          </p>
        </v-col>
      </v-row>
    </v-snackbar>
    <v-overlay :value="overlay" absolute dark opacity="0.8" color="#212121">
      <v-progress-circular indeterminate :size="90" :width="8">
        Cargando
      </v-progress-circular>
    </v-overlay>
  </v-card>
</template>

<script>
export default {
  name: 'EditarProvedor',
  data: () => ({
    botonCargando: false,
    respuestaServidor: null,
    alerta: false,
    overlay: true,
    roles: [],
    errores: [],
    proveedor: {}
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
          this.botonCargando = false
          this.errores = []
          this.respuestaServidor = response.data.mensaje
          this.alerta = true
          this.$store.commit('recargarDatos')
        })
        .catch((error) => {
          this.botonCargando = false
          this.errores = error.response.data.errors
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
    }
  }
}
</script>
