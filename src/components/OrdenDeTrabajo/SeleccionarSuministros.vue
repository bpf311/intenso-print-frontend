<template>
  <div>
    <v-row>
      <v-col cols="12" md="4">
        <v-select
          v-model="seleccionTipoSuministro"
          outlined
          :items="tiposDeSuministros"
          item-text="tipo_suministro"
          item-value="id_tipo_de_suministro"
          label="Tipo de suministro"
          persistent-hint
          prepend-icon="mdi-package-variant-closed"
          :loading="loadingSelect"
          @change="recargarTabla()"
        />
      </v-col>
      <v-col cols="12" md="4">
        <v-select
          v-if="seleccionTipoSuministro"
          v-model="seleccionStock"
          outlined
          :items="stock"
          item-text="estado"
          label="Stock"
          item-value="id"
          prepend-icon="mdi-package-variant-closed"
          persistent-hint
          @change="recargarTabla()"
        />
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="4">
        <v-text-field
          v-if="seleccionTipoSuministro"
          v-model="busqueda"
          prepend-icon="mdi-magnify"
          label="Busqueda"
          outlined
          hint="Realize una busqueda"
          persistent-hint
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-data-table
          v-if="seleccionTipoSuministro"
          v-model="suministrosSeleccionados"
          :headers="headers"
          :search="busqueda"
          :items="items"
          :loading="loading"
          loading-text="Cargando"
          class="elevation-4"
          item-key="id_suministro"
          show-select
          fixed-header
          height="240px"
        >
          <template v-slot:item.precio_unitario_suministro="{ item }">
            <v-text-field
              v-model="item.precio_unitario_suministro"
              outlined
              dense
              class="my-text-field"
              type="number"
              min="0"
              :disabled="!suministrosSeleccionados.includes(item)"
            ></v-text-field>
          </template>
          <template v-slot:item.cantidad="{ item }">
            <v-text-field
              v-model="item.cantidad"
              outlined
              dense
              class="my-text-field"
              type="number"
              min="0"
              :max="item.saldo_suministro"
              :disabled="!suministrosSeleccionados.includes(item)"
            ></v-text-field>
          </template>
          <template v-slot:item.subtotal="{ item }">
<!--            <td v-if="item.cantidad" class="align-content-end">
              {{ item.cantidad * item.precio_unitario_suministro }} Bs
            </td>
            <td v-else>
              0.00
            </td>-->
            <v-text-field
              v-model="item.subtotal"
              :value="item.cantidad * item.precio_unitario_suministro"
              disabled
            ></v-text-field>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </div>
</template>

<style>
.my-text-field .v-text-field__details {
  display: none;
}
</style>

<script>
import seleccionSuministroHeaders from '@/commons/tableHeaders/seleccionSuministro'
export default {
  name: 'ListadoDeSuministros',
  props: {
    suministros: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      busqueda: null,
      headers: seleccionSuministroHeaders,
      items: [],
      loading: true,
      seleccionTipoSuministro: '',
      tiposDeSuministros: [],
      loadingSelect: true,
      seleccionStock: 'todos',
      stock: [
        { id: 'todos', estado: 'Todos' },
        { id: 'sin_stock', estado: 'Sin stock' },
        { id: 'con_stock', estado: 'Con stock' }
      ],
      suministrosSeleccionados: this.suministros
    }
  },
  watch: {
    suministrosSeleccionados (nuevoValor) {
      this.$emit('seleccionados', nuevoValor)
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
        this.items = response.data.suministros
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
