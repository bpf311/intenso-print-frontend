<template>
  <v-card elevation="5" class="rounded-lg">
    <v-card-title>
      <v-container class="elevation-4">
        <v-row>
          <v-col cols="12" lg="6">
            <h3 class="text-center text-md-left"> Registrar nuevo cliente </h3>
          </v-col>
        </v-row>
      </v-container>
    </v-card-title>
    <v-card-text>
      <v-form class="mt-5">
        <v-container>
          <v-alert
            v-if="errores.length !== 0"
            outlined
            prominent
            type="error"
            elevation="2"
            text
            class="mb-8"
          >
            Por favor, corrija los siguientes errores
            <ul id="example-1">
              <li v-for="(item, index) in errores" :key="index">
                {{ item[0] }}
              </li>
            </ul>
          </v-alert>
          <v-row>
            <v-col cols="12">
              <v-row>
                <v-col cols="12" md="4">
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
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="cliente.telefono"
                    label="Numero de telefono"
                    outlined
                    prepend-icon="mdi-badge-account"
                    color="blue darken-4"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="cliente.correo"
                    label="Direccion de correo"
                    outlined
                    prepend-icon="mdi-badge-account"
                    color="blue darken-4"
                  />
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12">
              <template v-if="selecciontipoCliente === 2">
                <registrar-cliente-personal
                  :clientePersonal="clientePersonal"
                />
              </template>
              <template v-if="selecciontipoCliente === 1">
                <registrar-cliente-empresarial
                  :clienteEmpresarial="clienteEmpresarial"
                />
              </template>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-card-text>
    <v-card-actions class="mb-2 mr-2">
      <v-spacer />
      <v-btn color="error" class="ml-2" :to="{ name: 'Listado de clientes' }">
        Atras
      </v-btn>
      <v-btn
        color="green" class="white--text"
        :loading="botonCargando"
        @click="registrarCliente"
      >
        Registrar
      </v-btn>
    </v-card-actions>
    <v-snackbar
      v-model="alerta"
      :timeout="4000"
      color="success"
      app
      top
      right
    >
      <v-row align="center" justify="center">
        <v-col cols="2">
          <v-icon
            large
            color="white"
          >
            mdi-check-circle-outline
          </v-icon>
        </v-col>
        <v-col cols="10" align-self="center">
          <p class="text-center font-weight-black my-auto">
            {{ respuestaServidor }}
          </p>
        </v-col>
      </v-row>
    </v-snackbar>
  </v-card>
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
    alerta: false
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
        url: 'clientes/registrar-cliente',
        headers: { Authorization: 'Bearer ' + localStorage.token },
        data: this.generarDatos()
      })
        .then((response) => {
          this.botonCargando = false
          this.errores = []
          this.respuestaServidor = response.data.mensaje
          this.reiniciarFormulario()
          this.alerta = true
          this.$store.commit('recargarDatos')
        })
        .catch((error) => {
          this.botonCargando = false
          this.errores = error.response.data.errors
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
    }
  }
}
</script>
