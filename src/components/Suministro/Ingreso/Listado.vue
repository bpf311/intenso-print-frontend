<template>
  <v-card>
    <v-card-text>
      <v-data-table
        :headers="headers"
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
                  class="rounded"
                  small
                  dark
                  v-bind="attrs"
                  v-on="on"
                  @click="abrirVentanaModal(row.item)"
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
    <v-dialog v-model="ventanaModal" width="500" scrollable>
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          Detalles del ingreso
        </v-card-title>
        <datos v-if="ingreso" :ingreso="ingreso" />
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn color="red" class="white--text" @click="cerrarVentanModal()">
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import ingresoSuministroHeaders from '../../../commons/tableHeaders/ingresoSuministro'
import datos from '../Ingreso/Datos.vue'
export default {
  components: { datos },
  data: () => ({
    headers: ingresoSuministroHeaders,
    ventanaModal: false,
    items: [],
    mensaje: '',
    alerta: false,
    loading: true,
    ingreso: null
  }),
  created () {
    this.obtenerIngresosSuministro()
  },
  methods: {
    abrirVentanaModal (datos) {
      this.ingreso = datos
      this.ventanaModal = true
    },
    cerrarVentanModal () {
      this.ventanaModal = false
      this.ingreso = null
    },
    obtenerIngresosSuministro () {
      this.$api({
        method: 'get',
        url:
          'ingresos-de-suministros/obtener-ingresos-de-suministro/' +
          this.$route.params.id,
        headers: { Authorization: 'Bearer ' + localStorage.token }
      }).then((response) => {
        this.items = response.data.ingresos
        this.loading = false
      })
    }
  }
}
</script>
