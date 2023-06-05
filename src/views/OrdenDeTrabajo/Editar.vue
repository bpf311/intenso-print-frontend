<template>
  <v-card elevation="5" class="rounded-lg">
    <v-card-title>
      <v-container class="elevation-4">
        <v-row>
          <v-col cols="12" lg="6">
            <h3 style="word-break: normal" class="text-center text-md-left">
              Editar datos de la orden de trabajo
            </h3>
          </v-col>
        </v-row>
      </v-container>
    </v-card-title>
    <v-card-text v-if="ordenDeTrabajo.orden">
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
          <v-row class="elevation-4 my-4">
            <v-col cols="12" class="pa-4">
              <v-row>
                <v-col cols="12">
                  <v-container class="elevation-4">
                    <v-row>
                      <v-col cols="12">
                        <h3 class="text-center black--text">Datos generales</h3>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-col>
                <v-col cols="12" md="4">
                  <v-select
                    v-model="ordenDeTrabajo.orden.cliente.id_tipo_de_cliente"
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
                    v-model="ordenDeTrabajo.orden.cliente.id_cliente"
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
                    v-model="ordenDeTrabajo.descripcion_orden_de_trabajo"
                    label="Descripcion del pedido"
                    outlined
                    prepend-icon="mdi-clipboard-list"
                    color="blue darken-4"
                  />
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-row class="elevation-4 my-4">
            <v-col cols="12" class="pa-4">
              <v-row>
                <v-col cols="12">
                  <v-container class="elevation-4 mb-5">
                    <v-row>
                      <v-col cols="12">
                        <h3 class="text-center black--text">Suministros</h3>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-col>
                <v-col cols="12">
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-container class="elevation-4 mb-5">
                        <v-row>
                          <v-col cols="12">
                            <h3 class="text-center black--text">
                              Suministros asignados
                            </h3>
                          </v-col>
                        </v-row>
                      </v-container>
                      <v-data-table
                        :headers="headersAsignados"
                        :items="ordenDeTrabajo.orden.suministros"
                        item-key="id_suministro"
                        class="elevation-4"
                        hide-default-footer
                      >
                        <template
                          v-slot:[`item.pivot.precio_unitario_suministro`]="{
                            item,
                          }"
                        >
                          <v-text-field
                            v-model="item.pivot.precio_unitario_suministro"
                            outlined
                            dense
                            type="number"
                            class="my-text-field"
                            color="blue darken-4"
                            suffix="Bs"
                            @input="calcularSubtotal(item)"
                          />
                        </template>
                        <template
                          v-slot:[`item.pivot.cantidad_prevista_suministro`]="{
                            item,
                          }"
                        >
                          <v-text-field
                            v-model="item.pivot.cantidad_prevista_suministro"
                            outlined
                            dense
                            class="my-text-field"
                            type="number"
                            color="blue darken-4"
                            @input="calcularSubtotal(item)"
                          />
                        </template>
                        <template v-slot:[`item.subtotal`]="{ item }">
                          <p>
                            {{
                              (
                                item.pivot.precio_unitario_suministro *
                                item.pivot.cantidad_prevista_suministro
                              ).toFixed(2)
                            }}
                            Bs
                          </p>
                        </template>
                      </v-data-table>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-container class="elevation-4 mb-5">
                        <v-row>
                          <v-col cols="12">
                            <h3 class="text-center black--text">
                              Suministros no asignados
                            </h3>
                          </v-col>
                        </v-row>
                      </v-container>
                      <v-data-table
                        :headers="headersNoAsignados"
                        :items="suministros"
                        hide-default-footer
                        item-key="id_suministro"
                        class="elevation-4"
                      >
                        <template
                          v-slot:[`item.precio_unitario_suministro`]="{ item }"
                        >
                          <v-text-field
                            v-model="item.precio_unitario_suministro"
                            outlined
                            dense
                            class="my-text-field"
                            color="blue darken-4"
                            type="number"
                            suffix="Bs"
                            @input="calcularSubtotalNuevos(item)"
                          />
                        </template>
                        <template v-slot:[`item.cantidad`]="{ item }">
                          <v-text-field
                            v-model="item.cantidad"
                            outlined
                            dense
                            class="my-text-field"
                            color="blue darken-4"
                            type="number"
                            @input="calcularSubtotalNuevos(item)"
                          />
                        </template>
                        <template v-slot:[`item.subtotal`]="{ item }">
                          <p v-if="item.cantidad">
                            {{
                              (
                                item.precio_unitario_suministro * item.cantidad
                              ).toFixed(2)
                            }}
                            Bs
                          </p>
                        </template>
                      </v-data-table>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-row class="elevation-4 my-4">
            <v-col cols="12" class="pa-4">
              <v-row>
                <v-col cols="12">
                  <v-container class="elevation-4 mb-5">
                    <v-row>
                      <v-col cols="12">
                        <h3 class="text-center black--text">
                          Confirmar precio
                        </h3>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="ordenDeTrabajo.orden.precio_total"
                    label="Precio total"
                    outlined
                    prepend-icon="mdi-cash-multiple"
                    color="blue darken-4"
                    suffix="Bs"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="ordenDeTrabajo.orden.monto_cancelado"
                    label="Monto cancelado"
                    outlined
                    prepend-icon="mdi-account-cash"
                    color="blue darken-4"
                    suffix="Bs"
                  />
                </v-col>
              </v-row>
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
        :to="{ name: 'Listado de ordenes de trabajo' }"
      >
        Atras
      </v-btn>
      <v-btn
        :loading="botonCargando"
        color="green"
        class="white--text"
        @click="modificarOrdenDeTrabajo()"
      >
        Modificar
      </v-btn>
    </v-card-actions>
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
  </v-card>
</template>

<script>
export default {
  name: 'CrearOrdenDeTrabajo',
  data: () => ({
    headersAsignados: [
      {
        text: 'Suministro',
        value: 'descripcion_suministro',
        sortable: false
      },
      {
        text: 'Precio unitario',
        value: 'pivot.precio_unitario_suministro',
        width: '32%',
        sortable: false
      },
      {
        text: 'Cantidad',
        value: 'pivot.cantidad_prevista_suministro',
        width: '22%',
        sortable: false
      },
      {
        text: 'Subtotal',
        value: 'subtotal',
        sortable: false,
        width: '25%'
      }
    ],
    headersNoAsignados: [
      {
        text: 'Suministro',
        value: 'descripcion_suministro',
        sortable: false
      },
      {
        text: 'Precio unitario',
        value: 'precio_unitario_suministro',
        width: '32%',
        sortable: false
      },
      {
        text: 'Cantidad',
        value: 'cantidad',
        width: '22%',
        sortable: false
      },
      {
        text: 'Subtotal',
        value: 'subtotal',
        sortable: false,
        width: '25%'
      }
    ],
    overlay: true,
    loading: false,
    inactivo: true,
    botonCargando: false,
    respuestaServidor: null,
    alerta: false,
    clientes: [],
    errores: [],
    clienteSeleccionado: null,
    ordenDeTrabajo: [],
    suministros: [],
    tiposDeCliente: [],
    tipoDeClienteSeleccionado: null,
    subtotales: {}
  }),
  created () {
    this.obtenerDatosOrdenDeTrabajo()
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
        this.ordenDeTrabajo.orden.precio_total = total.toFixed(2)
      } else {
        this.ordenDeTrabajo.orden.precio_total = null
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
        this.ordenDeTrabajo.orden.cliente.id_tipo_de_cliente === 1
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
    obtenerDatosOrdenDeTrabajo () {
      this.$api({
        method: 'get',
        url:
          'ordenes-de-trabajo/editar-orden-de-trabajo/' +
          this.$route.params.idOrdenDeTrabajo +
          '/' +
          this.$route.params.tipoCliente,
        headers: { Authorization: 'Bearer ' + localStorage.token }
      }).then((response) => {
        this.ordenDeTrabajo = response.data.ordenDeTrabajo[0]
        this.suministros = response.data.suministros
        this.generarObjetoSubtotales()
        this.obtenerClientes()
        this.overlay = false
      })
    },
    generarObjetoSubtotales () {
      this.ordenDeTrabajo.orden.suministros.forEach((elemento) => {
        this.subtotales[elemento.pivot.id_suministro] = (
          elemento.pivot.precio_unitario_suministro *
          elemento.pivot.cantidad_prevista_suministro
        ).toFixed(2)
      })
    },
    modificarOrdenDeTrabajo () {
      console.log(this.generarDatos())
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
      const cantidadesRegistradas = []
      const preciosUnitariosRegistrados = []
      const suministrosRegistrados = []
      const suministros = []
      const cantidades = []
      const preciosUnitarios = []

      const datos = {
        id_cliente: this.ordenDeTrabajo.orden.cliente.id_cliente,
        id_tipo_de_orden: 1,
        precio_total: this.ordenDeTrabajo.orden.precio_total,
        monto_cancelado: this.ordenDeTrabajo.orden.monto_cancelado,
        descripcion_orden_de_trabajo:
          this.ordenDeTrabajo.descripcion_orden_de_trabajo
      }

      this.ordenDeTrabajo.orden.suministros.forEach(function (item) {
        if (
          item.pivot.cantidad_prevista_suministro &&
          item.pivot.cantidad_prevista_suministro > 0
        ) {
          suministrosRegistrados.push(item.id_suministro)
          cantidadesRegistradas.push(item.pivot.cantidad_prevista_suministro)
          preciosUnitariosRegistrados.push(
            item.pivot.precio_unitario_suministro
          )
        }
      })

      this.suministros.forEach(function (item) {
        if (item.cantidad && item.cantidad > 0) {
          suministros.push(item.id_suministro)
          cantidades.push(parseInt(item.cantidad))
          preciosUnitarios.push(item.precio_unitario_suministro)
        }
      })

      if (
        suministros.length > 0 &&
        cantidades.length > 0 &&
        preciosUnitarios.length > 0
      ) {
        datos.suministros = suministrosRegistrados.concat(suministros)
        datos.cantidades = cantidadesRegistradas.concat(cantidades)
        datos.precios = preciosUnitariosRegistrados.concat(preciosUnitarios)
      } else {
        datos.suministros = suministrosRegistrados
        datos.cantidades = cantidadesRegistradas
        datos.precios = preciosUnitariosRegistrados
      }

      return datos
    }
  }
}
</script>
