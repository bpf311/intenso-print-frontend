<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card class="elevation-10">
          <v-card-title>
            <v-row>
              <v-col cols="12" md="10">
                <h3 style="word-break: normal" class="text-center text-md-left">
                  Registrar ingreso de suministro
                </h3>
              </v-col>
              <v-col cols="12" md="2" class="text-center text-md-end">
                <v-btn
                  block
                  color="error"
                  :to="{ name: 'Listado de suministros' }"
                >
                  <v-icon left>mdi-arrow-left </v-icon>
                  Atras
                </v-btn>
              </v-col>
            </v-row>
          </v-card-title>
        </v-card>
      </v-col>
      <v-col cols="12">
        <ValidationObserver v-slot="{ handleSubmit }" ref="obs">
          <v-row>
            <v-col cols="12" md="6">
              <v-card class="fill-height elevation-10">
                <v-card-title>
                  <v-container class="elevation-4">
                    <v-row>
                      <v-col cols="12">
                        <h4 class="text-center">Proveedor</h4>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-title>
                <v-card-text>
                  <v-alert
                    v-if="validacionServidor"
                    outlined
                    prominent
                    type="error"
                    elevation="2"
                    text
                    class="mb-8"
                  >
                    Por favor, revise y corrija cualquier error identificado a continuación:
                    <ul>
                      <li v-for="(item, index) in errores" :key="index">
                        {{ item[0] }}
                      </li>
                    </ul>
                  </v-alert>
                  <v-row>
                    <v-col cols="12">
                      <ValidationProvider name="Proveedor" rules="required" v-slot="{ errors }">
                        <v-select
                          v-model="ingreso.proveedor"
                          label="Proveedor"
                          outlined
                          prepend-icon="mdi-office-building"
                          :items="proveedores"
                          item-text="razon_social_proveedor"
                          item-value="id_proveedor"
                          color="blue darken-4"
                          :loading="loadingSelect"
                          :error-messages="obtenerValidaciones(errors, 'id_proveedor')"
                        />
                      </ValidationProvider>
                    </v-col>
                    <v-col cols="12">
                      <ValidationProvider name="Tipo de documento" rules="required" v-slot="{ errors }">
                        <v-select
                          v-model="ingreso.tipoDocumento"
                          label="Tipo de documento"
                          outlined
                          prepend-icon="mdi-office-building"
                          :items="tiposDeDocumentos"
                          item-text="tipo_de_documento"
                          item-value="id_tipo_de_documento"
                          color="blue darken-4"
                          :loading="loadingSelect"
                          :error-messages="obtenerValidaciones(errors, 'id_tipo_de_documento')"
                        />
                      </ValidationProvider>
                    </v-col>
                    <v-col cols="12">
                      <ValidationProvider name="Número de documento" rules="required" v-slot="{ errors }">
                        <v-text-field
                          v-model="ingreso.numeroDocumento"
                          label="Numero del documento"
                          outlined
                          prepend-icon="mdi-package-variant-closed-plus"
                          color="blue darken-4"
                          :error-messages="obtenerValidaciones(errors, 'numero_documento')"
                        />
                      </ValidationProvider>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" md="6">
              <v-card class="fill-height elevation-10">
                <v-card-title>
                  <v-container class="elevation-4">
                    <v-row>
                      <v-col cols="12">
                        <h4 class="text-center">Suministro</h4>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col cols="12">
                      <ValidationProvider name="Cantidad" rules="required|numeric|min_value:1" v-slot="{ errors }">
                        <v-text-field
                          v-model="ingreso.cantidad"
                          label="Cantidad de suministro a ingresar"
                          outlined
                          prepend-icon="mdi-package-variant-closed-plus"
                          color="blue darken-4"
                          :error-messages="obtenerValidaciones(errors, 'cantidad')"
                          @input="obtenerPrecioUnitario"
                        />
                      </ValidationProvider>
                    </v-col>
                    <v-col cols="12">
                      <ValidationProvider name="Precio total" rules="required|numeric|min_value:1" v-slot="{ errors }">
                        <v-text-field
                          v-model="ingreso.precioTotal"
                          label="Total pagado por el suministro"
                          outlined
                          prepend-icon="mdi-package-variant-closed-plus"
                          color="blue darken-4"
                          :error-messages="obtenerValidaciones(errors, 'total_pagado')"
                          @input="obtenerPrecioUnitario"
                        />
                      </ValidationProvider>
                    </v-col>
                    <v-col cols="12">
                      <ValidationProvider name="Precio unitario" rules="required|double:2|min_value:1" v-slot="{ errors }">
                        <v-text-field
                          v-model="ingreso.precioUnitario"
                          label="Precio unitario del suministro"
                          outlined
                          prepend-icon="mdi-package-variant-closed-plus"
                          color="blue darken-4"
                          :error-messages="obtenerValidaciones(errors, 'total_unitario')"
                        />
                      </ValidationProvider>
                    </v-col>
                  </v-row>
                </v-card-text>
                <v-card-actions>
                  <v-spacer />
                  <v-btn
                    color="green"
                    class="white--text"
                    :loading="botonCargando"
                    @click="handleSubmit(registrarIngresoSuministro)"
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
  </v-container>
</template>

<script>
import suministro from '../../commons/tableHeaders/suministro'

export default {
  name: 'CrearIngresoSuministro',
  data: () => ({
    respuestaServidor: null,
    alerta: false,
    botonCargando: false,
    loadingSelect: true,
    proveedores: [],
    tiposDeDocumentos: [],
    errores: [],
    ingreso: {
      suministro: null,
      proveedor: null,
      tipoDocumento: null,
      numeroDocumento: null,
      cantidad: null,
      precioTotal: null,
      precioUnitario: null
    },
    validacionServidor: false
  }),
  created () {
    this.obtenerProveedores()
    this.obtenerTiposDeDocumentos()
  },
  methods: {
    suministro () {
      return suministro
    },
    obtenerPrecioUnitario () {
      if (this.ingreso.cantidad === null || this.ingreso.precioTotal === null) return
      this.ingreso.precioUnitario = (this.ingreso.precioTotal / this.ingreso.cantidad).toFixed(2)
    },
    obtenerProveedores () {
      this.$api({
        method: 'get',
        url: 'proveedores/obtener-proveedores',
        headers: { Authorization: 'Bearer ' + localStorage.token }
      }).then((response) => {
        this.proveedores = response.data.proveedores
        this.loadingSelect = false
      })
    },
    obtenerTiposDeDocumentos () {
      this.$api({
        method: 'get',
        url: 'tipos-de-documentos/obtener-tipos-de-documentos',
        headers: { Authorization: 'Bearer ' + localStorage.token }
      }).then((response) => {
        this.tiposDeDocumentos = response.data.tiposDeDocumentos
        this.loadingSelect = false
      })
    },
    registrarIngresoSuministro () {
      this.botonCargando = true
      this.$api({
        method: 'post',
        url: 'ingresos-de-suministros/registrar-ingreso-de-suministro',
        headers: { Authorization: 'Bearer ' + localStorage.token },
        data: this.generarDatos()
      })
        .then((response) => {
          this.reiniciarDatos(this.ingreso)
          this.errores = []
          this.respuestaServidor = response.data.mensaje
          this.$store.commit('recargarDatos')
        })
        .catch((error) => {
          this.validacionServidor = true
          this.errores = error.response.data.errors
        }).finally(() => {
          this.botonCargando = false
          this.activarNotificacion()
        })
    },
    generarDatos () {
      return {
        id_suministro: this.$route.params.id,
        id_proveedor: this.ingreso.proveedor,
        id_tipo_de_documento: this.ingreso.tipoDocumento,
        numero_documento: this.ingreso.numeroDocumento,
        cantidad_ingreso: this.ingreso.cantidad,
        precio_total_ingreso: this.ingreso.precioTotal,
        precio_unitario_ingreso: this.ingreso.precioUnitario
      }
    },
    reiniciarDatos (obj) {
      for (const key in obj) {
        if (key === 'proveedor') {
          obj[key] = {}
        }
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          this.reiniciarDatos(obj[key])
        } else {
          obj[key] = null
        }
      }
    },
    activarNotificacion () {
      if (Object.keys(this.errores).length > 0) {
        const mensaje = 'No se pudo completar la acción, por favor verifique los errores.'
        this.$toast.error(mensaje)
      } else {
        this.validacionServidor = false
        this.$refs.obs.reset()
        this.$toast.success(this.respuestaServidor)
      }
    },
    obtenerValidaciones (errors, field) {
      const veeErrors = errors || []
      const serverErrors = this.errores[field] || []
      return [...veeErrors, ...serverErrors]
    }
  }
}
</script>
