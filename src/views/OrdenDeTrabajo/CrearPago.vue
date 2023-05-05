<template>
  <v-card elevation="5" class="rounded-lg">
    <v-card-title>
      <v-container class="elevation-4">
        <v-row>
          <v-col cols="12" lg="6">
            <h3 class="text-center text-md-left"> Registrar pago de orden de trabajo </h3>
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
            <v-col cols="12" md="3">
              <v-text-field
                v-model="pago.montoCancelado"
                label="Monto pagado"
                outlined
                prepend-icon="mdi-account-cash"
                color="blue darken-4"
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-data-table
                :headers="headers"
                :items="historialPagos"
                :loading="loading"
                loading-text="Cargando"
                class="elevation-4"
                fixed-header
                height="240px"
              />
            </v-col>
            <v-col>
              <div class="elevation-4 me-4">
                <v-card-subtitle>
                  <h3 class="black--text text-center">Monto actual cancelado: {{ total }} Bs</h3>
                </v-card-subtitle>
              </div>
            </v-col>
            <v-col>
              <div class="elevation-4 me-4">
                <v-card-subtitle>
                  <h3 class="black--text text-center">Monto restante: {{ deudaTotal }} Bs</h3>
                </v-card-subtitle>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-card-text>
    <v-card-actions class="mb-2 mr-2">
      <v-spacer />
      <v-btn color="error" class="ml-2" :to="{ name: 'Listado de ordenes de trabajo' }">
        Atras
      </v-btn>
      <v-btn :loading="botonCargando" color="green" class="white--text" @click="registrarPagoOrdenDeTrabajo()">
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
import pagosOrden from '@/commons/tableHeaders/pagosOrden'
export default {
  name: 'CrearPagoOrdenDeTrabajo',
  data: () => ({
    headers: pagosOrden,
    loading: false,
    inactivo: true,
    botonCargando: false,
    respuestaServidor: null,
    alerta: false,
    clientes: [],
    errores: [],
    clienteSeleccionado: null,
    pago: {
      montoCancelado: null
    },
    suministros: [],
    tiposDeCliente: [
      { id: 'empresariales', text: 'Empresarial' },
      { id: 'personales', text: 'Personal' }
    ],
    tipoDeClienteSeleccionado: null,
    historialPagos: [],
    total: null,
    deudaTotal: null
  }),
  created () {
    this.obtenerHistorialDePagos()
  },
  methods: {
    obtenerHistorialDePagos () {
      this.loading = true
      this.inactivo = true
      this.$api({
        method: 'get',
        url: 'ordenes/obtener-pagos-orden/' + this.$route.params.idOrden,
        headers: { Authorization: 'Bearer ' + localStorage.token }
      }).then((response) => {
        this.historialPagos = response.data.pagos
        this.total = response.data.total
        this.deudaTotal = response.data.faltante
        this.loading = false
        this.inactivo = false
      })
    },
    registrarPagoOrdenDeTrabajo () {
      this.botonCargando = true
      this.$api({
        method: 'post',
        url: 'ordenes/registrar-pago-orden',
        headers: { Authorization: 'Bearer ' + localStorage.token },
        data: this.generarDatos()
      })
        .then((response) => {
          this.botonCargando = false
          this.errores = []
          this.respuestaServidor = response.data.mensaje
        })
        .catch((error) => {
          this.botonCargando = false
          this.errores = error.response.data.errors
        }).finally(() => {
          this.$store.commit('recargarDatos')
          this.reiniciarDatos(this.pago)
          this.obtenerHistorialDePagos()
          this.alerta = true
        })
    },
    generarDatos () {
      return {
        id_orden: this.$route.params.idOrden,
        monto_cancelado: this.pago.montoCancelado,
        faltan_cuotas: 1
      }
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
