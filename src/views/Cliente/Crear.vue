<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card class="elevation-10">
          <v-card-title>
            <v-row>
              <v-col cols="12" md="10">
                <h3 style="word-break: normal" class="text-center text-md-left">
                  Registrar nuevo cliente
                </h3>
              </v-col>
              <v-col cols="12" md="2" class="text-center text-md-end">
                <v-btn
                  block
                  color="error"
                  :to="{ name: 'Listado de clientes' }"
                >
                  <v-icon left>mdi-arrow-left</v-icon>
                  Atras
                </v-btn>
              </v-col>
            </v-row>
          </v-card-title>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-card class="elevation-10">
          <ValidationObserver v-slot="{ handleSubmit }" ref="obs">
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
                <v-col cols="12">
                  <v-row>
                    <v-col cols="12" md="4">
                      <ValidationProvider name="Tipo de cliente" rules="required" v-slot="{ errors }">
                        <v-select
                          v-model="selecciontipoCliente"
                          outlined
                          :items="tiposDeCliente"
                          item-text="tipo_cliente"
                          item-value="id_tipo_de_cliente"
                          persistent-hint
                          label="Tipo de cliente"
                          prepend-icon="mdi-account-group"
                          @change="reiniciarFormulario"
                          :error-messages="obtenerValidaciones(errors, 'id_tipo_de_cliente')"
                        />
                      </ValidationProvider>
                    </v-col>
                    <v-col cols="12" md="4">
                      <ValidationProvider name="Número de teléfono/celular" rules="required|numeric|min:6" v-slot="{ errors }">
                        <v-text-field
                          v-model="cliente.telefono"
                          label="Número de teléfono/celular"
                          outlined
                          prepend-icon="mdi-badge-account"
                          color="blue darken-4"
                          :error-messages="obtenerValidaciones(errors, 'cliente.telefono_cliente')"
                        />
                      </ValidationProvider>
                    </v-col>
                    <v-col cols="12" md="4">
                      <ValidationProvider name="Correo electrónico" rules="required" v-slot="{ errors }">
                        <v-text-field
                          v-model="cliente.correo"
                          label="Correo electrónico"
                          outlined
                          prepend-icon="mdi-badge-account"
                          color="blue darken-4"
                          :error-messages="obtenerValidaciones(errors, 'cliente.correo_cliente')"
                        />
                      </ValidationProvider>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12">
                  <template v-if="selecciontipoCliente === 2">
                    <registrar-cliente-personal
                      :clientePersonal="clientePersonal"
                      :obtenerValidaciones="obtenerValidaciones"
                    />
                  </template>
                  <template v-if="selecciontipoCliente === 1">
                    <registrar-cliente-empresarial
                      :clienteEmpresarial="clienteEmpresarial"
                      :obtenerValidaciones="obtenerValidaciones"
                    />
                  </template>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn
                :loading="botonCargando"
                color="green"
                class="white--text"
                @click="handleSubmit(registrarCliente)"
              >
                Registrar
              </v-btn>
            </v-card-actions>
          </ValidationObserver>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import RegistrarClientePersonal from '../../components/Cliente/Registrar/RegistrarClientePersonal.vue'
import RegistrarClienteEmpresarial from '../../components/Cliente/Registrar/RegistrarClienteEmpresarial.vue'
export default {
  name: 'CrearCliente',
  components: { RegistrarClientePersonal, RegistrarClienteEmpresarial },
  data: () => ({
    cliente: {
      tipoCliente: null,
      telefono: null,
      correo: null
    },
    clienteEmpresarial: {
      razonSocial: null,
      nit: null,
      tipoEmpresa: null,
      personaContacto: null,
      telefonoPersonaContacto: null
    },
    clientePersonal: {
      nombre: null,
      apellidoPaterno: null,
      apellidoMaterno: null,
      carnetDeIdentidad: null
    },
    tiposDeCliente: [],
    selecciontipoCliente: null,
    errores: [],
    botonCargando: false,
    respuestaServidor: null,
    validacionServidor: false
  }),
  created () {
    this.obtenerTiposDeCliente()
  },
  methods: {
    obtenerTiposDeCliente () {
      this.$api({
        method: 'get',
        url: 'clientes/obtener-tipos-cliente',
        headers: { Authorization: 'Bearer ' + localStorage.token }
      }).then((response) => {
        this.tiposDeCliente = response.data.tiposDeCliente
      })
    },
    registrarCliente () {
      this.botonCargando = true
      this.$api({
        method: 'post',
        url: 'clientes/registrar-cliente/0',
        headers: { Authorization: 'Bearer ' + localStorage.token },
        data: this.generarDatos()
      })
        .then((response) => {
          this.errores = []
          this.reiniciarFormulario()
          this.respuestaServidor = response.data.mensaje
          this.$store.commit('recargarDatos')
        })
        .catch((error) => {
          this.validacionServidor = true
          this.errores = error.response.data.errors
        }).finally(() => {
          this.botonCargando = false
          this.activarNotificacion()
        })
    },
    generarDatos () {
      const datos = {
        cliente: {
          id_tipo_de_cliente: this.selecciontipoCliente,
          telefono_cliente: this.cliente.telefono,
          correo_cliente: this.cliente.correo
        }
      }
      if (this.selecciontipoCliente === 1) {
        datos.clienteEmpresarial = {
          id_tipo_de_empresa: this.clienteEmpresarial.tipoEmpresa,
          razon_social_cliente: this.clienteEmpresarial.razonSocial,
          nit_cliente: this.clienteEmpresarial.nit
        }
        if (this.clienteEmpresarial.personaContacto && this.clienteEmpresarial.telefonoPersonaContacto) {
          datos.clienteEmpresarial.persona_contacto_cliente = this.clienteEmpresarial.personaContacto
          datos.clienteEmpresarial.numero_contacto_cliente = this.clienteEmpresarial.telefonoPersonaContacto
        }
      } else {
        datos.clientePersonal = {
          nombre_cliente: this.clientePersonal.nombre,
          apellido_paterno_cliente: this.clientePersonal.apellidoPaterno,
          apellido_materno_cliente: this.clientePersonal.apellidoMaterno,
          carnet_identidad_cliente: this.clientePersonal.carnetDeIdentidad
        }
      }
      return datos
    },

    reiniciarFormulario () {
      this.reiniciarDatos(this.cliente)
      this.$refs.obs.reset()
      this.selecciontipoCliente === 1
        ? this.reiniciarDatos(this.clienteEmpresarial)
        : this.reiniciarDatos(this.clientePersonal)
    },

    reiniciarDatos (obj) {
      for (const key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          this.reiniciarDatos(obj[key])
        } else {
          obj[key] = null
        }
      }
    },
    activarNotificacion () {
      if (Object.keys(this.errores).length > 0) {
        const mensaje = 'No se pudo completar la acción, por favor verifique los errores.'
        this.$toast.error(mensaje)
      } else {
        this.validacionServidor = false
        this.$refs.obs.reset()
        this.$toast.success(this.respuestaServidor)
      }
    },
    obtenerValidaciones (errors, field) {
      const veeErrors = errors || []
      const serverErrors = this.errores[field] || []
      return [...veeErrors, ...serverErrors]
    }
  }
}
</script>
