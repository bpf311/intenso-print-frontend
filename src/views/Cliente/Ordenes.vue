<template>
  <v-card elevation="5" class="rounded-lg">
    <v-card-title>
      <v-container class="elevation-4">
        <v-row>
          <v-col cols="12" lg="6">
            <h3 class="text-center text-md-left"> Ordenes generadas por el cliente </h3>
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="12" lg="2">
            <v-btn
              color="error"
              block
              :to="{ name: 'Listado de clientes' }"
            >
              Atras
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card-title>
    <v-card-text>
      <v-tabs v-model="tab" fixed-tabs class="elevation-4 mb-3">
        <v-tab href="#tab-1">
          <v-icon>mdi-package-down</v-icon>
          Ordenes de trabajo
        </v-tab>
        <v-tab href="#tab-2">
          <v-icon>mdi-package-up</v-icon>
          Ordenes de servicio
        </v-tab>
        <v-tab href="#tab-3">
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
      </v-tabs-items>
    </v-card-text>
    <v-overlay :value="overlay" absolute dark opacity="0.8" color="#212121">
      <v-progress-circular indeterminate :size="90" :width="8">
        Cargando
      </v-progress-circular>
    </v-overlay>
  </v-card>
</template>
<script>
import ordenesDeTrabajo from '@/components/Cliente/OrdenesDelCliente/OrdenesDeTrabajo.vue'
import ordenesDeServicio from '@/components/Cliente/OrdenesDelCliente/OrdenesDeServicio.vue'
export default {
  name: 'OrdenesDeCliente',
  components: { ordenesDeTrabajo, ordenesDeServicio },
  data: () => ({
    overlay: false,
    loadingSelect: true,
    tab: null
  })
}
</script>
