<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card class="elevation-10">
          <v-card-title>
            <v-row>
              <v-col cols="12" md="10">
                <h3 style="word-break: normal" class="text-center text-md-left">
                  Editar datos del suministro
                </h3>
              </v-col>
              <v-col cols="12" md="2" class="text-center text-md-end">
                <v-btn
                  block
                  color="error"
                  :to="{ name: 'Listado de suministros' }"
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
                      <ValidationProvider name="Descripcion" rules="required" v-slot="{ errors }">
                        <v-text-field
                          v-model="suministro.descripcion_suministro"
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
                          v-model="suministro.precio_unitario_suministro"
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
                          v-model="suministro.id_unidad_de_medida"
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
            <v-col cols="12" md="6">
              <v-card class="elevation-10 fill-height">
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
                          v-model="caracteristicasRegistradas"
                          label="Caracteristicas a registrar"
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
                          :menu-props="{ bottom: true, offsetY: true }"
                          :error-messages="obtenerValidaciones(errors, 'suministro_existente')"
                        />
                      </ValidationProvider>
                    </v-col>
                    <v-col cols="12">
                      <v-row
                        v-for="(elemento, index) in caracteristicasRegistradas"
                        :key="index"
                        align-content="center"
                        justify="center"
                      >
                        <v-col cols="4" md="4">
                          <v-subheader class="font-weight-black">
                            {{ elemento.caracteristica }}:
                          </v-subheader>
                        </v-col>
                        <v-col cols="8" md="8">
                          <ValidationProvider name="Valor" rules="required" v-slot="{ errors }">
                            <v-text-field
                              v-model="elemento.valor"
                              label="Valor de la caracteristica"
                              outlined
                              color="blue darken-4"
                              :error-messages="obtenerValidaciones(errors, 'valor')"
                            />
                          </ValidationProvider>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-card-text>
                <v-card-actions class="mb-2 mr-2">
                  <v-spacer />
                  <v-btn
                    color="success"
                    class="mr-0"
                    :loading="botonCargando"
                    @click="handleSubmit(modificarSuministro)"
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
export default {
  name: 'EditarSuministro',
  data: () => ({
    respuestaServidor: null,
    overlay: true,
    botonCargando: false,
    loadingSelect: true,
    roles: [],
    errores: [],
    suministro: [],
    unidadesDeMedidas: [],
    caracteristicas: [],
    caracteristicasRegistradas: [],
    tiposDeSuministros: [],
    validacionServidor: false,
    alMenosUnaCaracteristicaSeleccionada: false
  }),
  created () {
    this.obtenerSuministro()
    this.obtenerTiposDeSuministros()
    this.obtenerUnidadesDeMedidas()
    this.obtenerCaracteristicas()
  },
  methods: {
    obtenerSuministro () {
      this.$api({
        method: 'get',
        url: 'suministros/editar-suministro/' + this.$route.params.id,
        headers: { Authorization: 'Bearer ' + localStorage.token }
      }).then((response) => {
        this.suministro = response.data.suministro
        this.caracteristicasRegistradas =
          response.data.suministro.caracteristicas.map((elemento) => ({
            id: elemento.id_caracteristica,
            caracteristica: elemento.caracteristica,
            valor: elemento.pivot.valor_caracteristica
          }))
        this.overlay = false
      })
    },
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
    modificarSuministro () {
      if (this.caracteristicasRegistradas.length === 0) {
        this.alMenosUnaCaracteristicaSeleccionada = true
        return
      } else {
        this.alMenosUnaCaracteristicaSeleccionada = false
      }
      this.botonCargando = true
      this.$api({
        method: 'put',
        url: 'suministros/modificar-suministro/' + this.$route.params.id,
        headers: { Authorization: 'Bearer ' + localStorage.token },
        data: this.generarDatos()
      })
        .then((response) => {
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
        id_unidad_de_medida: this.suministro.id_unidad_de_medida,
        id_tipo_de_suministro: this.suministro.id_tipo_de_suministro,
        descripcion_suministro: this.suministro.descripcion_suministro,
        precio_unitario_suministro: this.suministro.precio_unitario_suministro,
        caracteristicas: this.caracteristicasRegistradas.map(
          (elemento) => elemento.id || elemento.id_caracteristica
        ),
        valores: this.caracteristicasRegistradas.map(
          (elemento) => elemento.valor
        )
      }
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
