<template>
  <v-card elevation="5" class="rounded-lg">
    <v-card-title>
      <v-container class="elevation-4">
        <v-row>
          <v-col cols="12" lg="6">
            <h3 style="word-break: normal" class="text-center text-md-left">
              Listado de ordenes de trabajo
            </h3>
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="12" lg="2">
            <v-btn
              color="primary"
              block
              :to="{ name: 'Registrar orden de trabajo' }"
            >
              Registrar
              <v-icon right> mdi-clipboard-plus-outline </v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card-title>
    <v-card-subtitle class="mt-2">
      <v-container class="elevation-4">
        <v-row>
          <v-col cols="12" lg="3">
            <v-select
              v-model="seleccionEstado"
              outlined
              :items="estados"
              item-text="estado"
              label="Estado"
              item-value="id"
              hint="Seleccione el estado"
              persistent-hint
              @change="recargarTabla()"
            />
          </v-col>
          <v-spacer />
          <v-col cols="12" lg="3">
            <v-text-field
              v-model="busqueda"
              append-icon="mdi-magnify"
              label="Busqueda"
              outlined
              hint="Realize una busqueda"
              persistent-hint
            ></v-text-field>
          </v-col>
        </v-row>
      </v-container>
    </v-card-subtitle>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="items"
        :search="busqueda"
        :loading="loading"
        loading-text="Cargando"
        class="elevation-4"
        fixed-header
        height="240px"
      >
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
                      vistaAnterior: 'Listado de ordenes de trabajo'
                    }
                  }"
                >
                  <v-icon>mdi-eye</v-icon>
                </v-btn>
              </template>
              <span>Ver datos</span>
            </v-tooltip>
            <v-tooltip v-if="row.item['estado_orden_de_trabajo'] === 0" bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="secondary"
                  class="rounded-0"
                  small
                  dark
                  v-bind="attrs"
                  :to="{
                    name: 'Editar orden de trabajo',
                    params: {
                      idOrden: row.item['id_orden'],
                      idOrdenDeTrabajo: row.item['id_orden_de_trabajo'],
                      tipoCliente: row.item['id_tipo_de_cliente']
                    }
                  }"
                  v-on="on"
                >
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </template>
              <span>Editar datos</span>
            </v-tooltip>
            <v-tooltip v-if="row.item['estado_orden_de_trabajo'] === 0" bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="red"
                  class="rounded-0"
                  small
                  dark
                  v-bind="attrs"
                  v-on="on"
                  @click="
                    abrirVentanaConfirmacion(row.item['id_orden_de_trabajo'])
                  "
                >
                  <v-icon>mdi-cube-send</v-icon>
                </v-btn>
              </template>
              <span>Finalizar OT</span>
            </v-tooltip>
          </div>
        </template>
      </v-data-table>
    </v-card-text>
    <v-dialog v-model="ventanaConfirmacion" width="500">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          Confirmar acción
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="mt-5">
          <p class="text-justify black--text">
            Si finaliza la Orden de Trabajo no podra realizar modificaciones
            posteriores y se descontara del inventario los suministros asignados
            a esta orden, sin embargo aun podra registrar pagos si es que existiera
            un saldo pendiente.
          </p>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="cerrarVentanaConfirmacion">
            Cancelar
          </v-btn>
          <v-btn
            color="green"
            class="white--text"
            :loading="botonCargando"
            @click="finalizarOrdenDeTrabajo"
          >
            Confirmar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
import ordenDeTrabajoHeaders from '@/commons/tableHeaders/ordenDeTrabajo'
export default {
  name: 'ListadoDeOrdenesDeTrabajo',
  data: () => ({
    ventanaConfirmacion: false,
    headers: ordenDeTrabajoHeaders,
    busqueda: null,
    items: [],
    botonCargando: false,
    respuestaServidor: null,
    alerta: false,
    loading: true,
    loadingSelect: true,
    seleccionEstado: { id: 0, estado: 'Pendientes' },
    roles: [],
    estados: [
      { id: 1, estado: 'Finalizados' },
      { id: 0, estado: 'Pendientes' }
    ],
    idSuministro: null
  }),
  activated () {
    if (this.seleccionEstado && this.$store.state.recargar) {
      this.recargarTabla()
      this.$store.commit('noRecargarDatos')
    }
  },
  created () {
    this.obtenerOrdenesDeTrabajo()
  },
  methods: {
    abrirVentanaConfirmacion (id) {
      this.ventanaConfirmacion = true
      this.idSuministro = id
    },
    cerrarVentanaConfirmacion () {
      this.ventanaConfirmacion = false
      this.idSuministro = null
    },
    obtenerOrdenesDeTrabajo () {
      this.$api({
        method: 'get',
        url:
          'ordenes-de-trabajo/obtener-ordenes-de-trabajo/' +
          this.seleccionEstado,
        headers: { Authorization: 'Bearer ' + localStorage.token }
      }).then((response) => {
        const { ordenesDeTrabajo } = response.data
        this.items = ordenesDeTrabajo
        this.loading = false
      })
    },
    finalizarOrdenDeTrabajo () {
      this.botonCargando = true
      this.$api({
        method: 'put',
        url:
          'ordenes-de-trabajo/finalizar-orden-de-trabajo/' + this.idSuministro,
        headers: { Authorization: 'Bearer ' + localStorage.token }
      })
        .then((response) => {
          this.respuestaServidor = response.data.mensaje
        })
        .finally(() => {
          this.botonCargando = false
          this.cerrarVentanaConfirmacion()
          this.alerta = true
          this.recargarTabla()
        })
    },
    recargarTabla () {
      this.items = []
      this.loading = true
      this.busqueda = null
      this.obtenerOrdenesDeTrabajo()
    }
  }
}
</script>
