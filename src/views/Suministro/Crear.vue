<template>
  <v-card elevation="5" class="rounded-lg">
    <v-card-title>
      <v-container class="elevation-4">
        <v-row>
          <v-col cols="12" lg="6">
            <h3 style="word-break: normal" class="text-center text-md-left"> Registrar nuevo suministro </h3>
          </v-col>
        </v-row>
      </v-container>
    </v-card-title>
    <v-card-text>
      <v-form>
        <v-container>
          <v-alert
            v-if="errores.length !== 0"
            outlined
            prominent
            type="error"
            elevation="2"
            text
            class="mb-8"
          >
            Por favor, corrija los siguientes errores
            <ul>
              <li v-for="(item, index) in errores" :key="index">
                {{ item[0] }}
              </li>
            </ul>
          </v-alert>
          <v-row>
            <v-col cols="12" md="6">
              <v-card elevation="5" class="rounded-lg fill-height">
                <v-card-title class="mb-3">
                  <v-container class="elevation-4">
                    <v-row align="center" justify="center">
                      <v-col cols="12" lg="6">
                        <h4 class="text-center"> Datos generales </h4>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-title>
                <v-card-text>
                  <v-row justify="center" align="center">
                    <v-col cols="10">
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
                      />
                    </v-col>
                    <v-col cols="10">
                      <v-text-field
                        v-model="suministro.descripcion"
                        label="Nombre/Descripcion del suministro"
                        outlined
                        prepend-icon="mdi-account-box"
                        color="blue darken-4"
                      />
                    </v-col>
                    <v-col cols="10">
                      <v-text-field
                        v-model="suministro.precioUnitario"
                        label="Precio unitario de venta"
                        outlined
                        prepend-icon="mdi-cash-multiple"
                        color="blue darken-4"
                      />
                    </v-col>
                    <v-col cols="10">
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
                      />
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" md="6">
              <v-card elevation="5" class="rounded-lg fill-height">
                <v-card-title class="mb-3">
                  <v-container class="elevation-4">
                    <v-row align="center" justify="center">
                      <v-col cols="12" lg="6">
                        <h4 class="text-center"> Caracteristicas </h4>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col cols="12" md="12">
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
                      />
                    </v-col>
                  </v-row>
                  <v-row v-for="(item, index) in caracteristicasSeleccionadas" :key="index">
                    <v-col cols="4" md="4">
                      <v-subheader class="black--text font-weight-bold">
                        {{ item.caracteristica }}:
                      </v-subheader>
                    </v-col>
                    <v-col cols="8" md="8">
                      <v-text-field
                        v-model="item.valor"
                        label="Valor de la caracteristica"
                        outlined
                        color="blue darken-4"
                      />
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-card-text>
    <v-card-actions class="mb-2 mr-2">
      <v-spacer />
      <v-btn
        color="error"
        class="ml-2"
        :to="{ name: 'Listado de suministros' }"
      >
        Atras
      </v-btn>
      <v-btn
        color="green"
        class="white--text"
        :loading="botonCargando"
        @click="registrarSuministro()"
      >
        Registrar
      </v-btn>
    </v-card-actions>
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
<style>
.my-text-field .v-text-field__details {
  display: none;
}
</style>
<script>
export default {
  name: 'CrearSuministro',
  data: () => ({
    alerta: false,
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
    caracteristicasSeleccionadas: []
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
      this.botonCargando = true
      this.$api({
        method: 'post',
        url: 'suministros/registrar-suministro',
        headers: { Authorization: 'Bearer ' + localStorage.token },
        data: this.generarDatos()
      })
        .then((response) => {
          this.botonCargando = false
          this.errores = []
          this.respuestaServidor = response.data.mensaje
        })
        .catch((error) => {
          this.botonCargando = false
          this.errores = error.response.data.errors
        }).finally(() => {
          this.reiniciarDatos(this.suministro)
          this.caracteristicasSeleccionadas = []
          this.alerta = true
          this.$store.commit('recargarDatos')
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
    }
  }
}
</script>
