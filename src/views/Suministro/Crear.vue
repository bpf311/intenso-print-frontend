<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card class="elevation-10">
          <v-card-title>
            <v-row>
              <v-col cols="12" md="10">
                <h3 style="word-break: normal" class="text-center text-md-left">
                  Registrar nuevo suministro
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
              <v-card class="elevation-10 fill-height">
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
                      <ValidationProvider name="Tipo de suministro" rules="seleccion" v-slot="{ errors }">
                        <v-select
                          v-model="suministro.tipoSuministro"
                          label="Tipo de suministro"
                          outlined
                          prepend-icon="mdi-package-variant"
                          :items="tiposDeSuministros"
                          item-text="tipo_suministro"
                          return-object
                          color="blue darken-4"
                          :loading="loadingSelect"
                          :error-messages="errors"
                        />
                      </ValidationProvider>
                    </v-col>
                    <v-col cols="12">
                      <ValidationProvider name="Descripcion" rules="required" v-slot="{ errors }">
                        <v-text-field
                          v-model="suministro.descripcion"
                          label="Nombre/Descripcion del suministro"
                          outlined
                          prepend-icon="mdi-account-box"
                          color="blue darken-4"
                          :error-messages="obtenerValidaciones(errors, 'suministro_existente')"
                        />
                      </ValidationProvider>
                    </v-col>
                    <v-col cols="12">
                      <ValidationProvider name="Precio unitario" rules="required" v-slot="{ errors }">
                        <v-text-field
                          v-model="suministro.precioUnitario"
                          label="Precio unitario de venta"
                          outlined
                          prepend-icon="mdi-cash-multiple"
                          color="blue darken-4"
                          :error-messages="obtenerValidaciones(errors, 'precio_unitario_suministro')"
                        />
                      </ValidationProvider>
                    </v-col>
                    <v-col cols="12">
                      <ValidationProvider name="Unidad de medida" rules="required" v-slot="{ errors }">
                        <v-select
                          v-model="suministro.unidadMedida"
                          label="Unidad de medida"
                          outlined
                          prepend-icon="mdi-package-variant"
                          :items="unidadesDeMedidas"
                          item-text="unidad_de_medida"
                          item-value="id_unidad_de_medida"
                          color="blue darken-4"
                          :loading="loadingSelect"
                          :error-messages="errors"
                        />
                      </ValidationProvider>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" md="6" >
              <v-card class="elevation-10 fill-height d-flex flex-column">
                <v-card-title>
                  <v-container class="elevation-4">
                    <v-row>
                      <v-col cols="12">
                        <h4 class="text-center">Caracteristicas</h4>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col cols="12" md="12">
                      <ValidationProvider name="Caracteristicas" rules="required" v-slot="{ errors }">
                        <v-select
                          v-model="caracteristicasSeleccionadas"
                          label="Seleccione las caracteristicas"
                          :items="caracteristicas"
                          item-text="caracteristica"
                          outlined
                          multiple
                          return-object
                          chips
                          deletable-chips
                          prepend-icon="mdi-list-box-outline"
                          color="blue darken-4"
                          small-chips
                          hide-selected
                          clearable
                          :loading="loadingSelect"
                          :error-messages="obtenerValidaciones(errors, 'suministro_existente')"
                        />
                      </ValidationProvider>
                    </v-col>
                  </v-row>
                  <v-row v-for="(item, index) in caracteristicasSeleccionadas" :key="index">
                    <v-col cols="4" md="4">
                      <v-subheader class="black--text font-weight-bold">
                        {{ item.caracteristica }}:
                      </v-subheader>
                    </v-col>
                    <v-col cols="8" md="8">
                      <ValidationProvider name="Valor" rules="required" v-slot="{ errors }">
                        <v-text-field
                          v-model="item.valor"
                          label="Valor de la caracteristica"
                          outlined
                          color="blue darken-4"
                          :error-messages="obtenerValidaciones(errors, 'valor')"
                        />
                      </ValidationProvider>
                    </v-col>
                  </v-row>
                </v-card-text>
                <v-container class="mt-auto">
                  <v-card-actions>
                    <v-spacer/>
                    <v-btn
                      :loading="botonCargando"
                      color="green"
                      class="white--text"
                      @click="handleSubmit(registrarSuministro)"
                      :block="$vuetify.breakpoint.xsOnly"
                    >
                      Registrar
                    </v-btn>
                  </v-card-actions>
                </v-container>
              </v-card>
            </v-col>
          </v-row>
        </ValidationObserver>
      </v-col>
    </v-row>
  </v-container>
</template>
<style>
.my-text-field .v-text-field__details {
  display: none;
}
</style>
<script>
export default {
  name: 'CrearSuministro',
  data: () => ({
    respuestaServidor: null,
    botonCargando: false,
    loadingSelect: true,
    caracteristicas: [],
    tiposDeSuministros: [],
    unidadesDeMedidas: [],
    errores: [],
    suministro: {
      tipoSuministro: {},
      unidadMedida: null,
      descripcion: null,
      precioUnitario: null
    },
    caracteristicasSeleccionadas: [],
    validacionServidor: false,
    alMenosUnaCaracteristicaSeleccionada: false
  }),

  created () {
    this.obtenerTiposDeSuministros()
    this.obtenerCaracteristicas()
    this.obtenerUnidadesDeMedidas()
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
    obtenerUnidadesDeMedidas () {
      this.$api({
        method: 'get',
        url: 'unidades-de-medidas/obtener-unidades-de-medidas',
        headers: { Authorization: 'Bearer ' + localStorage.token }
      }).then((response) => {
        this.unidadesDeMedidas = response.data.unidades
        this.loadingSelect = false
      })
    },
    obtenerCaracteristicas () {
      this.$api({
        method: 'get',
        url: 'caracteristicas/obtener-caracteristicas',
        headers: { Authorization: 'Bearer ' + localStorage.token }
      }).then((response) => {
        this.caracteristicas = response.data.caracteristicas
        this.loadingSelect = false
      })
    },
    registrarSuministro () {
      if (this.caracteristicasSeleccionadas.length === 0) {
        this.alMenosUnaCaracteristicaSeleccionada = true
        return
      } else {
        this.alMenosUnaCaracteristicaSeleccionada = false
      }
      this.botonCargando = true
      this.$api({
        method: 'post',
        url: 'suministros/registrar-suministro',
        headers: { Authorization: 'Bearer ' + localStorage.token },
        data: this.generarDatos()
      })
        .then((response) => {
          this.errores = []
          this.reiniciarDatos(this.suministro)
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
        id_unidad_de_medida: this.suministro.unidadMedida,
        id_tipo_de_suministro: this.suministro.tipoSuministro.id_tipo_de_suministro,
        descripcion_suministro: this.suministro.descripcion,
        codigo_tipo_suministro: this.suministro.tipoSuministro.codigo_tipo_suministro,
        precio_unitario_suministro: this.suministro.precioUnitario,
        caracteristicas: this.caracteristicasSeleccionadas.map(
          (elemento) => elemento.id_caracteristica
        ),
        valores: this.caracteristicasSeleccionadas.map(
          (elemento) => elemento.valor
        ).filter(
          (elemento) => { return elemento !== undefined }
        )
      }
    },
    reiniciarDatos (obj) {
      for (const key in obj) {
        if (key === 'tipoSuministro') {
          obj[key] = {}
        }
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          this.reiniciarDatos(obj[key])
        } else {
          obj[key] = null
        }
      }
      this.caracteristicasSeleccionadas = []
    },
    activarNotificacion () {
      if (Object.keys(this.errores).length > 0) {
        const mensaje = 'No se pudo completar la acción, por favor verifique los errores.'
        this.$toast.error(mensaje)
      } else {
        this.validacionServidor = false
        this.alMenosUnaCaracteristicaSeleccionada = false
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
