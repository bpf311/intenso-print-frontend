<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card class="elevation-10">
          <v-card-title>
            <v-row>
              <v-col cols="12" md="10">
                <h3 style="word-break: normal" class="text-center text-md-left">
                  Listado de ordenes de servicio
                </h3>
              </v-col>
              <v-col cols="12" md="2" class="text-center text-md-end">
                <v-btn
                  color="primary"
                  block
                  :to="{ name: 'Registrar orden de servicio' }"
                >
                  Registrar
                  <v-icon right>mdi-clipboard-plus-outline</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-card-title>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-card class="elevation-10">
          <v-card-text>
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
              <v-col cols="12" lg="2">
                <v-select
                  v-model="seleccionRangoDeFechas"
                  outlined
                  :items="rangoDeFechas"
                  item-text="rango"
                  label="Intervalo"
                  item-value="id"
                  hint="Seleccione el intervalo de fechas"
                  persistent-hint
                  @change="recargarTabla()"
                />
              </v-col>
              <v-col cols="12" lg="2">
                <v-menu
                  v-if="seleccionRangoDeFechas === 3"
                  v-model="menuUno"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="seleccionFechaInicio"
                      label="Fecha de inicio"
                      prepend-inner-icon="mdi-calendar"
                      readonly
                      outlined
                      hint="Seleccione la fecha de inicio"
                      persistent-hint
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="seleccionFechaInicio"
                    @input="menuUno = false"
                    @change="recargarTabla()"
                    :max="fechaActual"
                    first-day-of-week="1"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12" lg="2">
                <v-menu
                  v-if="seleccionRangoDeFechas === 3"
                  v-model="menuDos"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="seleccionFechaFin"
                      label="Fecha de fin"
                      prepend-inner-icon="mdi-calendar"
                      readonly
                      outlined
                      hint="Seleccione la fecha de fin"
                      persistent-hint
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="seleccionFechaFin"
                    @input="menuDos = false"
                    @change="recargarTabla()"
                    :min="seleccionFechaInicio"
                    :max="fechaActual"
                    first-day-of-week="1"
                  ></v-date-picker>
                </v-menu>
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
          </v-card-text>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="items"
              :search="busqueda"
              :loading="loading"
              loading-text="Cargando"
              fixed-header
              :height="dynamicTableHeight"
              :footer-props="{
                showCurrentPage: true,
                showFirstLastPage: true,
                firstIcon: 'mdi-arrow-collapse-left',
                lastIcon: 'mdi-arrow-collapse-right',
                prevIcon: 'mdi-minus',
                nextIcon: 'mdi-plus',
              }"
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
                          name: 'Datos de orden de servicio',
                          params: {
                            idOrden: row.item['id_orden'],
                            idOrdenDeServicio: row.item['id_orden_de_servicio'],
                            tipoCliente: row.item['id_tipo_de_cliente'],
                            vistaAnterior: 'Listado de ordenes de servicio',
                          },
                        }"
                      >
                        <v-icon>mdi-eye</v-icon>
                      </v-btn>
                    </template>
                    <span>Ver datos</span>
                  </v-tooltip>
                  <v-tooltip
                    v-if="row.item['estado_orden_de_servicio'] === 0"
                    bottom
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        color="secondary"
                        class="rounded-0"
                        small
                        dark
                        v-bind="attrs"
                        :to="{
                          name: 'Editar orden de servicio',
                          params: {
                            idOrden: row.item['id_orden'],
                            idOrdenDeServicio: row.item['id_orden_de_servicio'],
                            tipoCliente: row.item['id_tipo_de_cliente'],
                          },
                        }"
                        v-on="on"
                      >
                        <v-icon>mdi-pencil</v-icon>
                      </v-btn>
                    </template>
                    <span>Editar datos</span>
                  </v-tooltip>
                  <v-tooltip
                    v-if="row.item['estado_orden_de_servicio'] === 0"
                    bottom
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        color="red"
                        class="rounded-0"
                        small
                        dark
                        v-bind="attrs"
                        v-on="on"
                        @click="
                          abrirVentanaConfirmacion(
                            row.item['id_orden_de_servicio']
                          )
                        "
                      >
                        <v-icon>mdi-cube-send</v-icon>
                      </v-btn>
                    </template>
                    <span>Finalizar OV</span>
                  </v-tooltip>
                </div>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="ventanaConfirmacion" width="500" persistent>
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          Confirmar acción
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="mt-5">
          <p class="text-justify black--text">
            Si la Orden de Servicio se concluye, no se podrán efectuar cambios
            posteriores y los suministros asignados a esta orden se restarán del
            inventario. No obstante, aún podrá registrar pagos en caso de
            existir un saldo pendiente.
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
            @click="finalizarOrdenDeServicio"
          >
            Confirmar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
import ordenDeServicioHeaders from "@/commons/tableHeaders/ordenDeServicio";
import { tableMixin } from "@/commons/mixins/tableMixin";
import { DateTime } from "luxon";

export default {
  mixins: [tableMixin],
  name: "ListadoDeOrdenesDeServicio",
  data: () => ({
    ventanaConfirmacion: false,
    headers: ordenDeServicioHeaders,
    busqueda: null,
    items: [],
    botonCargando: false,
    respuestaServidor: null,
    loading: true,
    loadingSelect: true,
    seleccionEstado: 0,
    seleccionRangoDeFechas: 1,
    fechaActual: DateTime.now().toISODate(),
    seleccionFechaInicio: null,
    seleccionFechaFin: null,
    menuUno: false,
    menuDos: false,
    fechaInicio: null,
    fechaFin: null,
    rangoDeFechas: [
      { id: 1, rango: "Mes actual" },
      { id: 2, rango: "Mes anterior" },
      { id: 3, rango: "Intervalo personalizado" },
    ],
    roles: [],
    estados: [
      { id: 1, estado: "Finalizados" },
      { id: 0, estado: "Pendientes" },
    ],
    idOrden: null,
    dynamicTableHeight: 0,
    errores: null,
  }),
  activated() {
    if (this.$store.state.recargar) {
      this.recargarTabla();
      this.$store.commit("noRecargarDatos");
    }
  },
  created() {
    this.obtenerOrdenesDeServicio();
  },
  methods: {
    obtenerFechas() {
      const fechaActual = DateTime.now();

      const primerDiaMesAnterior = fechaActual
        .minus({ months: 1 })
        .startOf("month");
      const ultimoDiaMesAnterior = fechaActual
        .minus({ months: 1 })
        .endOf("month");

      const primerDiaMesActual = fechaActual.startOf("month");
      const ultimoDiaMesActual = fechaActual.endOf("month");

      if (this.seleccionRangoDeFechas === 1) {
        this.fechaInicio = primerDiaMesActual.toISODate();
        this.fechaFin = ultimoDiaMesActual.toISODate();
      } else if (this.seleccionRangoDeFechas === 2) {
        this.fechaInicio = primerDiaMesAnterior.toISODate();
        this.fechaFin = ultimoDiaMesAnterior.toISODate();
      } else if (this.seleccionRangoDeFechas === 3) {
        if (
          this.seleccionFechaInicio !== null &&
          this.seleccionFechaFin !== null
        ) {
          this.fechaInicio = this.seleccionFechaInicio;
          this.fechaFin = this.seleccionFechaFin;
        }
      }
    },
    abrirVentanaConfirmacion(id) {
      this.ventanaConfirmacion = true;
      this.idOrden = id;
    },
    cerrarVentanaConfirmacion() {
      this.ventanaConfirmacion = false;
      this.idOrden = null;
    },
    obtenerOrdenesDeServicio() {
      this.obtenerFechas();
      this.$api({
        method: "get",
        url:
          "ordenes-de-servicio/obtener-ordenes-de-servicio/" +
          this.seleccionEstado +
          "/" +
          this.fechaInicio +
          "/" +
          this.fechaFin,
        headers: { Authorization: "Bearer " + localStorage.token },
      }).then((response) => {
        const { ordenesDeServicio } = response.data;
        this.items = ordenesDeServicio;
        this.loading = false;
      });
    },
    finalizarOrdenDeServicio() {
      this.botonCargando = true;
      this.$api({
        method: "put",
        url: "ordenes-de-servicio/finalizar-orden-de-servicio/" + this.idOrden,
        headers: { Authorization: "Bearer " + localStorage.token },
      })
        .then((response) => {
          this.respuestaServidor = response.data.mensaje;
        })
        .catch((error) => {
          this.errores = error.response.data.message;
        })
        .finally(() => {
          this.botonCargando = false;
          this.cerrarVentanaConfirmacion();
        });
    },
    activarNotificacion() {
      if (Object.keys(this.errores).length > 0) {
        const mensaje = this.errores;
        this.$toast.error(mensaje);
      } else {
        this.$toast.success(this.respuestaServidor);
        this.recargarTabla();
      }
    },
    recargarTabla() {
      this.items = [];
      this.loading = true;
      this.busqueda = null;
      this.obtenerOrdenesDeServicio();
    },
  },
};
</script>
