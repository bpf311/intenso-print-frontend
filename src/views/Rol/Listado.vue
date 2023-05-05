<template>
  <v-card elevation="5" class="rounded-lg">
    <v-card-title>
      <v-container class="elevation-4">
        <v-row>
          <v-col cols="12" lg="6">
            <h3 class="text-center text-md-left"> Listado de roles </h3>
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="12" lg="2">
            <v-btn color="primary" block :to="{ name: 'Registrar rol' }">
              Registrar
              <v-icon
                right
              >
                mdi-shield-plus
              </v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card-title>
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
                  color="info"
                  class="rounded-r-0"
                  small
                  dark
                  v-bind="attrs"
                  v-on="on"
                  :to="{
                    name: 'Editar rol',
                    params: { id: row.item['id_rol'] },
                  }"
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
                  class="rounded-0"
                  small
                  dark
                  v-bind="attrs"
                  :to="{
                  name: 'Editar rol',
                  params: { id: row.item['id_rol'] },
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
    <v-snackbar
      v-model="alerta"
      :timeout="4000"
      color="success"
      app
      top
      right
    >
      <v-row align="center" justify="center">
        <v-col cols="2">
          <v-icon
            large
            color="white"
          >
            mdi-check-circle-outline
          </v-icon>
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
import rolHeaders from '../../commons/tableHeaders/rol'
export default {
  name: 'ListadoDeRoles',
  data: () => ({
    headers: rolHeaders,
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
    this.obtenerRoles()
  },
  methods: {
    obtenerRoles () {
      this.$api({
        method: 'get',
        url: 'roles/obtener-roles',
        headers: { Authorization: 'Bearer ' + localStorage.token }
      }).then((response) => {
        this.items = response.data.roles
        this.loading = false
      })
    },
    recargarTabla () {
      this.items = []
      this.loading = true
      this.obtenerRoles()
    }
  }
}
</script>
