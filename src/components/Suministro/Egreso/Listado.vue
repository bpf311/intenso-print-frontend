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
import egresoSuministroHeaders from '../../../commons/tableHeaders/egresoSuministro'
import datos from '../Ingreso/Datos.vue'
export default {
  components: { datos },
  data: () => ({
    headers: egresoSuministroHeaders,
    ventanaModal: false,
    items: [],
    mensaje: '',
    alerta: false,
    loading: true,
    ingreso: null
  }),
  created () {
    this.obtenerEgresosSuministro()
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
    obtenerEgresosSuministro () {
      this.$api({
        method: 'get',
        url:
          'egresos-de-suministros/obtener-egresos-de-suministro/' +
          this.$route.params.id,
        headers: { Authorization: 'Bearer ' + localStorage.token }
      }).then((response) => {
        this.items = response.data.egresos
        this.loading = false
      })
    }
  }
}
</script>
