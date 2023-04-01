<template>
  <v-card elevation="5" class="rounded-lg">
    <v-card-title>
      <v-container class="elevation-4">
        <v-row>
          <v-col cols="12" lg="6">
            <h3 class="text-center text-md-left"> Datos de la orden de trabajo </h3>
          </v-col>
        </v-row>
      </v-container>
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12" md="6">
          <v-card class="fill-height">
            <v-card-title>
              <v-container class="elevation-4">
                <v-row>
                  <v-col cols="12" lg="6">
                    <h3 class="text-center text-md-left"> Cliente </h3>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-title>
            <v-card-text v-if="ordenDeTrabajo.cliente.id_tipo_de_cliente === 1">
              <v-row
                v-if="!overlay"
                justify="center"
                class="black--text px-3 mt-3"
              >
                <v-col cols="5">
                  <h3 class="font-weight-black">Nombre/Razon social:</h3>
                </v-col>
                <v-col cols="7">
                  <p class="text-body-1 font-weight-regular">
                    {{ suministro.tipo_de_suministro.tipo_suministro }}
                  </p>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-text v-if="ordenDeTrabajo.cliente.id_tipo_de_cliente === 2">
              <v-row
                v-if="!overlay"
                justify="center"
                class="black--text px-3 mt-3"
              >
                <v-col cols="5">
                  <h3 class="font-weight-black">Nombre/Razon social:</h3>
                </v-col>
                <v-col cols="7">
                  <p class="text-body-1 font-weight-regular">
                    {{ suministro.tipo_de_suministro.tipo_suministro }}
                  </p>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-card class="fill-height">
            <v-card-title>
              <v-container class="elevation-4">
                <v-row>
                  <v-col cols="12" lg="6">
                    <h3 class="text-center text-md-left"> Caracteristicas </h3>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-title>
            <v-card-text v-if="suministro.caracteristicas && !suministro.caracteristicas.length > 0">
              <h3 class="text-center">Sin caracteristicas registradas</h3>
            </v-card-text>
            <v-card-text v-else>
              <v-row
                v-for="(elemento, index) in suministro.caracteristicas"
                :key="index"
                class="black--text px-3 mt-3"
              >
                <v-col cols="5">
                  <h3 class="font-weight-black">
                    {{ elemento.caracteristica + ":" }}
                  </h3>
                </v-col>
                <v-col cols="7">
                  <p class="text-body-1 font-weight-regular">
                    {{ elemento.pivot.valor_caracteristica }}
                  </p>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title>
              <v-container class="elevation-4">
                <v-row>
                  <v-col cols="12" lg="6">
                    <h3 class="text-center text-md-left"> Datos adicionales </h3>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-title>
            <v-card-text>
              <v-tabs>
                <v-tab>
                  <v-icon>mdi-package-down</v-icon>
                  Ingresos
                </v-tab>
                <v-tab>
                  <v-icon>mdi-package-up</v-icon>
                  Egresos
                </v-tab>
                <v-tab-item>
                  <ingresos />
                </v-tab-item>
              </v-tabs>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
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
    </v-card-actions>

    <v-overlay :value="overlay" absolute dark opacity="0.8" color="#212121">
      <v-progress-circular indeterminate :size="90" :width="8">
        Cargando
      </v-progress-circular>
    </v-overlay>
  </v-card>
</template>
<script>
import ingresos from '../../components/Suministro/Ingreso/Listado.vue'
export default {
  name: 'DatosSuministro',
  components: { ingresos },
  data: () => ({
    overlay: true,
    loadingSelect: true,
    ordenDeTrabajo: {}
  }),
  created () {
    this.obtenerDatosOrdenDeTrabajo()
  },
  methods: {
    obtenerDatosOrdenDeTrabajo () {
      this.$api({
        method: 'get',
        url: 'ordenes-de-trabajo/editar-orden-de-trabajo/' + this.$route.params.id,
        headers: { Authorization: 'Bearer ' + localStorage.token }
      }).then((response) => {
        this.ordenDeTrabajo = response.data.ordenDeTrabajo
        this.overlay = false
      })
    }
  }
}
</script>
