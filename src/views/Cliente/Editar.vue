<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card class="elevation-10">
          <v-card-title>
            <v-row>
              <v-col cols="12" md="10">
                <h3 style="word-break: normal" class="text-center text-md-left">
                  Editar datos del cliente
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
        <v-row>
          <v-col cols="12" v-if="tipoCliente === 1">
            <editar-cliente-empresarial
              :cliente="cliente"
              v-if="cliente"
              :botonCargando="botonCargando"
              :modificarCliente="modificarCliente"
              :obtenerValidaciones="obtenerValidaciones"
              :validacionServidor="validacionServidor"
              :errores="errores"
              ref="editarClienteEmpresarial"
            />
          </v-col>
          <v-col cols="12" v-if="tipoCliente === 2">
            <editar-cliente-personal
              :cliente="cliente"
              v-if="cliente"
              :botonCargando="botonCargando"
              :modificarCliente="modificarCliente"
              :obtenerValidaciones="obtenerValidaciones"
              :validacionServidor="validacionServidor"
              :errores="errores"
              ref="editarClientePersonal"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-overlay :value="overlay" absolute dark opacity="0.8" color="#212121">
      <v-progress-circular indeterminate :size="90" :width="8">
        Cargando
      </v-progress-circular>
    </v-overlay>
  </v-container>
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
    tiposDeEmpresa: [],
    errores: {},
    cliente: null,
    validacionServidor: false
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
          this.errores = []
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
    },
    activarNotificacion () {
      if (Object.keys(this.errores).length > 0) {
        const mensaje = 'No se pudo completar la acción, por favor verifique los errores.'
        this.$toast.error(mensaje)
      } else {
        this.validacionServidor = false
        if (this.tipoCliente === 1) {
          this.$refs.editarClienteEmpresarial.$refs.obs.reset()
        } else {
          this.$refs.editarClientePersonal.$refs.obs.reset()
        }
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
