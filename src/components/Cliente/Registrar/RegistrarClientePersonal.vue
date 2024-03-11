<template>
  <div>
    <form v-if="datosCliente">
      <v-row>
        <v-col cols="12" md="4">
          <ValidationProvider name="Nombre(s)" rules="required" v-slot="{ errors }">
            <v-text-field
              v-model="datosCliente.nombre"
              label="Nombre(s)"
              outlined
              prepend-icon="mdi-account-box"
              color="blue darken-4"
              :error-messages="errors"
            />
          </ValidationProvider>
        </v-col>
        <v-col cols="12" md="4">
          <ValidationProvider name="Apellido paterno" rules="required" v-slot="{ errors }">
            <v-text-field
              v-model="datosCliente.apellidoPaterno"
              label="Apellido paterno"
              outlined
              prepend-icon="mdi-account-box"
              color="blue darken-4"
              :error-messages="errors"
            />
          </ValidationProvider>
        </v-col>
        <v-col cols="12" md="4">
          <ValidationProvider name="Apellido materno" rules="required" v-slot="{ errors }">
            <v-text-field
              v-model="datosCliente.apellidoMaterno"
              label="Apellido materno"
              outlined
              prepend-icon="mdi-account-box"
              color="blue darken-4"
              :error-messages="errors"
            />
          </ValidationProvider>
        </v-col>
        <v-col cols="12" md="4">
          <ValidationProvider name="Carnet de identidad" rules="required|numeric|min:6" v-slot="{ errors }">
            <v-text-field
              v-model="datosCliente.carnetDeIdentidad"
              label="Carnet de identidad"
              outlined
              prepend-icon="mdi-numeric"
              color="blue darken-4"
              :error-messages="obtenerValidaciones(errors, 'clientePersonal.carnet_identidad_cliente')"
            />
          </ValidationProvider>
        </v-col>
      </v-row>
    </form>
  </div>
</template>

<script>
export default {
  name: 'RegistrarClientePersonal',
  props: {
    clientePersonal: Object,
    obtenerValidaciones: Function
  },
  data: () => ({
    datosCliente: null
  }),

  created () {
    this.datosCliente = this.clientePersonal
  }
}
</script>
