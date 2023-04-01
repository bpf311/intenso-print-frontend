<template>
  <div>
    <form v-if="datosCliente">
      <v-row>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="datosCliente.razonSocial"
            label="Razon social"
            outlined
            prepend-icon="mdi-account-box"
            color="blue darken-4"
          />
        </v-col>

        <v-col cols="12" md="4">
          <v-text-field
            v-model="datosCliente.nit"
            label="NIT"
            outlined
            prepend-icon="mdi-account-box"
            color="blue darken-4"
          />
        </v-col>

        <v-col cols="12" md="4">
          <v-select
            v-model="datosCliente.tipoEmpresa"
            outlined
            :items="tiposDeEmpresa"
            item-text="tipo_empresa"
            item-value="id_tipo_de_empresa"
            label="Tipo de empresa"
            persistent-hint
            prepend-icon="mdi-office-building"
          />
        </v-col>

        <v-col cols="12" md="2" align-self="start">
          <v-checkbox
            v-model="personaContacto"
            label="Persona de contacto"
            style="margin-top: 5px"
          ></v-checkbox>
        </v-col>

        <v-col cols="12" md="5" v-if="personaContacto">
          <v-text-field
            v-model="datosCliente.personaContacto"
            label="Nombre de persona de contacto"
            outlined
            prepend-icon="mdi-account-box"
            color="blue darken-4"
          />
        </v-col>

        <v-col cols="12" md="5" v-if="personaContacto">
          <v-text-field
            v-model="datosCliente.telefonoPersonaContacto"
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
  name: 'RegistrarClienteEmpresarial',
  props: {
    clienteEmpresarial: Object
  },
  data: () => ({
    personaContacto: false,
    datosCliente: null,
    tiposDeEmpresa: []
  }),

  watch: {
    personaContacto (nuevoValor) {
      if (!nuevoValor) {
        this.datosCliente.personaContacto = null
        this.datosCliente.telefonoPersonaContacto = null
      }
    }
  },

  created () {
    this.obtenerTiposDeEmpresa()
    this.datosCliente = this.clienteEmpresarial
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
    },
    enviarDatos () {
      const clienteEmpresarial = {
        id_tipo_cliente: 1,
        razon_social_cliente: this.clienteEmpresarial.razonSocial,
        nit_cliente: this.clienteEmpresarial.nit,
        id_tipo_empresa: this.clienteEmpresarial.tipoEmpresa,
        telefono_cliente: this.clienteEmpresarial.telefono,
        correo_cliente: this.clienteEmpresarial.correo
      }
      if (this.personaContacto) {
        clienteEmpresarial.persona_contacto_cliente = this.datosPersonaContacto.personaContacto
        clienteEmpresarial.numero_contacto_cliente = this.datosPersonaContacto.telefonoPersonaContacto
      }
      this.$emit('datosEnviados', clienteEmpresarial)
    }
  }
}
</script>
