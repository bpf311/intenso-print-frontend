<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card class="elevation-10">
          <v-card-title>
            <v-row>
              <v-col cols="12" md="10">
                <h3 style="word-break: normal" class="text-center text-md-left">
                  Registrar nueva orden de venta
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
                          v-model="tipoDeClienteSeleccionado"
                          label="Tipo de cliente"
                          outlined
                          prepend-icon="mdi-briefcase-account"
                          :items="tiposDeCliente"
                          item-text="tipo_cliente"
                          item-value="id_tipo_de_cliente"
                          color="blue darken-4"
                          @change="obtenerClientes(true)"
                          :error-messages="
                            obtenerValidaciones(errors, 'id_tipo_de_cliente')
                          "
                        />
                      </ValidationProvider>
                    </v-col>
                    <v-col cols="12" md="6">
                      <ValidationProvider
                        name="Cliente"
                        rules="required_if:Tipo de cliente"
                        v-slot="{ errors }"
                      >
                        <v-autocomplete
                          v-model="clienteSeleccionado"
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
                    <v-col cols="12" md="2">
                      <v-btn
                        color="green"
                        block
                        class="white--text"
                        @click="ventanaRegistroCliente = true"
                      >
                        Nuevo cliente
                      </v-btn>
                    </v-col>
                    <v-col cols="12">
                      <ValidationProvider
                        name="Descripción"
                        rules="required"
                        v-slot="{ errors }"
                      >
                        <v-textarea
                          v-model="ordenDeVenta.descripcion"
                          label="Descripción del pedido"
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
                        <h4 class="text-center">Asignar suministros</h4>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-title>
                <v-card-subtitle class="mt-2">
                  <v-alert
                    v-if="alerta"
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
                <div>
                  <SeleccionarSuministros
                    :limpiarDatos="limpiarDatos"
                    :mensajeError="mensajeError"
                    @establecer-suministros="establecerSuministros"
                    @reiniciar-variable="limpiarDatos = false"
                  />
                </div>
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
                <v-card-text class="mt-5">
                  <v-row class="d-flex justify-space-around">
                    <v-col cols="12" md="4">
                      <ValidationProvider
                        name="Total"
                        rules="required"
                        v-slot="{ errors }"
                      >
                        <v-text-field
                          v-model="ordenDeVenta.precioTotal"
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
                          ordenDeVenta.precioTotal
                        "
                        v-slot="{ errors }"
                      >
                        <v-text-field
                          v-model="ordenDeVenta.montoCancelado"
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
                    Registrar
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </ValidationObserver>
      </v-col>
    </v-row>
    <v-dialog v-model="ventanaRegistroCliente" width="1000" persistent>
      <RegistrarNuevoCliente
        @cerrar-ventana="ventanaRegistroCliente = false"
        @establecer-nuevo-cliente="establecerNuevoCliente"
      />
    </v-dialog>
  </v-container>
</template>
<style>
.my-text-field .v-text-field__details {
  display: none;
}
</style>
<script>
import RegistrarNuevoCliente from "@/components/Orden/RegistrarNuevoCliente/RegistrarNuevoCliente.vue";
import SeleccionarSuministros from "@/components/Orden/SeleccionarSuministros/SeleccionarSuministros.vue";
import { impresionService } from "@/services/impresion";

export default {
  name: "CrearOrdenDeVenta",
  components: {
    RegistrarNuevoCliente,
    SeleccionarSuministros,
  },
  data: () => ({
    imprimir: true,
    datosImpresion: {
      datosRecibo: null,
      suministros: null,
    },
    loading: false,
    inactivo: true,
    botonCargando: false,
    respuestaServidor: null,
    validacionServidor: false,
    alerta: false,
    clientes: [],
    errores: [],
    clienteSeleccionado: null,
    ordenDeVenta: {
      descripcion: null,
      precioTotal: null,
      montoCancelado: null,
    },
    tiposDeCliente: [],
    tipoDeClienteSeleccionado: null,
    ventanaRegistroCliente: false,
    seleccionados: [],
    mensajeError: null,
    limpiarDatos: false,
  }),
  created() {
    this.obtenerTiposDeCliente();
  },
  watch: {
    seleccionados: {
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
          this.alerta = this.seleccionados.length === 0;
          const errorField = document.querySelector(".error--text");
          if (errorField) {
            errorField.scrollIntoView(false, {
              behavior: "smooth",
              block: "start",
              inline: "nearest",
            });
          }
        } else {
          this.registrarOrdenDeVenta();
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
    obtenerClientes(cambio) {
      if (cambio) {
        this.clienteSeleccionado = null;
        this.loading = true;
        this.inactivo = true;
      }
      const tipoCliente =
        this.tipoDeClienteSeleccionado === 1 ? "empresariales" : "personales";
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
    registrarOrdenDeVenta() {
      if (this.alerta) {
        return;
      }
      const imprimir = this.imprimir ? "1" : "0";
      this.mensajeError = null;
      this.alerta = false;
      this.botonCargando = true;
      this.$api({
        method: "post",
        url: "ordenes-de-venta/registrar-orden-de-venta/" + imprimir,
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
          this.reiniciarDatos(this.ordenDeVenta);
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
      const cantidades = [];
      const preciosUnitarios = [];
      const suministros = [];
      const datos = {
        id_cliente: this.clienteSeleccionado,
        id_tipo_de_orden: 3,
        precio_total: this.ordenDeVenta.precioTotal,
        monto_cancelado: this.ordenDeVenta.montoCancelado,
        observaciones_orden_de_venta: this.ordenDeVenta.descripcion,
      };
      this.seleccionados.forEach(function (suministro) {
        suministros.push(suministro.id_suministro);
        cantidades.push(suministro.cantidad);
        preciosUnitarios.push(suministro.precio_unitario_suministro);
      });

      datos.suministros = suministros;
      datos.precios = preciosUnitarios;
      datos.cantidades = cantidades;
      return datos;
    },
    reiniciarDatos(obj) {
      for (const key in obj) {
        if (typeof obj[key] === "object" && obj[key] !== null) {
          this.reiniciarDatos(obj[key]);
        } else {
          obj[key] = null;
        }
      }
      this.clienteSeleccionado = null;
      this.tipoDeClienteSeleccionado = null;
      this.limpiarDatos = true;
      this.seleccionados = [];
    },
    establecerNuevoCliente(cliente) {
      this.tipoDeClienteSeleccionado = cliente.id_tipo_de_cliente;
      this.obtenerClientes(false);
      this.clienteSeleccionado = cliente.id_cliente;
      this.ventanaRegistroCliente = false;
      this.$toast.success("Cliente registrado correctamente.");
    },
    establecerSuministros(suministros, total) {
      if (total === "0.00") {
        this.ordenDeVenta.precioTotal = null;
      } else {
        this.ordenDeVenta.precioTotal = total;
      }
      if (
        suministros.length > 0 &&
        suministros.every((suministro) => suministro.cantidad)
      ) {
        this.seleccionados = suministros;
      } else {
        this.seleccionados = [];
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
