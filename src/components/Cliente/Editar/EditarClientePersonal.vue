<template>
  <div>
    <form>
      <v-row>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="datosCliente['cliente_personal'].nombre_cliente"
            label="Nombre"
            outlined
            prepend-icon="mdi-account-box"
            color="blue darken-4"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="datosCliente['cliente_personal'].apellido_paterno_cliente"
            label="Apellido paterno"
            outlined
            prepend-icon="mdi-account-box"
            color="blue darken-4"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="datosCliente['cliente_personal'].apellido_materno_cliente"
            label="Apellido materno"
            outlined
            prepend-icon="mdi-account-box"
            color="blue darken-4"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="datosCliente.telefono_cliente"
            label="Celular"
            outlined
            prepend-icon="mdi-cellphone"
            color="blue darken-4"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="datosCliente.correo_cliente"
            label="Correo"
            outlined
            prepend-icon="mdi-email"
            color="blue darken-4"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="datosCliente['cliente_personal'].carnet_identidad_cliente"
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
  name: 'EditarClientePersonal',
  props: {
    cliente: Object
  },
  data: () => ({
    datosCliente: null
  }),

  created () {
    this.datosCliente = this.cliente
  }
}
</script>
