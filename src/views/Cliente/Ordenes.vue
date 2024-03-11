<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card class="elevation-10">
          <v-card-title>
            <v-row>
              <v-col cols="12" md="10">
                <h3 style="word-break: normal" class="text-center text-md-left">
                  Ordenes generadas por el cliente
                </h3>
              </v-col>
              <v-col cols="12" md="2" class="text-center text-md-end">
                <v-btn
                  block
                  color="error"
                  :to="{ name: 'Listado de clientes' }"
                >
                  <v-icon left>mdi-arrow-left</v-icon>
                  Atras
                </v-btn>
              </v-col>
            </v-row>
          </v-card-title>
        </v-card>
      </v-col>
      <v-col>
        <v-card class="elevation-10">
          <v-card-text>
            <v-tabs
              v-model="tab"
              show-arrows
              grow
              class="elevation-5 mb-4"
            >
              <v-tabs-slider color="blue"></v-tabs-slider>
              <v-tab href="#tab-1" class="grow">
                <v-icon>mdi-package-down</v-icon>
                Ordenes de trabajo
              </v-tab>
              <v-tab href="#tab-2" class="grow">
                <v-icon>mdi-package-up</v-icon>
                Ordenes de servicio
              </v-tab>
              <v-tab href="#tab-3" class="grow">
                <v-icon>mdi-package-up</v-icon>
                Ordenes de venta
              </v-tab>
            </v-tabs>
            <v-tabs-items v-model="tab">
              <v-tab-item value="tab-1">
                <ordenes-de-trabajo />
              </v-tab-item>
              <v-tab-item value="tab-2">
                <ordenes-de-servicio />
              </v-tab-item>
              <v-tab-item value="tab-3">
                <ordenes-de-venta />
              </v-tab-item>
            </v-tabs-items>
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
import ordenesDeTrabajo from '@/components/Cliente/OrdenesDelCliente/OrdenesDeTrabajo.vue'
import ordenesDeServicio from '@/components/Cliente/OrdenesDelCliente/OrdenesDeServicio.vue'
import ordenesDeVenta from '@/components/Cliente/OrdenesDelCliente/OrdenesDeVenta.vue'
export default {
  name: 'OrdenesDeCliente',
  components: { ordenesDeTrabajo, ordenesDeServicio, ordenesDeVenta },
  data: () => ({
    overlay: false,
    loadingSelect: true,
    tab: null
  })
}
</script>
