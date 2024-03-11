<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card class="elevation-10">
          <v-card-title>
            <v-row>
              <v-col cols="12" md="10">
                <h3 style="word-break: normal" class="text-center text-md-left">
                  Datos del suministro
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
            <v-container v-if="!overlay">
              <v-list>
                <v-list-item>
                  <v-row>
                    <v-col cols="12" md="4" class="text-start text-md-end">
                      <v-list-item-content>
                        <v-list-item-title class="font-weight-black">Tipo: </v-list-item-title>
                      </v-list-item-content>
                    </v-col>
                    <v-col cols="12" md="8" class="text-center">
                      <v-list-item-content>
                        <v-list-item-title>{{ suministro.tipo_de_suministro.tipo_suministro }}</v-list-item-title>
                      </v-list-item-content>
                    </v-col>
                  </v-row>
                </v-list-item>

                <v-divider></v-divider>

                <v-list-item>
                  <v-row>
                    <v-col cols="12" md="4" class="text-start text-md-end">
                      <v-list-item-content>
                        <v-list-item-title class="font-weight-black">Descripcion: </v-list-item-title>
                      </v-list-item-content>
                    </v-col>
                    <v-col cols="12" md="8" class="text-center">
                      <v-list-item-content>
                        <v-list-item-title>{{ suministro.descripcion_suministro }}</v-list-item-title>
                      </v-list-item-content>
                    </v-col>
                  </v-row>
                </v-list-item>

                <v-divider></v-divider>

                <v-list-item>
                  <v-row>
                    <v-col cols="12" md="4" class="text-start text-md-end">
                      <v-list-item-content>
                        <v-list-item-title class="font-weight-black">Codigo: </v-list-item-title>
                      </v-list-item-content>
                    </v-col>
                    <v-col cols="12" md="8" class="text-center">
                      <v-list-item-content>
                        <v-list-item-title>{{ suministro.codigo_suministro }}</v-list-item-title>
                      </v-list-item-content>
                    </v-col>
                  </v-row>
                </v-list-item>

                <v-divider></v-divider>

                <v-list-item>
                  <v-row>
                    <v-col cols="12" md="4">
                      <v-list-item-content class="text-start text-md-end">
                        <v-list-item-title class="font-weight-black">Unidad de medida: </v-list-item-title>
                      </v-list-item-content>
                    </v-col>
                    <v-col cols="12" md="8" class="text-center">
                      <v-list-item-content>
                        <v-list-item-title>{{ suministro.unidad_de_medida.unidad_de_medida }}</v-list-item-title>
                      </v-list-item-content>
                    </v-col>
                  </v-row>
                </v-list-item>

                <v-divider></v-divider>

                <v-list-item>
                  <v-row>
                    <v-col cols="12" md="4" class="text-start text-md-end">
                      <v-list-item-content>
                        <v-list-item-title class="font-weight-black">Stock actual: </v-list-item-title>
                      </v-list-item-content>
                    </v-col>
                    <v-col cols="12" md="8" class="text-center">
                      <v-list-item-content>
                        <v-list-item-title>{{ suministro.saldo_suministro + " " + suministro.unidad_de_medida.unidad_de_medida }}</v-list-item-title>
                      </v-list-item-content>
                    </v-col>
                  </v-row>
                </v-list-item>
              </v-list>
            </v-container>
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
          <v-card-text v-if="suministro.caracteristicas && !suministro.caracteristicas.length > 0">
            <h3 class="text-center">Sin caracteristicas registradas</h3>
          </v-card-text>
          <v-card-text v-else>
            <v-container>
              <v-list>
                <div v-for="(elemento, index) in suministro.caracteristicas"
                :key="index">
                  <v-list-item
                    >
                    <v-row>
                      <v-col cols="12" md="4" class="text-start text-md-end">
                        <v-list-item-content>
                          <v-list-item-title class="font-weight-black">{{ elemento.caracteristica + ":" }}</v-list-item-title>
                        </v-list-item-content>
                      </v-col>
                      <v-col cols="12" md="8" class="text-center">
                        <v-list-item-content>
                          <v-list-item-title>{{ elemento.pivot.valor_caracteristica }}</v-list-item-title>
                        </v-list-item-content>
                      </v-col>
                    </v-row>
                  </v-list-item>
                  <v-divider></v-divider>
                </div>
              </v-list>
            </v-container>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-card class="elevation-10 fill-height">
          <v-card-title>
            <v-container class="elevation-4">
              <v-row>
                <v-col cols="12">
                  <h4 class="text-center">Datos adicionales</h4>
                </v-col>
              </v-row>
            </v-container>
          </v-card-title>
          <v-card-text>
            <v-card-text>
              <v-tabs v-model="tab" grow class="elevation-4 mb-3">
                <v-tab href="#tab-1">
                  <v-icon>mdi-package-down</v-icon>
                  Ingresos
                </v-tab>
                <v-tab href="#tab-2">
                  <v-icon>mdi-package-up</v-icon>
                  Egresos
                </v-tab>
              </v-tabs>
              <v-tabs-items v-model="tab">
                <v-tab-item value="tab-1">
                  <ingresos />
                </v-tab-item>
                <v-tab-item value="tab-2">
                  <egresos />
                </v-tab-item>
              </v-tabs-items>
            </v-card-text>
          </v-card-text>
        </v-card>
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
import ingresos from '../../components/Suministro/Ingreso/Listado.vue'
import egresos from '../../components/Suministro/Egreso/Listado.vue'
export default {
  name: 'DatosSuministro',
  components: {
    ingresos,
    egresos
  },
  data: () => ({
    overlay: true,
    loadingSelect: true,
    suministro: [],
    tab: null
  }),
  created () {
    this.obtenerSuministro()
  },
  methods: {
    obtenerSuministro () {
      this.$api({
        method: 'get',
        url: 'suministros/obtener-datos-suministro/' + this.$route.params.id,
        headers: { Authorization: 'Bearer ' + localStorage.token }
      }).then((response) => {
        this.suministro = response.data.suministro
        this.overlay = false
      })
    }
  }
}
</script>
