<template>
  <v-card elevation="5" class="rounded-lg">
    <v-card-title>
      <v-container class="elevation-4">
        <v-row>
          <v-col cols="12" lg="6">
            <h3 style="word-break: normal" class="text-center text-md-left"> Listado de clientes </h3>
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="12" lg="2">
            <v-btn color="primary" block :to="{ name: 'Registrar cliente' }">
              Registrar
              <v-icon
                right
              >
                mdi-account-plus
              </v-icon>
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
      </v-container>
    </v-card-subtitle>
    <v-card-text>
      <v-data-table
        v-if="selecciontipoCliente"
        :headers="headers"
        :search="busqueda"
        :items="items"
        :loading="loading"
        loading-text="Cargando"
        class="elevation-4"
        fixed-header
        height="240px"
      >
        <template v-slot:item.opciones="row">
          <div class="d-flex">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="secondary"
                  class="rounded-0"
                  small
                  dark
                  v-bind="attrs"
                  :to="{
                    name: 'Editar cliente',
                    params: {
                      id: row.item['id_cliente'],
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
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="green"
                  class="rounded-0"
                  small
                  dark
                  v-bind="attrs"
                  :to="{
                    name: 'Ordenes de cliente',
                    params: {
                      id: row.item['id_cliente'],
                    }
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
</template>

<script>
import clienteEmpresarialHeaders from '../../commons/tableHeaders/clienteEmpresarial'
import clientePersonalHeaders from '../../commons/tableHeaders/clientePersonal'
export default {
  name: 'ListadoDeClientes',
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
    tiposDeCliente: []
  }),
  activated () {
    if (
      this.selecciontipoCliente &&
      this.$store.state.recargar
    ) {
      this.recargarTabla()
      this.$store.commit('noRecargarDatos')
    }
  },
  created () {
    this.obtenerTiposDeCliente()
  },
  methods: {
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
      this.$api({
        method: 'get',
        url: 'clientes/obtener-clientes/' + this.selecciontipoCliente,
        headers: { Authorization: 'Bearer ' + localStorage.token }
      }).then((response) => {
        this.items = response.data.clientes
        this.loading = false
      })
    },
    recargarTabla () {
      this.loading = true
      this.headers =
        this.selecciontipoCliente === 1
          ? this.headerClienteEmpresarial
          : this.headerClientePersonal
      this.items = []
      this.busqueda = null
      this.obtenerClientes()
    }
  }
}
</script>
