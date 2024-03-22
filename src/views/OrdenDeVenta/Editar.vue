<template>
  <v-container>
    <v-row v-if="ordenDeVenta.orden">
      <v-col cols="12">
        <v-card class="elevation-10">
          <v-card-title>
            <v-row>
              <v-col cols="12" md="10">
                <h3 style="word-break: normal" class="text-center text-md-left">
                  Editar datos de la orden de venta
                </h3>
              </v-col>
              <v-col cols="12" md="2" class="text-center text-md-end">
                <v-btn
                  block
                  color="error"
                  :to="{ name: 'Listado de ordenes de venta' }"
                >
                  <v-icon left>mdi-arrow-left</v-icon>
                  Atras
                </v-btn>
              </v-col>
            </v-row>
          </v-card-title>
        </v-card>
      </v-col>
      <v-col cols="12">
        <ValidationObserver ref="obs">
          <v-row>
            <v-col cols="12">
              <v-card class="elevation-10">
                <v-card-title>
                  <v-container class="elevation-4">
                    <v-row>
                      <v-col cols="12">
                        <h4 class="text-center">Datos generales</h4>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col cols="12" md="4">
                      <ValidationProvider
                        name="Tipo de cliente"
                        rules="required"
                        v-slot="{ errors }"
                      >
                        <v-select
                          v-model="
                            ordenDeVenta.orden.cliente.id_tipo_de_cliente
                          "
                          label="Tipo de cliente"
                          outlined
                          prepend-icon="mdi-briefcase-account"
                          :items="tiposDeCliente"
                          item-text="tipo_cliente"
                          item-value="id_tipo_de_cliente"
                          color="blue darken-4"
                          @change="obtenerClientes()"
                          :error-messages="
                            obtenerValidaciones(errors, 'id_tipo_de_cliente')
                          "
                        />
                      </ValidationProvider>
                    </v-col>
                    <v-col cols="12" md="8">
                      <ValidationProvider
                        name="Cliente"
                        rules="required_if:Tipo de cliente"
                        v-slot="{ errors }"
                      >
                        <v-autocomplete
                          v-model="ordenDeVenta.orden.cliente.id_cliente"
                          :items="clientes"
                          item-text="datos_unidos"
                          item-value="id_cliente"
                          prepend-icon="mdi-card-account-details"
                          outlined
                          :loading="loading"
                          :disabled="inactivo"
                          label="Cliente"
                          hint="Seleccione al cliente"
                          persistent-hint
                          clearable
                          :error-messages="
                            obtenerValidaciones(errors, 'id_cliente')
                          "
                        />
                      </ValidationProvider>
                    </v-col>
                    <v-col cols="12">
                      <ValidationProvider
                        name="Descripción"
                        rules="required"
                        v-slot="{ errors }"
                      >
                        <v-textarea
                          v-model="ordenDeVenta.observaciones_orden_de_venta"
                          label="Descripcion de la orden de venta"
                          outlined
                          prepend-icon="mdi-clipboard-list"
                          color="blue darken-4"
                          :error-messages="
                            obtenerValidaciones(
                              errors,
                              'descripcion_orden_de_trabajo'
                            )
                          "
                        />
                      </ValidationProvider>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12">
              <v-card class="elevation-10">
                <v-card-title>
                  <v-container class="elevation-4">
                    <v-row>
                      <v-col cols="12">
                        <h4 class="text-center">Suministros</h4>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col cols="12">
                      <v-tabs v-model="tab" grow class="elevation-4 mb-3">
                        <v-tab href="#tab-1">
                          <v-icon>mdi-package-down</v-icon>
                          Suministros asignados
                        </v-tab>
                        <v-tab href="#tab-2">
                          <v-icon>mdi-package-up</v-icon>
                          Suministros no asignados
                        </v-tab>
                      </v-tabs>
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
                          Es obligatorio seleccionar al menos un suministro y
                          asignarle una cantidad válida.
                        </v-alert>
                      </v-card-subtitle>
                      <v-tabs-items v-model="tab">
                        <v-tab-item value="tab-1">
                          <suministros-asignados
                            @establecer-suministros="establecerSuministros"
                          />
                        </v-tab-item>
                        <v-tab-item value="tab-2">
                          <suministros-no-asignados
                            @establecer-suministros="establecerSuministros"
                          />
                        </v-tab-item>
                      </v-tabs-items>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12">
              <v-card class="elevation-10">
                <v-card-title>
                  <v-container class="elevation-4">
                    <v-row>
                      <v-col cols="12">
                        <h4 class="text-center">Confirmar precio</h4>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col cols="12" md="4">
                      <ValidationProvider
                        name="Total"
                        rules="required"
                        v-slot="{ errors }"
                      >
                        <v-text-field
                          v-model="ordenDeVenta.orden.precio_total"
                          label="Precio total"
                          outlined
                          prepend-icon="mdi-cash-multiple"
                          color="blue darken-4"
                          suffix="Bs"
                          disabled
                          :error-messages="obtenerValidaciones(errors, 'total')"
                        />
                      </ValidationProvider>
                    </v-col>
                    <v-col cols="12" md="4">
                      <ValidationProvider
                        name="Monto cancelado"
                        :rules="
                          'required|double:2|min_value:0|max_value:' +
                          ordenDeVenta.orden.precio_total
                        "
                        v-slot="{ errors }"
                      >
                        <v-text-field
                          v-model="ordenDeVenta.orden.monto_cancelado"
                          label="Monto cancelado"
                          outlined
                          prepend-icon="mdi-account-cash"
                          color="blue darken-4"
                          suffix="Bs"
                          :error-messages="
                            obtenerValidaciones(errors, 'monto_cancelado')
                          "
                        />
                      </ValidationProvider>
                    </v-col>
                    <v-col cols="12" md="3" class="d-flex justify-center">
                      <v-checkbox
                        class="mt-0"
                        v-model="imprimir"
                        label="Imprimir recibo"
                        outlined
                        append-icon="mdi-receipt-text"
                        color="blue darken-4"
                      />
                    </v-col>
                  </v-row>
                </v-card-text>
                <v-card-actions class="mb-2 mr-2">
                  <v-spacer />
                  <v-btn
                    :loading="botonCargando"
                    color="green"
                    class="white--text"
                    @click="enviarFormulario"
                  >
                    Modificar
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </ValidationObserver>
      </v-col>
    </v-row>
    <v-overlay :value="overlay" absolute dark opacity="0.8" color="#212121">
      <v-progress-circular indeterminate :size="90" :width="8">
        Cargando
      </v-progress-circular>
    </v-overlay>
  </v-container>
</template>

<script>
import SuministrosAsignados from "@/components/Orden/ModificarSuministros/SuministrosAsignados.vue";
import SuministrosNoAsignados from "@/components/Orden/ModificarSuministros/SuministrosNoAsignados.vue";
import { impresionService } from "@/services/impresion";

export default {
  name: "ModificarOrdenDeVenta",
  components: {
    SuministrosAsignados,
    SuministrosNoAsignados,
  },
  data: () => ({
    imprimir: true,
    tab: null,
    overlay: true,
    loading: false,
    inactivo: true,
    botonCargando: false,
    respuestaServidor: null,
    alerta: false,
    clientes: [],
    errores: [],
    clienteSeleccionado: null,
    ordenDeVenta: [],
    suministros: [],
    tiposDeCliente: [],
    tipoDeClienteSeleccionado: null,
    suministrosAsignados: [],
    nuevosSuministros: [],
    subtotalAsignados: 0,
    subtotalNuevos: 0,
    validacionServidor: false,
    datosImpresion: {
      datosRecibo: null,
      suministros: null,
    },
  }),
  created() {
    this.obtenerDatosOrdenDeVenta();
    this.obtenerTiposDeCliente();
  },
  watch: {
    suministros: {
      handler: function (nuevoValor) {
        if (nuevoValor.length > 0) {
          this.alerta = false;
        }
      },
      deep: true,
    },
  },
  methods: {
    enviarFormulario() {
      this.$refs.obs.validate().then((valid) => {
        if (!valid) {
          this.alerta = this.suministros.length === 0;
          const errorField = document.querySelector(".error--text");
          if (errorField) {
            errorField.scrollIntoView(false, {
              behavior: "smooth",
              block: "start",
              inline: "nearest",
            });
          }
        } else {
          this.modificarOrdenDeVenta();
        }
      });
    },
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
      this.loading = true;
      this.inactivo = true;
      const tipoCliente =
        this.ordenDeVenta.orden.cliente.id_tipo_de_cliente === 1
          ? "empresariales"
          : "personales";
      this.$api({
        method: "get",
        url: "clientes/obtener-clientes-" + tipoCliente,
        headers: { Authorization: "Bearer " + localStorage.token },
      }).then((response) => {
        this.clientes = response.data.clientes;
        this.loading = false;
        this.inactivo = false;
      });
    },
    obtenerDatosOrdenDeVenta() {
      this.$api({
        method: "get",
        url:
          "ordenes-de-venta/editar-orden-de-venta/" +
          this.$route.params.idOrdenDeVenta +
          "/" +
          this.$route.params.tipoCliente,
        headers: { Authorization: "Bearer " + localStorage.token },
      }).then((response) => {
        this.ordenDeVenta = response.data.ordenDeVenta[0];
        this.suministros = response.data.suministros;
        this.obtenerClientes();
        this.overlay = false;
      });
    },
    modificarOrdenDeVenta() {
      this.botonCargando = true;
      this.$api({
        method: "put",
        url:
          "ordenes-de-venta/modificar-orden-de-venta/" +
          this.$route.params.idOrden,
        headers: { Authorization: "Bearer " + localStorage.token },
        data: this.generarDatos(),
      })
        .then((response) => {
          this.errores = [];
          this.respuestaServidor = response.data.mensaje;
          if (this.imprimir) {
            this.datosImpresion.datosRecibo = response.data.datos[0];
            this.datosImpresion.suministros = response.data.suministros;
            this.imprimirRecibo();
          }
          this.$store.commit("recargarDatos");
        })
        .catch((error) => {
          this.validacionServidor = true;
          this.errores = error.response.data.errors;
        })
        .finally(() => {
          this.botonCargando = false;
          this.activarNotificacion();
        });
    },
    generarDatos() {
      const datos = {
        id_cliente: this.ordenDeVenta.orden.cliente.id_cliente,
        id_tipo_de_orden: 3,
        precio_total: this.ordenDeVenta.orden.precio_total,
        monto_cancelado: this.ordenDeVenta.orden.monto_cancelado,
        observaciones_orden_de_venta:
          this.ordenDeVenta.observaciones_orden_de_venta,
        suministros: [],
        cantidades: [],
        precios: [],
      };

      this.suministros.forEach(function (item) {
        datos.suministros.push(item.id_suministro);
        datos.cantidades.push(parseInt(item.cantidad_prevista_suministro));
        datos.precios.push(item.precio_unitario_suministro);
      });

      return datos;
    },
    establecerSuministros(suministros, subtotal, componente) {
      subtotal = parseFloat(subtotal);
      if (componente === "Suministros asignados") {
        this.suministrosAsignados = suministros;
        this.subtotalAsignados = subtotal;
      }
      if (componente === "Nuevos suministros") {
        this.nuevosSuministros = suministros;
        this.subtotalNuevos = subtotal;
      }

      this.ordenDeVenta.orden.precio_total =
        this.subtotalNuevos + this.subtotalAsignados;

      if (
        this.ordenDeVenta.orden.precio_total === 0 ||
        this.ordenDeVenta.orden.precio_total === 0.0
      ) {
        this.ordenDeVenta.orden.precio_total = null;
      }

      if (
        suministros.length > 0 &&
        suministros.every(
          (suministro) => suministro.cantidad_prevista_suministro > 0
        )
      ) {
        this.suministros = [
          ...this.suministrosAsignados,
          ...this.nuevosSuministros,
        ];
      } else {
        this.suministros = [];
      }
    },
    activarNotificacion() {
      if (Object.keys(this.errores).length > 0) {
        const mensaje =
          "No se pudo completar la acción, por favor verifique los errores.";
        this.$toast.error(mensaje);
      } else {
        this.validacionServidor = false;
        this.$refs.obs.reset();
        this.$toast.success(this.respuestaServidor);
      }
    },
    obtenerValidaciones(errors, field) {
      const veeErrors = errors || [];
      const serverErrors = this.errores[field] || [];
      return [...veeErrors, ...serverErrors];
    },
    imprimirRecibo() {
      impresionService.imprimir(
        this.datosImpresion.datosRecibo,
        this.datosImpresion.suministros
      );
    },
  },
};
</script>
