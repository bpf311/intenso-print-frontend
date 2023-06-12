<template>
  <v-card elevation="5" class="rounded-lg">
    <v-card-subtitle>
      <v-container class="elevation-4">
        <v-row class="mt-2">
          <v-col cols="12" md="4">
            <v-select
              v-model="seleccionDeuda"
              outlined
              :items="deuda"
              item-text="estado"
              label="Estado de pagos"
              item-value="id"
              hint="Seleccione el estado de pagos"
              persistent-hint
              @change="recargarTabla()"
            />
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="12" md="5">
            <div class="elevation-4 me-4">
              <v-card-subtitle>
                <h3 class="black--text text-center">Deuda total:</h3>
                <h2 class="mt-2 black--text text-center">{{ deudaTotal }} Bs</h2>
              </v-card-subtitle>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-card-subtitle>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="ordenesDeTrabajo"
        :loading="loading"
        loading-text="Cargando"
        class="elevation-4"
        fixed-header
        height="240px"
      >
        <template v-slot:[`item.estado`]="{ item }">
          <v-chip
            :color="colorDeFondo(item.estado)"
            dark
          >
            {{ item.estado }}
          </v-chip>
        </template>
        <template v-slot:[`item.opciones`]="row">
          <div class="d-flex">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="info"
                  class="rounded-0"
                  small
                  dark
                  v-bind="attrs"
                  v-on="on"
                  :to="{
                    name: 'Datos de orden de trabajo',
                    params: {
                      idOrden: row.item['id_orden'],
                      idOrdenDeTrabajo: row.item['id_orden_de_trabajo'],
                      tipoCliente: row.item['id_tipo_de_cliente'],
                      vistaAnterior: 'Ordenes de cliente'
                    }
                  }"
                >
                  <v-icon>mdi-eye</v-icon>
                </v-btn>
              </template>
              <span>Ver datos</span>
            </v-tooltip>
            <v-tooltip bottom v-if="row.item['estado'] === 'Faltan pagos'">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="green"
                  class="rounded-0"
                  small
                  dark
                  v-bind="attrs"
                  v-on="on"
                  @click="abrirVentanaPago(row.item['id_orden'], row.item['saldo_restante'])"
                >
                  <v-icon>mdi-cash-register</v-icon>
                </v-btn>
              </template>
              <span>Registrar pago</span>
            </v-tooltip>
          </div>
        </template>
      </v-data-table>
    </v-card-text>
    <v-dialog
      v-model="ventanaPago"
      persistent
      width="500"
    >
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          Registrar pago
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="mt-5">
          <v-form>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <div class="elevation-4 mx-auto mb-5">
                    <v-card-subtitle>
                      <h3 class="black--text text-center">Saldo: {{ saldoRestante }} Bs</h3>
                    </v-card-subtitle>
                  </div>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="montoPagado"
                    label="Monto cancelado"
                    outlined
                    prepend-icon="mdi-account-cash"
                    color="blue darken-4"
                  />
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="error"
            @click="cerrarVentanaPago"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="green"
            class="white--text"
            :loading="botonCargando"
            @click="registrarPagoOrdenDeTrabajo"
          >
            Registrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
import ordenesDeTrabajoClienteHeaders from '@/commons/tableHeaders/ordenesDeTrabajoCliente'
export default {
  name: 'OrdenesDeTrabajo',
  data: () => ({
    headers: ordenesDeTrabajoClienteHeaders,
    ventanaModal: false,
    ventanaPago: false,
    mensaje: '',
    alerta: false,
    loading: true,
    ingreso: null,
    ordenesDeTrabajo: [],
    deudaTotal: null,
    montoPagado: null,
    idOrden: null,
    botonCargando: false,
    saldoRestante: null,
    respuestaServidor: null,
    seleccionDeuda: '0',
    deuda: [
      { id: '0', estado: 'Faltan pagos' },
      { id: '1', estado: 'Pagos completos' }
    ]
  }),
  created () {
    this.obtenerOrdenesDeCliente()
  },
  methods: {
    registrarPagoOrdenDeTrabajo () {
      const pagoCompleto = parseFloat(this.saldoRestante).toFixed(2) === parseFloat(this.montoPagado).toFixed(2) ? 1 : 0
      this.botonCargando = true
      this.$api({
        method: 'post',
        url: 'ordenes/registrar-pago-orden',
        headers: { Authorization: 'Bearer ' + localStorage.token },
        data: {
          id_orden: this.idOrden,
          id_cliente: this.$route.params.id,
          monto_cancelado: this.montoPagado,
          pago_completo: pagoCompleto
        }
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
          this.alerta = true
          this.cerrarVentanaPago()
          this.recargarTabla()
        })
    },
    abrirVentanaPago (id, saldo) {
      this.ventanaPago = true
      this.idOrden = id
      this.saldoRestante = saldo
    },
    cerrarVentanaPago () {
      this.ventanaPago = false
      this.idOrden = null
      this.montoPagado = null
      this.saldoRestante = null
    },
    obtenerOrdenesDeCliente () {
      this.$api({
        method: 'get',
        url: 'clientes/obtener-ordenes-cliente/' + this.$route.params.id + '/1/' + this.seleccionDeuda,
        headers: { Authorization: 'Bearer ' + localStorage.token }
      }).then((response) => {
        this.ordenesDeTrabajo = response.data.ordenesDelCliente
        this.deudaTotal = response.data.deudaTotal
        this.loading = false
        this.overlay = false
      })
    },
    colorDeFondo (estado) {
      if (estado === 'Pago completo') return 'green'
      else if (estado === 'Faltan pagos') return 'red accent-4'
    },
    abrirVentanaModal (datos) {
      this.ingreso = datos
      this.ventanaModal = true
    },
    cerrarVentanModal () {
      this.ventanaModal = false
      this.ingreso = null
    },
    recargarTabla () {
      this.ordenesDeTrabajo = []
      this.loading = true
      this.obtenerOrdenesDeCliente()
    }
  }
}
</script>
