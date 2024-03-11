<template>
  <div>
    <form v-if="datosCliente">
      <v-row>
        <v-col cols="12" md="4">
          <ValidationProvider name="Razón social" rules="required" v-slot="{ errors }">
            <v-text-field
              v-model="datosCliente.razonSocial"
              label="Razón social"
              outlined
              prepend-icon="mdi-account-box"
              color="blue darken-4"
              :error-messages="obtenerValidaciones(errors, 'clienteEmpresarial.razon_social_cliente')"
            />
          </ValidationProvider>
        </v-col>
        <v-col cols="12" md="4">
          <ValidationProvider name="NIT" rules="required|numeric" v-slot="{ errors }">
            <v-text-field
              v-model="datosCliente.nit"
              label="NIT"
              outlined
              prepend-icon="mdi-account-box"
              color="blue darken-4"
              :error-messages="obtenerValidaciones(errors, 'clienteEmpresarial.nit_cliente')"
            />
          </ValidationProvider>
        </v-col>
        <v-col cols="12" md="4">
          <ValidationProvider name="Tipo de empresa" rules="required" v-slot="{ errors }">
            <v-select
              v-model="datosCliente.tipoEmpresa"
              outlined
              :items="tiposDeEmpresa"
              item-text="tipo_empresa"
              item-value="id_tipo_de_empresa"
              label="Tipo de empresa"
              persistent-hint
              prepend-icon="mdi-office-building"
              :error-messages="errors"
            />
          </ValidationProvider>
        </v-col>
        <v-col cols="12" md="2" align-self="start">
          <ValidationProvider vid="personaContacto">
            <v-checkbox
              v-model="personaContacto"
              label="Persona de contacto"
              style="margin-top: 5px"
            ></v-checkbox>
          </ValidationProvider>
        </v-col>
        <v-col cols="12" md="5" v-if="personaContacto">
          <ValidationProvider name="Nombre" rules="required_if:personaContacto,true" v-slot="{ errors }">
            <v-text-field
              v-model="datosCliente.personaContacto"
              label="Nombre de persona de contacto"
              outlined
              prepend-icon="mdi-account-box"
              color="blue darken-4"
              :error-messages="obtenerValidaciones(errors, 'persona_contacto_cliente')"
            />
          </ValidationProvider>
        </v-col>
        <v-col cols="12" md="5" v-if="personaContacto">
          <ValidationProvider name="Número de celular" rules="required_if:personaContacto,true" v-slot="{ errors }">
            <v-text-field
              v-model="datosCliente.telefonoPersonaContacto"
              label="Celular de persona de contacto"
              outlined
              prepend-icon="mdi-cellphone"
              color="blue darken-4"
              :error-messages="obtenerValidaciones(errors, 'numero_contacto_cliente')"
            />
          </ValidationProvider>
        </v-col>
      </v-row>
    </form>
  </div>
</template>

<script>
export default {
  name: 'RegistrarClienteEmpresarial',
  props: {
    clienteEmpresarial: Object,
    obtenerValidaciones: Function
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
    }
  }
}
</script>
