<template>
  <v-row>
    <v-col cols="12">
      <ValidationObserver v-slot="{ handleSubmit }" ref="obs">
        <v-row>
          <v-col cols="12" md="6">
            <v-card class="fill-height elevation-10 d-flex flex-column">
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
                <v-alert
                  v-if="validacionServidor"
                  outlined
                  prominent
                  type="error"
                  elevation="2"
                  text
                  class="mb-8"
                >
                  Por favor, revise y corrija cualquier error identificado a continuación:
                  <ul>
                    <li v-for="(item, index) in errores" :key="index">
                      {{ item[0] }}
                    </li>
                  </ul>
                </v-alert>
                <v-row>
                  <v-col cols="12" md="6">
                    <ValidationProvider name="Razón social" rules="required" v-slot="{ errors }">
                      <v-text-field
                        v-model="datosCliente['cliente_empresarial'].razon_social_cliente"
                        label="Razón social"
                        outlined
                        prepend-icon="mdi-account-box"
                        color="blue darken-4"
                        :error-messages="obtenerValidaciones(errors, 'clienteEmpresarial.razon_social_cliente')"
                      />
                    </ValidationProvider>
                  </v-col>
                  <v-col cols="12" md="6">
                    <ValidationProvider name="Número de teléfono/celular" rules="required|numeric|min:6" v-slot="{ errors }">
                      <v-text-field
                        v-model="datosCliente.telefono_cliente"
                        label="Número de teléfono/celular"
                        outlined
                        prepend-icon="mdi-cellphone"
                        color="blue darken-4"
                        :error-messages="obtenerValidaciones(errors, 'cliente.telefono_cliente')"
                      />
                    </ValidationProvider>
                  </v-col>
                  <v-col cols="12" md="6">
                    <ValidationProvider name="Correo electrónico" rules="required" v-slot="{ errors }">
                      <v-text-field
                        v-model="datosCliente.correo_cliente"
                        label="Correo electrónico"
                        outlined
                        prepend-icon="mdi-email"
                        color="blue darken-4"
                        :error-messages="obtenerValidaciones(errors, 'cliente.correo_cliente')"
                      />
                    </ValidationProvider>
                  </v-col>
                  <v-col cols="12" md="6">
                    <ValidationProvider name="NIT" rules="required|numeric" v-slot="{ errors }">
                      <v-text-field
                        v-model="datosCliente['cliente_empresarial'].nit_cliente"
                        label="NIT"
                        outlined
                        prepend-icon="mdi-numeric"
                        color="blue darken-4"
                        :error-messages="obtenerValidaciones(errors, 'clienteEmpresarial.nit_cliente')"
                      />
                    </ValidationProvider>
                  </v-col>
                  <v-col cols="12">
                    <ValidationProvider name="Tipo de empresa" rules="required" v-slot="{ errors }">
                      <v-select
                        v-model="datosCliente['cliente_empresarial'].id_tipo_de_empresa"
                        label="Tipo de empresa"
                        outlined
                        prepend-icon="mdi-briefcase-account"
                        :items="tiposDeEmpresa"
                        item-text="tipo_empresa"
                        item-value="id_tipo_de_empresa"
                        color="blue darken-4"
                        :error-messages="errors"
                      />
                    </ValidationProvider>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="6">
            <v-card class="fill-height elevation-10 d-flex flex-column">
              <v-card-title>
                <v-container class="elevation-4">
                  <v-row>
                    <v-col cols="12">
                      <h4 class="text-center">Persona de contacto</h4>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="datosCliente['cliente_empresarial'].persona_contacto_cliente"
                      label="Nombre de persona de contacto"
                      outlined
                      prepend-icon="mdi-account-box"
                      color="blue darken-4"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="datosCliente['cliente_empresarial'].numero_contacto_cliente"
                      label="Celular de persona de contacto"
                      outlined
                      prepend-icon="mdi-cellphone"
                      color="blue darken-4"
                    />
                  </v-col>
                </v-row>
              </v-card-text>
              <v-container class="mt-auto">
                <v-card-actions>
                  <v-spacer/>
                  <v-btn
                    :loading="botonCargando"
                    color="green"
                    class="white--text"
                    @click="handleSubmit(modificarCliente)"
                    :block="$vuetify.breakpoint.xsOnly"
                  >
                    Modificar
                  </v-btn>
                </v-card-actions>
              </v-container>
            </v-card>
          </v-col>
        </v-row>
      </ValidationObserver>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'EditarClienteEmpresarial',
  props: {
    cliente: Object,
    botonCargando: Boolean,
    modificarCliente: Function,
    obtenerValidaciones: Function,
    validacionServidor: Boolean,
    errores: [Object, Array]
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
