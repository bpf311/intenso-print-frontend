<template>
  <v-card elevation="5" class="rounded-lg">
    <v-card-title>
      <v-container class="elevation-4">
        <v-row>
          <v-col cols="12" lg="6">
            <h3 class="text-center text-md-left"> Editar datos del cliente </h3>
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
            <template v-if="tipoCliente === 1">
              <editar-cliente-empresarial
                :cliente="cliente"
                v-if="cliente"
              />
            </template>
            <template v-if="tipoCliente === 2">
              <editar-cliente-personal
                :cliente="cliente"
                v-if="cliente"
              />
            </template>
          </v-row>
        </v-container>
      </v-form>
    </v-card-text>
    <v-card-actions class="mb-2 mr-2">
      <v-spacer />
      <v-btn color="error" class="ml-2" :to="{ name: 'Listado de clientes' }">
        Atras
      </v-btn>
      <v-btn :loading="botonCargando" color="success" class="mr-0" @click="modificarCliente()">
        Modificar
      </v-btn>
    </v-card-actions>
    <v-overlay :value="overlay" absolute dark opacity="0.8" color="#212121">
      <v-progress-circular indeterminate :size="90" :width="8">
        Cargando
      </v-progress-circular>
    </v-overlay>
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
import EditarClienteEmpresarial from '../../components/Cliente/Editar/EditarClienteEmpresarial.vue'
import EditarClientePersonal from '../../components/Cliente/Editar/EditarClientePersonal.vue'
export default {
  name: 'EditarCliente',
  components: { EditarClienteEmpresarial, EditarClientePersonal },
  data: () => ({
    overlay: true,
    botonCargando: false,
    respuestaServidor: null,
    alerta: false,
    tiposDeEmpresa: [],
    errores: [],
    cliente: null
  }),
  computed: {
    tipoCliente: function () {
      return this.$route.params.tipoCliente
    }
  },

  created () {
    this.obtenerCliente()
  },

  methods: {
    obtenerCliente () {
      this.$api({
        method: 'get',
        url: 'clientes/editar-cliente/' + this.$route.params.id + '/' + this.$route.params.tipoCliente,
        headers: { Authorization: 'Bearer ' + localStorage.token }
      }).then((response) => {
        this.cliente = response.data.cliente
        this.overlay = false
      })
    },

    modificarCliente () {
      this.botonCargando = true
      this.$api({
        method: 'put',
        url: 'clientes/modificar-cliente/' + this.$route.params.id + '/' + this.$route.params.tipoCliente,
        headers: { Authorization: 'Bearer ' + localStorage.token },
        data: this.generarDatos()
      })
        .then((response) => {
          this.botonCargando = false
          this.errores = []
          this.respuestaServidor = response.data.mensaje
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
          id_tipo_de_cliente: this.cliente.id_tipo_de_cliente,
          telefono_cliente: this.cliente.telefono_cliente,
          correo_cliente: this.cliente.correo_cliente
        }
      }
      if (this.cliente.id_tipo_de_cliente === 1) {
        datos.clienteEmpresarial = {
          id_tipo_de_empresa: this.cliente.cliente_empresarial.id_tipo_de_empresa,
          razon_social_cliente: this.cliente.cliente_empresarial.razon_social_cliente,
          nit_cliente: this.cliente.cliente_empresarial.nit_cliente,
          persona_contacto_cliente: this.cliente.cliente_empresarial.persona_contacto_cliente === ''
            ? 'Sin especificar'
            : this.cliente.cliente_empresarial.persona_contacto_cliente,
          numero_contacto_cliente: this.cliente.cliente_empresarial.numero_contacto_cliente === ''
            ? 'Sin especificar'
            : this.cliente.cliente_empresarial.numero_contacto_cliente
        }
      } else {
        datos.clientePersonal = {
          nombre_cliente: this.cliente.cliente_personal.nombre_cliente,
          apellido_paterno_cliente: this.cliente.cliente_personal.apellido_paterno_cliente,
          apellido_materno_cliente: this.cliente.cliente_personal.apellido_materno_cliente,
          carnet_identidad_cliente: this.cliente.cliente_personal.carnet_identidad_cliente
        }
      }
      return datos
    }
  }
}
</script>
