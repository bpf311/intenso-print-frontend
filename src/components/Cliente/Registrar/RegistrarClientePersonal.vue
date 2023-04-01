<template>
  <div>
    <form v-if="datosCliente">
      <v-row>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="datosCliente.nombre"
            label="Nombre"
            outlined
            prepend-icon="mdi-account-box"
            color="blue darken-4"
          />
        </v-col>

        <v-col cols="12" md="4">
          <v-text-field
            v-model="datosCliente.apellidoPaterno"
            label="Apellido paterno"
            outlined
            prepend-icon="mdi-account-box"
            color="blue darken-4"
          />
        </v-col>

        <v-col cols="12" md="4">
          <v-text-field
            v-model="datosCliente.apellidoMaterno"
            label="Apellido materno"
            outlined
            prepend-icon="mdi-account-box"
            color="blue darken-4"
          />
        </v-col>

        <v-col cols="12" md="4">
          <v-text-field
            v-model="datosCliente.carnetDeIdentidad"
            label="Carnet de identidad"
            outlined
            prepend-icon="mdi-numeric"
            color="blue darken-4"
          />
        </v-col>
      </v-row>
    </form>
  </div>
</template>

<script>
export default {
  name: 'RegistrarClientePersonal',
  props: {
    clientePersonal: Object
  },
  data: () => ({
    datosCliente: null
  }),

  created () {
    this.datosCliente = this.clientePersonal
  }
}
</script>
