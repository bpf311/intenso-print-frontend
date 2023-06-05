<template>
  <v-card elevation="5" class="rounded-lg">
    <v-card-title>
      <v-container class="elevation-4">
        <v-row>
          <v-col cols="12" lg="6">
            <h3 style="word-break: normal" class="text-center text-md-left"> Listado de suministros </h3>
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="12" lg="2">
            <v-btn color="primary" block :to="{ name: 'Registrar suministro' }">
              Registrar
              <v-icon
                right
              >
                mdi-package-variant-closed-plus
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
              v-model="seleccionTipoSuministro"
              outlined
              :items="tiposDeSuministros"
              item-text="tipo_suministro"
              item-value="id_tipo_de_suministro"
              hint="Seleccione un tipo de suministro"
              label="Tipo de suministro"
              persistent-hint
              :loading="loadingSelect"
              @change="recargarTabla()"
            />
          </v-col>
          <v-col cols="12" lg="2">
            <v-select
              v-if="seleccionTipoSuministro"
              v-model="seleccionStock"
              outlined
              :items="stock"
              item-text="estado"
              label="Stock"
              item-value="id"
              hint="Seleccione el stock"
              persistent-hint
              @change="recargarTabla()"
            />
          </v-col>
          <v-spacer />
          <v-col cols="12" lg="3">
            <v-text-field
              v-if="seleccionTipoSuministro"
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
        v-if="seleccionTipoSuministro"
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
                  color="light-green"
                  class="rounded-0"
                  small
                  dark
                  v-bind="attrs"
                  :to="{
                    name: 'Registrar ingreso de suministro',
                    params: { id: row.item['id_suministro'] },
                  }"
                  v-on="on"
                >
                  <v-icon>mdi-archive-plus</v-icon>
                </v-btn>
              </template>
              <span>Registrar ingreso</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="info"
                  class="rounded-0"
                  small
                  dark
                  v-bind="attrs"
                  :to="{
                    name: 'Datos del suministro',
                    params: { id: row.item['id_suministro'] },
                  }"
                  v-on="on"
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
                    name: 'Editar suministro',
                    params: { id: row.item['id_suministro'] },
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
</template>

<script>
import suministroHeaders from '../../commons/tableHeaders/suministro'
export default {
  name: 'ListadoDeSuministros',
  data: () => ({
    busqueda: null,
    headers: suministroHeaders,
    items: [],
    mensaje: '',
    loading: true,
    seleccionTipoSuministro: '',
    tiposDeSuministros: [],
    loadingSelect: true,
    seleccionStock: 'todos',
    stock: [
      { id: 'todos', estado: 'Todos' },
      { id: 'sin_stock', estado: 'Sin stock' },
      { id: 'con_stock', estado: 'Con stock' }
    ]
  }),
  activated () {
    if (
      this.seleccionTipoSuministro &&
      this.$store.state.recargar
    ) {
      this.recargarTabla()
      this.$store.commit('noRecargarDatos')
    }
  },
  created () {
    this.obtenerTiposDeSuministros()
  },
  methods: {
    obtenerTiposDeSuministros () {
      this.$api({
        method: 'get',
        url: 'tipos-de-suministros/obtener-tipos-de-suministros',
        headers: { Authorization: 'Bearer ' + localStorage.token }
      }).then((response) => {
        this.tiposDeSuministros = response.data.tiposDeSuministros
        this.loadingSelect = false
      })
    },
    obtenerSuministros () {
      this.$api({
        method: 'get',
        url:
          'suministros/obtener-suministros/' +
          this.seleccionTipoSuministro +
          '/' + this.seleccionStock,
        headers: { Authorization: 'Bearer ' + localStorage.token }
      }).then((response) => {
        ({ suministros: this.items } = response.data)
        this.loading = false
      })
    },
    recargarTabla () {
      this.loading = true
      this.items = []
      this.obtenerSuministros()
    }
  }
}
</script>
