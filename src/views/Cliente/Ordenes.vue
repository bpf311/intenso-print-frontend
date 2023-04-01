<template>
  <v-card elevation="5" class="rounded-lg">
    <v-card-title>
      <v-container class="elevation-4">
        <v-row>
          <v-col cols="12" lg="6">
            <h3 class="text-center text-md-left"> Ordenes generadas por el cliente </h3>
          </v-col>
        </v-row>
      </v-container>
    </v-card-title>
    <v-card-text>
      <v-tabs>
        <v-tab>
          <v-icon>mdi-package-down</v-icon>
          Ordenes de trabajo
        </v-tab>
        <v-tab>
          <v-icon>mdi-package-up</v-icon>
          Ordenes de servicio
        </v-tab>
        <v-tab>
          <v-icon>mdi-package-up</v-icon>
          Ordenes de venta
        </v-tab>
        <v-tab-item>
          <ordenes-de-trabajo />
        </v-tab-item>
        <v-tab-item>
          <ordenes-de-servicio />
        </v-tab-item>
      </v-tabs>
    </v-card-text>
    <v-card-actions class="mb-2 mr-2">
      <v-spacer />
      <v-btn
        color="error"
        class="ml-2"
        :to="{ name: 'Listado de clientes' }"
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
import ordenesDeTrabajo from '@/components/Cliente/OrdenesDelCliente/OrdenesDeTrabajo.vue'
import ordenesDeServicio from '@/components/Cliente/OrdenesDelCliente/OrdenesDeServicio.vue'
export default {
  name: 'OrdenesDeCliente',
  components: { ordenesDeTrabajo, ordenesDeServicio },
  data: () => ({
    overlay: false,
    loadingSelect: true
  })
}
</script>
