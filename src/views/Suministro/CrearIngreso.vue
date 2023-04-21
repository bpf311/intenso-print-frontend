<template>
  <v-card elevation="5" class="rounded-lg">
    <v-card-title>
      <v-container class="elevation-4">
        <v-row>
          <v-col cols="12" lg="6">
            <h3 class="text-center text-md-left"> Registrar ingreso de suministro </h3>
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
            <v-col cols="12" md="6">
              <v-select
                v-model="ingreso.tipoDocumento"
                label="Tipo de documento"
                outlined
                prepend-icon="mdi-office-building"
                :items="tiposDeDocumentos"
                item-text="tipo_de_documento"
                item-value="id_tipo_de_documento"
                color="blue darken-4"
                :loading="loadingSelect"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="ingreso.numeroDocumento"
                label="Numero del documento"
                outlined
                prepend-icon="mdi-package-variant-closed-plus"
                color="blue darken-4"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="ingreso.proveedor"
                label="Proveedor"
                outlined
                prepend-icon="mdi-office-building"
                :items="proveedores"
                item-text="razon_social_proveedor"
                item-value="id_proveedor"
                color="blue darken-4"
                :loading="loadingSelect"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="ingreso.cantidad"
                label="Cantidad de suministro a ingresar"
                outlined
                prepend-icon="mdi-package-variant-closed-plus"
                color="blue darken-4"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-card-text>
    <v-card-actions class="mb-2 mr-2">
      <v-spacer />
      <v-btn
        color="error"
        class="ml-2"
        :to="{ name: 'Listado de suministros' }"
      >
        Atras
      </v-btn>
      <v-btn
        color="green"
        class="white--text"
        :loading="botonCargando"
        @click="registrarIngresoSuministro()"
      >
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
import suministro from '../../commons/tableHeaders/suministro'

export default {
  name: 'CrearIngresoSuministro',
  data: () => ({
    respuestaServidor: null,
    alerta: false,
    botonCargando: false,
    loadingSelect: true,
    proveedores: [],
    tiposDeDocumentos: [],
    errores: [],
    ingreso: {
      suministro: null,
      proveedor: null,
      tipoDocumento: null,
      numeroDocumento: null,
      cantidad: null
    }
  }),
  created () {
    this.obtenerProveedores()
    this.obtenerTiposDeDocumentos()
  },
  methods: {
    suministro () {
      return suministro
    },
    obtenerProveedores () {
      this.$api({
        method: 'get',
        url: 'proveedores/obtener-proveedores',
        headers: { Authorization: 'Bearer ' + localStorage.token }
      }).then((response) => {
        this.proveedores = response.data.proveedores
        this.loadingSelect = false
      })
    },
    obtenerTiposDeDocumentos () {
      this.$api({
        method: 'get',
        url: 'tipos-de-documentos/obtener-tipos-de-documentos',
        headers: { Authorization: 'Bearer ' + localStorage.token }
      }).then((response) => {
        this.tiposDeDocumentos = response.data.tiposDeDocumentos
        this.loadingSelect = false
      })
    },
    registrarIngresoSuministro () {
      this.botonCargando = true
      this.$api({
        method: 'post',
        url: 'ingresos-de-suministros/registrar-ingreso-de-suministro',
        headers: { Authorization: 'Bearer ' + localStorage.token },
        data: this.generarDatos()
      })
        .then((response) => {
          this.botonCargando = false
          this.errores = []
          this.respuestaServidor = response.data.mensaje
        })
        .catch((error) => {
          this.errores = error.response.data.errors
          this.botonCargando = false
        }).finally(() => {
          this.reiniciarDatos(this.ingreso)
          this.alerta = true
          this.$store.commit('recargarDatos')
        })
    },
    generarDatos () {
      return {
        id_suministro: this.$route.params.id,
        id_proveedor: this.ingreso.proveedor,
        id_tipo_de_documento: this.ingreso.tipoDocumento,
        numero_documento: this.ingreso.numeroDocumento,
        cantidad_ingreso: this.ingreso.cantidad
      }
    },
    reiniciarDatos (obj) {
      for (const key in obj) {
        if (key === 'proveedor') {
          obj[key] = {}
        }
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
