<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card class="elevation-10">
          <v-card-title>
            <v-row>
              <v-col cols="12" md="10">
                <h3 style="word-break: normal" class="text-center text-md-left">
                  Listado de clientes
                </h3>
              </v-col>
              <v-col cols="12" md="2" class="text-center text-md-end">
                <v-btn
                  v-if="tienePermiso(23)"
                  color="primary"
                  block
                  :to="{ name: 'Registrar cliente' }"
                >
                  Registrar
                  <v-icon right>mdi-account-plus</v-icon>
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
                  v-model="selecciontipoCliente"
                  outlined
                  :items="tiposDeCliente"
                  :loading="loadingSelect"
                  item-text="tipo_cliente"
                  item-value="id_tipo_de_cliente"
                  label="Tipo de cliente"
                  hint="Seleccione el tipo de cliente"
                  persistent-hint
                  @change="recargarTabla()"
                />
              </v-col>
              <v-spacer />
              <v-col cols="12" lg="3">
                <v-text-field
                  v-if="selecciontipoCliente"
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
              v-if="selecciontipoCliente"
              :headers="headers"
              :search="busqueda"
              :items="items"
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
              <template v-slot:item.opciones="row">
                <div class="d-flex">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        v-if="tienePermiso(24)"
                        color="secondary"
                        class="rounded-0"
                        small
                        dark
                        v-bind="attrs"
                        :to="{
                          name: 'Editar cliente',
                          params: {
                            id: row.item['id_cliente'],
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
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        v-if="tienePermiso(25)"
                        color="green"
                        class="rounded-0"
                        small
                        dark
                        v-bind="attrs"
                        :to="{
                          name: 'Ordenes de cliente',
                          params: {
                            id: row.item['id_cliente'],
                          },
                        }"
                        v-on="on"
                      >
                        <v-icon>mdi-list-box-outline</v-icon>
                      </v-btn>
                    </template>
                    <span>Ordenes</span>
                  </v-tooltip>
                </div>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import clienteEmpresarialHeaders from "../../commons/tableHeaders/clienteEmpresarial";
import clientePersonalHeaders from "../../commons/tableHeaders/clientePersonal";
import { tableMixin } from "@/commons/mixins/tableMixin";
export default {
  mixins: [tableMixin],
  name: "ListadoDeClientes",
  data: () => ({
    loadingSelect: true,
    busqueda: null,
    headers: [],
    headerClientePersonal: clientePersonalHeaders,
    headerClienteEmpresarial: clienteEmpresarialHeaders,
    items: [],
    alerta: false,
    loading: true,
    selecciontipoCliente: null,
    tiposDeCliente: [],
  }),
  activated() {
    if (this.selecciontipoCliente && this.$store.state.recargar) {
      this.recargarTabla();
      this.$store.commit("noRecargarDatos");
    }
  },
  created() {
    this.obtenerTiposDeCliente();
  },
  computed: {
    tienePermiso() {
      return this.$store.getters.tienePermiso;
    },
  },
  methods: {
    obtenerTiposDeCliente() {
      this.$api({
        method: "get",
        url: "clientes/obtener-tipos-cliente",
        headers: { Authorization: "Bearer " + localStorage.token },
      }).then((response) => {
        this.tiposDeCliente = response.data.tiposDeCliente;
        this.loadingSelect = false;
      });
    },
    obtenerClientes() {
      this.$api({
        method: "get",
        url: "clientes/obtener-clientes/" + this.selecciontipoCliente,
        headers: { Authorization: "Bearer " + localStorage.token },
      }).then((response) => {
        this.items = response.data.clientes;
        this.loading = false;
      });
    },
    recargarTabla() {
      this.loading = true;
      this.headers =
        this.selecciontipoCliente === 1
          ? this.headerClienteEmpresarial
          : this.headerClientePersonal;
      this.items = [];
      this.busqueda = null;
      this.obtenerClientes();
    },
  },
};
</script>
