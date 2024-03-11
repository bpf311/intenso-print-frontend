<template>
  <v-row>
    <ValidationObserver v-slot="{ handleSubmit }" ref="obs">
      <v-col cols="12">
        <v-card class="elevation-10 d-flex flex-column">
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
              <v-col cols="12" md="4">
                <ValidationProvider name="Nombre(s)" rules="required" v-slot="{ errors }">
                  <v-text-field
                    v-model="datosCliente['cliente_personal'].nombre_cliente"
                    label="Nombre"
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
                    v-model="datosCliente['cliente_personal'].apellido_paterno_cliente"
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
                    v-model="datosCliente['cliente_personal'].apellido_materno_cliente"
                    label="Apellido materno"
                    outlined
                    prepend-icon="mdi-account-box"
                    color="blue darken-4"
                    :error-messages="errors"
                  />
                </ValidationProvider>
              </v-col>
              <v-col cols="12" md="4">
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
              <v-col cols="12" md="4">
                <ValidationProvider name="Correo electrónico" rules="required" v-slot="{ errors }">
                  <v-text-field
                    v-model="datosCliente.correo_cliente"
                    label="Correo"
                    outlined
                    prepend-icon="mdi-email"
                    color="blue darken-4"
                    :error-messages="obtenerValidaciones(errors, 'cliente.correo_cliente')"
                  />
                </ValidationProvider>
              </v-col>
              <v-col cols="12" md="4">
                <ValidationProvider name="Carnet de identidad" rules="required|numeric|min:6" v-slot="{ errors }">
                  <v-text-field
                    v-model="datosCliente['cliente_personal'].carnet_identidad_cliente"
                    label="Carnet de identidad"
                    outlined
                    prepend-icon="mdi-numeric"
                    color="blue darken-4"
                    :error-messages="obtenerValidaciones(errors, 'clientePersonal.carnet_identidad_cliente')"
                  />
                </ValidationProvider>
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
    </ValidationObserver>
  </v-row>
</template>

<script>
export default {
  name: 'EditarClientePersonal',
  props: {
    cliente: Object,
    botonCargando: Boolean,
    modificarCliente: Function,
    obtenerValidaciones: Function,
    validacionServidor: Boolean,
    errores: [Object, Array]
  },
  data: () => ({
    datosCliente: null
  }),

  created () {
    this.datosCliente = this.cliente
  }
}
</script>
