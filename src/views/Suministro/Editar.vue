<template>
  <v-card elevation="5" class="rounded-lg">
    <v-card-title>
      <v-container class="elevation-4">
        <v-row>
          <v-col cols="12" lg="6">
            <h3 style="word-break: normal" class="text-center text-md-left"> Editar datos del suministro </h3>
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
                    <v-row>
                      <v-col cols="12" lg="6">
                        <h4 class="text-center text-md-left"> Datos generales </h4>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-title>
                <v-card-text>
                  <v-row justify="center" align="center">
                    <v-col cols="10">
                      <v-text-field
                        v-model="suministro.descripcion_suministro"
                        label="Nombre/Descripcion del suministro"
                        outlined
                        prepend-icon="mdi-account-box"
                        color="blue darken-4"
                      />
                    </v-col>
                    <v-col cols="10">
                      <v-text-field
                        v-model="suministro.precio_unitario_suministro"
                        label="Precio unitario de venta"
                        outlined
                        prepend-icon="mdi-cash-multiple"
                        color="blue darken-4"
                      />
                    </v-col>
                    <v-col cols="10">
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
                    <v-row>
                      <v-col cols="12" lg="6">
                        <h4 class="text-center text-md-left"> Caracteristicas </h4>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-title>
                <v-card-text>
                  <v-row justify="center" align="center">
                    <v-col cols="10">
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
                      />
                    </v-col>
                    <v-col cols="11">
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
                          <v-text-field
                            v-model="elemento.valor"
                            label="Valor de la caracteristica"
                            outlined
                            color="blue darken-4"
                          />
                        </v-col>
                      </v-row>
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
        color="success"
        class="mr-0"
        :loading="botonCargando"
        @click="modificarSuministro()"
      >
        Modificar
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
    <v-overlay :value="overlay" absolute dark opacity="0.8" color="#212121">
      <v-progress-circular indeterminate :size="90" :width="8">
        Cargando
      </v-progress-circular>
    </v-overlay>
  </v-card>
</template>
<script>
export default {
  name: 'EditarSuministro',
  data: () => ({
    alerta: false,
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
    tiposDeSuministros: []
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
      this.botonCargando = true
      this.$api({
        method: 'put',
        url: 'suministros/modificar-suministro/' + this.$route.params.id,
        headers: { Authorization: 'Bearer ' + localStorage.token },
        data: this.generarDatos()
      })
        .then((response) => {
          this.botonCargando = false
          this.errores = []
          this.respuestaServidor = response.data.mensaje
          this.alerta = true
          this.$store.commit('recargarDatos')
        })
        .catch((error) => {
          this.botonCargando = false
          this.errores = error.response.data.errors
        })
    },
    generarDatos () {
      return {
        id_unidad_de_medida: this.suministro.id_unidad_de_medida,
        descripcion_suministro: this.suministro.descripcion_suministro,
        precio_unitario_suministro: this.suministro.precio_unitario_suministro,
        caracteristicas: this.caracteristicasRegistradas.map(
          (elemento) => elemento.id || elemento.id_caracteristica
        ),
        valores: this.caracteristicasRegistradas.map(
          (elemento) => elemento.valor
        )
      }
    }
  }
}
</script>
