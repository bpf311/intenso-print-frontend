<template>
  <v-card>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="ordenesDeServicio"
        :loading="loading"
        loading-text="Cargando"
        class="elevation-4"
        fixed-header
        height="240px"
      >
        <template v-slot:item.estado="{ item }">
          <v-chip
            :color="colorDeFondo(item.estado)"
            dark
          >
            {{ item.estado }}
          </v-chip>
        </template>
        <template v-slot:item.opciones="row">
          <div class="d-flex">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="info"
                  class="rounded-r-0"
                  small
                  dark
                  v-bind="attrs"
                  v-on="on"
                  @click="abrirVentanaModal(row.item)"
                >
                  <v-icon>mdi-eye</v-icon>
                </v-btn>
              </template>
              <span>Ver datos</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="secondary"
                  class="rounded-l-0"
                  small
                  dark
                  v-bind="attrs"
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
    <!--    <v-dialog v-model="ventanaModal" width="500" scrollable>
          <v-card>
            <v-card-title class="text-h5 grey lighten-2">
              Detalles del ingreso
            </v-card-title>
            <datos v-if="ingreso" :ingreso="ingreso" />
            <v-divider />
            <v-card-actions>
              <v-spacer />
              <v-btn color="red" class="white&#45;&#45;text" @click="cerrarVentanModal()">
                Cerrar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>-->
  </v-card>
</template>

<script>
import ordenesDeServicioCliente from '@/commons/tableHeaders/ordenesDeServicioCliente'
export default {
  name: 'OrdenesDeServicio',
  data: () => ({
    headers: ordenesDeServicioCliente,
    ventanaModal: false,
    mensaje: '',
    alerta: false,
    loading: true,
    ingreso: null,
    ordenesDeServicio: []
  }),
  created () {
    this.obtenerOrdenesDeCliente()
  },
  methods: {
    obtenerOrdenesDeCliente () {
      this.$api({
        method: 'get',
        url: 'clientes/obtener-ordenes-cliente/' + this.$route.params.id + '/2',
        headers: { Authorization: 'Bearer ' + localStorage.token }
      }).then((response) => {
        this.ordenesDeServicio = response.data.ordenesDelCliente
        this.loading = false
        this.overlay = false
      })
    },
    colorDeFondo (estado) {
      if (estado === 'Pago completo') return 'green'
      else if (estado === 'Faltan pagos') return 'red'
    },
    abrirVentanaModal (datos) {
      this.ingreso = datos
      this.ventanaModal = true
    },
    cerrarVentanModal () {
      this.ventanaModal = false
      this.ingreso = null
    }
  }
}
</script>
