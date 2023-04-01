<template>
  <div>
    <form>
      <v-row>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="datosCliente['cliente_empresarial'].razon_social_cliente"
            label="Razon social"
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
            v-model="datosCliente['cliente_empresarial'].nit_cliente"
            label="NIT"
            outlined
            prepend-icon="mdi-numeric"
            color="blue darken-4"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-select
            v-model="datosCliente['cliente_empresarial'].id_tipo_de_empresa"
            label="Tipo de empresa"
            outlined
            prepend-icon="mdi-briefcase-account"
            :items="tiposDeEmpresa"
            item-text="tipo_empresa"
            item-value="id_tipo_de_empresa"
            color="blue darken-4"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="datosCliente['cliente_empresarial'].persona_contacto_cliente"
            label="Nombre de persona de contacto"
            outlined
            prepend-icon="mdi-account-box"
            color="blue darken-4"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            v-model="datosCliente['cliente_empresarial'].numero_contacto_cliente"
            label="Celular de persona de contacto"
            outlined
            prepend-icon="mdi-cellphone"
            color="blue darken-4"
          />
        </v-col>
      </v-row>
    </form>
  </div>
</template>

<script>
export default {
  name: 'EditarClienteEmpresarial',
  props: {
    cliente: Object
  },
  data: () => ({
    tiposDeEmpresa: [],
    datosCliente: null
  }),

  created () {
    this.datosCliente = this.cliente
    this.obtenerTiposDeEmpresa()
  },

  methods: {
    obtenerTiposDeEmpresa () {
      this.$api({
        method: 'get',
        url: 'clientes/obtener-tipos-empresa',
        headers: { Authorization: 'Bearer ' + localStorage.token }
      }).then((response) => {
        this.tiposDeEmpresa = response.data.tiposDeEmpresa
      })
    }
  }
}
</script>
