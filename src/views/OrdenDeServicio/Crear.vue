<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card class="elevation-10">
          <v-card-title>
            <v-row>
              <v-col cols="12" md="10">
                <h3 style="word-break: normal" class="text-center text-md-left">
                  Registrar nueva orden de servicio
                </h3>
              </v-col>
              <v-col cols="12" md="2" class="text-center text-md-end">
                <v-btn
                  block
                  color="error"
                  :to="{ name: 'Listado de ordenes de servicio' }"
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
                          :loading="elementosCargando.selectTiposDeCliente"
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
                        name="Tipo de servicio"
                        rules="required"
                        v-slot="{ errors }"
                      >
                        <v-select
                          v-model="ordenDeServicio.tipoDeServicio"
                          label="Tipo de servicio"
                          outlined
                          prepend-icon="mdi-briefcase-account"
                          :items="tiposDeServicio"
                          item-text="tipo_de_servicio"
                          item-value="id_tipo_de_servicio"
                          :loading="elementosCargando.selectTiposDeCliente"
                          color="blue darken-4"
                          :error-messages="
                            obtenerValidaciones(errors, 'id_tipo_de_cliente')
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
                          v-model="ordenDeServicio.detalles"
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
                        rules="required|min_value:1"
                        v-slot="{ errors }"
                      >
                        <v-text-field
                          v-model="ordenDeServicio.precioTotal"
                          label="Precio total"
                          outlined
                          prepend-icon="mdi-cash-multiple"
                          color="blue darken-4"
                          suffix="Bs"
                          :error-messages="obtenerValidaciones(errors, 'total')"
                        />
                      </ValidationProvider>
                    </v-col>
                    <v-col cols="12" md="4">
                      <ValidationProvider
                        name="Monto cancelado"
                        :rules="
                          'required|double:2|min_value:0|max_value:' +
                          ordenDeServicio.precioTotal
                        "
                        v-slot="{ errors }"
                      >
                        <v-text-field
                          v-model="ordenDeServicio.montoCancelado"
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
import { impresionService } from "@/services/impresion";

export default {
  name: "CrearOrdenDeVenta",
  components: {
    RegistrarNuevoCliente,
  },
  data: () => ({
    elementosCargando: {
      selectTiposDeCliente: false,
      selectTiposDeServicio: false,
    },
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
    ordenDeServicio: {
      tipoDeServicio: null,
      detalles: null,
      precioTotal: null,
      montoCancelado: null,
    },
    tiposDeCliente: [],
    tipoDeClienteSeleccionado: null,
    ventanaRegistroCliente: false,
    mensajeError: null,
    tiposDeServicio: [],
  }),
  created() {
    this.obtenerTiposDeCliente();
    this.obtenerTiposDeServicios();
  },
  methods: {
    enviarFormulario() {
      this.$refs.obs.validate().then((valid) => {
        if (!valid) {
          const errorField = document.querySelector(".error--text");
          if (errorField) {
            errorField.scrollIntoView(false, {
              behavior: "smooth",
              block: "start",
              inline: "nearest",
            });
          }
        } else {
          this.registrarOrdenDeServicio();
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
        this.elementosCargando.selectTiposDeCliente = false;
      });
    },
    obtenerTiposDeServicios() {
      this.$api({
        method: "get",
        url: "tipos-de-servicios/obtener-tipos-de-servicio",
        headers: { Authorization: "Bearer " + localStorage.token },
      }).then((response) => {
        this.tiposDeServicio = response.data.tiposDeServicio;
        this.elementosCargando.selectTiposDeServicio = false;
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
    registrarOrdenDeServicio() {
      const imprimir = this.imprimir ? "1" : "0";
      this.mensajeError = null;
      this.alerta = false;
      this.botonCargando = true;
      this.$api({
        method: "post",
        url: "ordenes-de-servicio/registrar-orden-de-servicio/" + imprimir,
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
      return {
        id_cliente: this.clienteSeleccionado,
        id_tipo_de_servicio: this.ordenDeServicio.tipoDeServicio,
        id_tipo_de_orden: 2,
        precio_total: this.ordenDeServicio.precioTotal,
        monto_cancelado: this.ordenDeServicio.montoCancelado,
        detalles_orden_de_servicio: this.ordenDeServicio.detalles,
      };
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
    },
    establecerNuevoCliente(cliente) {
      this.tipoDeClienteSeleccionado = cliente.id_tipo_de_cliente;
      this.obtenerClientes(false);
      this.clienteSeleccionado = cliente.id_cliente;
      this.ventanaRegistroCliente = false;
      this.$toast.success("Cliente registrado correctamente.");
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
      impresionService.imprimirReciboConSuministros(
        this.datosImpresion.datosRecibo,
        this.datosImpresion.suministros
      );
    },
  },
};
</script>
