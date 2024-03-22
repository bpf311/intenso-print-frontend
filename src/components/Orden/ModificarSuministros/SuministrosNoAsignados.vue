<template>
  <v-card class="elevation-10">
    <v-card-subtitle v-if="alerta">
      <v-alert
        outlined
        prominent
        type="error"
        elevation="2"
        text
        class="mb-2"
        dismissible
        border="bottom"
      >
        El precio y/o la cantidad asignada a cada suministro seleccionado no
        puede ser igual a cero.
      </v-alert>
    </v-card-subtitle>
    <v-card-subtitle>
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
            @change="recargarTabla"
            :disabled="cambiarSuministros"
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
            hint="Realice una busqueda"
            persistent-hint
          ></v-text-field>
        </v-col>
      </v-row>
    </v-card-subtitle>
    <v-card-text>
      <v-data-table
        :headers="headers"
        v-model="suministrosSeleccionados"
        :items="suministros"
        :search="busqueda"
        :loading="loading"
        loading-text="Cargando"
        item-key="id_suministro"
        show-select
        @item-selected="verificarSeleccion"
      >
        <template v-slot:[`item.precio_unitario_suministro`]="{ item }">
          <v-text-field
            v-model="item.precio_unitario_suministro"
            outlined
            dense
            type="number"
            class="my-text-field"
            color="blue darken-4"
            suffix="Bs"
            @input="calcularSubtotal(item)"
            :disabled="!suministrosSeleccionados.includes(item)"
          />
        </template>
        <template v-slot:[`item.cantidad`]="{ item }">
          <v-text-field
            v-model="item.cantidad_prevista_suministro"
            outlined
            dense
            type="number"
            min="1"
            class="my-text-field"
            color="blue darken-4"
            @input="calcularSubtotal(item)"
            :disabled="!suministrosSeleccionados.includes(item)"
          />
        </template>
        <template v-slot:[`item.subtotal`]="{ item }">
          <p v-if="item.cantidad_prevista_suministro">
            {{
              (
                item.precio_unitario_suministro *
                item.cantidad_prevista_suministro
              ).toFixed(2)
            }}
            Bs
          </p>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>
<style>
.my-text-field .v-text-field__details {
  display: none;
}
</style>
<script>
import seleccionSuministro from "@/commons/tableHeaders/seleccionSuministro";
export default {
  name: "SeleccionarSuministros",
  props: {
    limpiarDatos: Boolean,
  },
  data: () => ({
    headers: seleccionSuministro,
    loading: false,
    respuestaServidor: null,
    suministros: [],
    subtotales: {},
    seleccionTipoSuministro: 1,
    tiposDeSuministros: [],
    loadingSelect: true,
    busqueda: null,
    suministrosSeleccionados: [],
    error: false,
    mensajeError: null,
    cambiarSuministros: false,
    alerta: false,
  }),
  created() {
    this.obtenerTiposDeSuministros();
    this.obtenerSuministros();
  },
  watch: {
    suministrosSeleccionados: {
      handler: function (nuevoValor) {
        const validacion = nuevoValor.every((objeto) => {
          return (
            objeto.cantidad_prevista_suministro !== "0" &&
            objeto.precio_unitario_suministro !== "0"
          );
        });
        if (!validacion) {
          this.alerta = true;
          this.cambiarSuministros = true;
        } else {
          this.alerta = false;
          this.cambiarSuministros = false;
          this.calcularTotal();
        }
      },
      deep: true,
    },
    limpiarDatos(nuevoValor, valorAnterior) {
      if (nuevoValor) {
        this.suministrosSeleccionados = [];
        this.obtenerSuministros();
        this.$emit("reiniciar-variable");
      }
    },
  },
  methods: {
    verificarSeleccion(seleccionado) {
      if (!seleccionado.value) {
        const suministro = seleccionado.item;
        const index = this.suministros.findIndex(
          (objeto) => objeto.id_suministro === suministro.id_suministro
        );
        if (index !== -1) {
          const suministroEncontrado = this.suministros[index];
          delete suministroEncontrado.cantidad_prevista_suministro;
          delete suministroEncontrado.subtotal;
          delete this.subtotales[suministroEncontrado.id_suministro];
        }
      }
    },
    obtenerTiposDeSuministros() {
      this.$api({
        method: "get",
        url: "tipos-de-suministros/obtener-tipos-de-suministros",
        headers: { Authorization: "Bearer " + localStorage.token },
      }).then((response) => {
        this.tiposDeSuministros = response.data.tiposDeSuministros;
        this.loadingSelect = false;
      });
    },
    obtenerSuministros() {
      this.$api({
        method: "get",
        url:
          "suministros/obtener-suministros-no-asignados/" +
          this.seleccionTipoSuministro +
          "/" +
          this.$route.params.idOrden,
        headers: { Authorization: "Bearer " + localStorage.token },
      }).then((response) => {
        const { suministrosNoAsignados } = response.data;
        this.suministros = suministrosNoAsignados;
        if (this.suministrosSeleccionados.length > 0) {
          // Crear un diccionario de suministrosSeleccionados indexado por id_suministro
          const suministrosSeleccionadosDict = {};
          this.suministrosSeleccionados.forEach((obj) => {
            suministrosSeleccionadosDict[obj.id_suministro] = obj;
          });
          // Reemplazar los suministros en el array1 si existen en el array2
          this.suministros.forEach((suministro, index) => {
            const obj2 = suministrosSeleccionadosDict[suministro.id_suministro];
            if (obj2) {
              this.suministros[index] = obj2;
            }
          });
        }
        this.loading = false;
      });
    },
    calcularSubtotal(item) {
      const id = item.id_suministro;
      if (item.cantidad_prevista_suministro) {
        item.subtotal =
          item.cantidad_prevista_suministro * item.precio_unitario_suministro;
        this.subtotales[id] = item.subtotal;
      }
      if (!item.cantidad_prevista_suministro) {
        delete this.subtotales[id];
      }
    },
    calcularTotal() {
      const total = Object.values(this.subtotales).reduce((a, b) => a + b, 0);
      this.$emit(
        "establecer-suministros",
        this.suministrosSeleccionados,
        total.toFixed(2),
        "Nuevos suministros"
      );
    },
    recargarTabla() {
      this.suministros = [];
      this.loading = true;
      this.busqueda = null;
      this.obtenerSuministros();
    },
  },
};
</script>
