<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card class="elevation-10">
          <v-card-title>
            <v-row>
              <v-col cols="12" md="10">
                <h3 style="word-break: normal" class="text-center text-md-left">
                  Listado de proveedores
                </h3>
              </v-col>
              <v-col cols="12" md="2" class="text-center text-md-end">
                <v-btn
                  v-if="tienePermiso(34)"
                  color="primary"
                  block
                  :to="{ name: 'Registrar proveedor' }"
                >
                  Registrar
                  <v-icon right>mdi-shield-plus</v-icon>
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
                nextIcon: 'mdi-plus'
              }"
            >
              <template v-slot:item.opciones="row">
                <div class="d-flex">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        v-if="tienePermiso(35)"
                        color="secondary"
                        class="rounded-0"
                        small
                        dark
                        v-bind="attrs"
                        :to="{
                  name: 'Editar proveedor',
                  params: { id: row.item['id_proveedor'] },
                }"
                        v-on="on"
                      >
                        <v-icon>mdi-pencil</v-icon>
                      </v-btn>
                    </template>
                    <span>Editar datos</span>
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
import proveedorHeaders from '../../commons/tableHeaders/proveedor'
import { tableMixin } from '@/commons/mixins/tableMixin'
export default {
  mixins: [tableMixin],
  name: 'ListadoDeProveedores',
  data: () => ({
    headers: proveedorHeaders,
    busqueda: null,
    items: [],
    respuestaServidor: null,
    alerta: false,
    loading: true,
    loadingSelect: true
  }),
  activated () {
    if (
      this.$store.state.recargar
    ) {
      this.recargarTabla()
      this.$store.commit('noRecargarDatos')
    }
  },
  created () {
    this.obtenerProveedores()
  },
  computed: {
    tienePermiso () {
      return this.$store.getters.tienePermiso
    }
  },
  methods: {
    obtenerProveedores () {
      this.$api({
        method: 'get',
        url: 'proveedores/obtener-proveedores',
        headers: { Authorization: 'Bearer ' + localStorage.token }
      }).then((response) => {
        const { proveedores } = response.data
        this.items = proveedores
        this.loading = false
      })
    },
    recargarTabla () {
      this.items = []
      this.loading = true
      this.busqueda = null
      this.obtenerProveedores()
    }
  }
}
</script>
