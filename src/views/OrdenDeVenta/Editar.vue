<template>
  <v-container>
    <v-row v-if="ordenDeVenta.orden">
      <v-col cols="12">
        <v-card class="elevation-10">
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
          <v-card-title>
            <v-row>
              <v-col cols="12" md="10">
                <h3 style="word-break: normal" class="text-center text-md-left">
                  Editar datos de la orden de venta
                </h3>
              </v-col>
              <v-col cols="12" md="2" class="text-center text-md-end">
                <v-btn
                  block
                  color="error"
                  :to="{ name: 'Listado de ordenes de trabajo' }"
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
        <v-card class="elevation-10">
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
            <v-row>
              <v-col cols="12" md="4">
                <v-select
                  v-model="ordenDeVenta.orden.cliente.id_tipo_de_cliente"
                  label="Tipo de cliente"
                  outlined
                  prepend-icon="mdi-briefcase-account"
                  :items="tiposDeCliente"
                  item-text="tipo_cliente"
                  item-value="id_tipo_de_cliente"
                  color="blue darken-4"
                  @change="obtenerClientes()"
                />
              </v-col>
              <v-col cols="12" md="8">
                <v-autocomplete
                  v-model="ordenDeVenta.orden.cliente.id_cliente"
                  :items="clientes"
                  item-text="datos_unidos"
                  item-value="id_cliente"
                  prepend-icon="mdi-card-account-details"
                  outlined
                  :loading="loading"
                  :disabled="inactivo"
                  label="Cliente"
                  hint="Seleccione al cliente"
                  persistent-hint
                  clearable
                />
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="ordenDeVenta.observaciones_orden_de_venta"
                  label="Descripcion del pedido"
                  outlined
                  prepend-icon="mdi-clipboard-list"
                  color="blue darken-4"
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-card class="elevation-10">
          <v-card-title>
            <v-container class="elevation-4">
              <v-row>
                <v-col cols="12">
                  <h4 class="text-center">Suministros</h4>
                </v-col>
              </v-row>
            </v-container>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <v-tabs v-model="tab" grow class="elevation-4 mb-3">
                  <v-tab href="#tab-1">
                    <v-icon>mdi-package-down</v-icon>
                    Suministros asignados
                  </v-tab>
                  <v-tab href="#tab-2">
                    <v-icon>mdi-package-up</v-icon>
                    Suministros no asignados
                  </v-tab>
                </v-tabs>
                <v-tabs-items v-model="tab">
                  <v-tab-item value="tab-1">
                    <suministros-asignados @establecer-suministros="establecerSuministros"/>
                  </v-tab-item>
                  <v-tab-item value="tab-2">
                    <suministros-no-asignados @establecer-suministros="establecerSuministros"/>
                  </v-tab-item>
                </v-tabs-items>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-card class="elevation-10">
          <v-card-title>
            <v-container class="elevation-4">
              <v-row>
                <v-col cols="12">
                  <h4 class="text-center">Confirmar precio</h4>
                </v-col>
              </v-row>
            </v-container>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="ordenDeVenta.orden.precio_total"
                  label="Precio total"
                  outlined
                  prepend-icon="mdi-cash-multiple"
                  color="blue darken-4"
                  suffix="Bs"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="ordenDeVenta.orden.monto_cancelado"
                  label="Monto cancelado"
                  outlined
                  prepend-icon="mdi-account-cash"
                  color="blue darken-4"
                  suffix="Bs"
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
              @click="modificarOrdenDeVenta()"
            >
              Modificar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-overlay :value="overlay" absolute dark opacity="0.8" color="#212121">
      <v-progress-circular indeterminate :size="90" :width="8">
        Cargando
      </v-progress-circular>
    </v-overlay>
    <v-snackbar v-model="alerta" :timeout="4000" color="success" app top right>
      <v-row align="center" justify="center">
        <v-col cols="2">
          <v-icon large color="white"> mdi-check-circle-outline </v-icon>
        </v-col>
        <v-col cols="10" align-self="center">
          <p class="text-center font-weight-black my-auto">
            {{ respuestaServidor }}
          </p>
        </v-col>
      </v-row>
    </v-snackbar>
  </v-container>
</template>

<script>
import SuministrosAsignados from '@/components/Orden/ModificarSuministros/SuministrosAsignados.vue'
import SuministrosNoAsignados from '@/components/Orden/ModificarSuministros/SuministrosNoAsignados.vue'

export default {
  name: 'ModificarOrdenDeVenta',
  components: {
    SuministrosAsignados,
    SuministrosNoAsignados
  },
  data: () => ({
    tab: null,
    overlay: true,
    loading: false,
    inactivo: true,
    botonCargando: false,
    respuestaServidor: null,
    alerta: false,
    clientes: [],
    errores: [],
    clienteSeleccionado: null,
    ordenDeVenta: [],
    suministros: [],
    tiposDeCliente: [],
    tipoDeClienteSeleccionado: null,
    subtotales: {},
    suministrosAsignados: [],
    nuevosSuministros: [],
    subtotalAsignados: 0,
    subtotalNuevos: 0
  }),
  created () {
    this.obtenerDatosOrdenDeVenta()
    this.obtenerTiposDeCliente()
  },
  methods: {
    calcularSubtotalNuevos (item) {
      const id = item.id_suministro
      if (item.cantidad) {
        item.subtotal = item.cantidad * item.precio_unitario_suministro
        this.subtotales[id] = item.subtotal
      } else {
        delete this.subtotales[id]
        delete item.cantidad
        delete item.subtotal
      }
      this.calcularTotal()
    },
    calcularSubtotal (item) {
      const id = item.id_suministro
      if (item.pivot.cantidad_prevista_suministro > 0) {
        item.subtotal = (
          item.pivot.cantidad_prevista_suministro *
          item.pivot.precio_unitario_suministro
        ).toFixed(2)
        this.subtotales[id] = item.subtotal
      } else {
        delete this.subtotales[id]
        delete item.cantidad
        delete item.subtotal
      }
      this.calcularTotal()
    },
    calcularTotal () {
      const total = Object.values(this.subtotales).reduce(
        (a, b) => parseFloat(a) + parseFloat(b),
        0
      )
      if (total > 0) {
        this.ordenDeVenta.orden.precio_total = total.toFixed(2)
      } else {
        this.ordenDeVenta.orden.precio_total = null
      }
    },
    obtenerTiposDeCliente () {
      this.$api({
        method: 'get',
        url: 'clientes/obtener-tipos-cliente',
        headers: { Authorization: 'Bearer ' + localStorage.token }
      }).then((response) => {
        this.tiposDeCliente = response.data.tiposDeCliente
        this.loadingSelect = false
      })
    },
    obtenerClientes () {
      this.clienteSeleccionado = null
      this.loading = true
      this.inactivo = true
      const tipoCliente =
        this.ordenDeVenta.orden.cliente.id_tipo_de_cliente === 1
          ? 'empresariales'
          : 'personales'
      this.$api({
        method: 'get',
        url: 'clientes/obtener-clientes-' + tipoCliente,
        headers: { Authorization: 'Bearer ' + localStorage.token }
      }).then((response) => {
        this.clientes = response.data.clientes
        this.loading = false
        this.inactivo = false
      })
    },
    obtenerDatosOrdenDeVenta () {
      this.$api({
        method: 'get',
        url:
          'ordenes-de-venta/editar-orden-de-venta/' +
          this.$route.params.idOrdenDeVenta +
          '/' +
          this.$route.params.tipoCliente,
        headers: { Authorization: 'Bearer ' + localStorage.token }
      }).then((response) => {
        this.ordenDeVenta = response.data.ordenDeVenta[0]
        this.suministros = response.data.suministros
        this.generarObjetoSubtotales()
        this.obtenerClientes()
        this.overlay = false
      })
    },
    generarObjetoSubtotales () {
      this.suministros.forEach((elemento) => {
        this.subtotales[elemento.id_suministro] = (
          elemento.precio_unitario_suministro *
          elemento.cantidad_prevista_suministro
        ).toFixed(2)
      })
    },
    modificarOrdenDeVenta () {
      this.botonCargando = true
      this.$api({
        method: 'put',
        url:
          'ordenes-de-trabajo/modificar-orden-de-trabajo/' +
          this.$route.params.idOrden,
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
        })
        .finally(() => {
          this.$store.commit('recargarDatos')
          this.alerta = true
        })
    },
    generarDatos () {
      const datos = {
        id_cliente: this.ordenDeVenta.orden.cliente.id_cliente,
        id_tipo_de_orden: 1,
        precio_total: this.ordenDeVenta.orden.precio_total,
        monto_cancelado: this.ordenDeVenta.orden.monto_cancelado,
        descripcion_orden_de_trabajo: this.ordenDeVenta.observaciones_orden_de_venta,
        suministros: [],
        cantidades: [],
        precios: []
      }

      this.suministros.forEach(function (item) {
        datos.suministros.push(item.id_suministro)
        datos.cantidades.push(parseInt(item.cantidad_prevista_suministro))
        datos.precios.push(item.precio_unitario_suministro)
      })

      return datos
    },
    establecerSuministros (suministros, subtotal, componente) {
      subtotal = parseFloat(subtotal)
      if (componente === 'Suministros asignados') {
        this.suministrosAsignados = suministros
        this.subtotalAsignados = subtotal
      }
      if (componente === 'Nuevos suministros') {
        this.nuevosSuministros = suministros
        this.subtotalNuevos = subtotal
      }
      if (this.ordenDeVenta.orden.precio_total === '0.00') {
        this.ordenDeVenta.orden.precio_total = null
      } else {
        this.ordenDeVenta.orden.precio_total = this.subtotalNuevos + this.subtotalAsignados
      }
      if (suministros.length > 0 && suministros.every(suministro => suministro.cantidad_prevista_suministro > 0)) {
        this.suministros = [...this.suministrosAsignados, ...this.nuevosSuministros]
      } else {
        this.suministros = []
      }
    }
  }
}
</script>
