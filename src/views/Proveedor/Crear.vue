<template>
  <v-card elevation="5" class="rounded-lg">
    <v-card-title>
      <v-container class="elevation-4">
        <v-row>
          <v-col cols="12" lg="6">
            <h3 style="word-break: normal" class="text-center text-md-left"> Registrar nuevo proveedor </h3>
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
            Por favor, corrija los siguientes errores
            <ul>
              <li v-for="(item, index) in errores" :key="index">
                {{ item[0] }}
              </li>
            </ul>
          </v-alert>
          <v-row>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="proveedor.razonSocial"
                label="Razón social"
                outlined
                prepend-icon="mdi-store"
                color="blue darken-4"
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="proveedor.nit"
                label="NIT"
                outlined
                prepend-icon="mdi-numeric"
                color="blue darken-4"
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="proveedor.telefono"
                label="Telefono"
                outlined
                prepend-icon="mdi-phone"
                color="blue darken-4"
              />
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
        </v-container>
      </v-form>
    </v-card-text>
    <v-card-actions class="mb-2 mr-2">
      <v-spacer />
      <v-btn color="error" class="ml-2" :to="{ name: 'Listado de proveedores' }">
        Atras
      </v-btn>
      <v-btn :loading="botonCargando" color="green" class="white--text" @click="registrarProveedor()">
        Registrar
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
  </v-card>
</template>

<script>
export default {
  name: 'CrearProveedor',
  data: () => ({
    checkbox: false,
    botonCargando: false,
    respuestaServidor: null,
    alerta: false,
    roles: [],
    errores: [],
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
          this.botonCargando = false
          this.errores = []
          this.reiniciarDatos(this.proveedor)
          this.reiniciarDatos(this.contacto)
          this.respuestaServidor = response.data.mensaje
          this.alerta = true
          this.$store.commit('recargarDatos')
        })
        .catch((error) => {
          this.botonCargando = false
          this.errores = error.response.data.errors
        })
        .finally(() => {
          this.checkbox = false
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
    }
  }
}
</script>
