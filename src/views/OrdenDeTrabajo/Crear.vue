<template>
  <v-card elevation="5" class="rounded-lg">
    <v-card-title>
      <v-container class="elevation-4">
        <v-row>
          <v-col cols="12" lg="6">
            <h3 class="text-center text-md-left"> Registrar nueva orden de trabajo </h3>
          </v-col>
        </v-row>
      </v-container>
    </v-card-title>
    <v-card-text>
      <v-form>
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
            <ul>
              <li v-for="(item, index) in errores" :key="index">
                {{ item[0] }}
              </li>
            </ul>
          </v-alert>
          <v-row>
            <v-col cols="12" class="pa-4">
              <v-row>
                <v-col cols="12">
                  <v-container class="elevation-4">
                    <v-row>
                      <v-col cols="12">
                        <h3 class="text-center text--black"> Datos generales </h3>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-col>
                <v-col cols="12" md="4">
                  <v-select
                    v-model="tipoDeClienteSeleccionado"
                    label="Tipo de cliente"
                    outlined
                    prepend-icon="mdi-briefcase-account"
                    :items="tiposDeCliente"
                    item-text="text"
                    item-value="id"
                    color="blue darken-4"
                    @change="obtenerClientes()"
                  />
                </v-col>
                <v-col cols="12" md="8">
                  <v-autocomplete
                    v-model="clienteSeleccionado"
                    :items="clientes"
                    item-text="datos_unidos"
                    item-value="id_cliente"
                    prepend-icon="mdi-card-account-details"
                    outlined
                    :loading="loading"
                    :disabled="inactivo"
                    label="Cliente"
                    hint="Seleccione al cliente"
                    persistent-hint
                    clearable
                  />
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="ordenDeTrabajo.descripcion"
                    label="Descripcion del pedido"
                    outlined
                    prepend-icon="mdi-clipboard-list"
                    color="blue darken-4"
                  />
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" class="pa-4">
              <v-row>
                <v-container class="elevation-4 mb-5">
                  <v-row>
                    <v-col cols="12">
                      <h3 class="text-center text--black"> Asignar suministros </h3>
                    </v-col>
                  </v-row>
                </v-container>
                <v-col cols="12">
                  <seleccionar-suministros :suministros="suministros" @seleccionados="obtenerSuministrosSeleccionados"/>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" class="pa-4">
              <v-row>
                <v-container class="elevation-4 mb-5">
                  <v-row>
                    <v-col cols="12">
                      <h3 class="text-center text--black"> Confirmar precio </h3>
                    </v-col>
                  </v-row>
                </v-container>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="ordenDeTrabajo.precioTotal"
                    label="Precio total"
                    outlined
                    prepend-icon="mdi-cash-multiple"
                    color="blue darken-4"
                    suffix="Bs"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="ordenDeTrabajo.montoCancelado"
                    label="Monto cancelado"
                    outlined
                    prepend-icon="mdi-account-cash"
                    color="blue darken-4"
                    suffix="Bs"
                  />
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-card-text>
    <v-card-actions class="mb-2 mr-2">
      <v-spacer />
      <v-btn color="error" class="ml-2" :to="{ name: 'Listado de ordenes de trabajo' }">
        Atras
      </v-btn>
      <v-btn :loading="botonCargando" color="green" class="white--text" @click="registrarOrdenDeTrabajo()">
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
import SeleccionarSuministros from '@/components/OrdenDeTrabajo/SeleccionarSuministros.vue'
export default {
  name: 'CrearOrdenDeTrabajo',
  components: { SeleccionarSuministros },
  data: () => ({
    loading: false,
    inactivo: true,
    botonCargando: false,
    respuestaServidor: null,
    alerta: false,
    clientes: [],
    errores: [],
    clienteSeleccionado: null,
    ordenDeTrabajo: {
      descripcion: null,
      precioTotal: null,
      montoCancelado: null
    },
    suministros: [],
    tiposDeCliente: [
      { id: 'empresariales', text: 'Empresarial' },
      { id: 'personales', text: 'Personal' }
    ],
    tipoDeClienteSeleccionado: null
  }),
  methods: {
    obtenerSuministrosSeleccionados (e) {
      let total = 0
      this.suministros = e
      this.suministros.forEach((elemento) => {
        total = total + elemento.subtotal
      })
      if (total > 0) {
        this.ordenDeTrabajo.precioTotal = total.toFixed(2)
      } else {
        this.ordenDeTrabajo.precioTotal = null
      }
    },
    obtenerClientes () {
      this.clienteSeleccionado = null
      this.loading = true
      this.inactivo = true
      this.$api({
        method: 'get',
        url: 'clientes/obtener-clientes-' + this.tipoDeClienteSeleccionado,
        headers: { Authorization: 'Bearer ' + localStorage.token }
      }).then((response) => {
        this.clientes = response.data.clientes
        this.loading = false
        this.inactivo = false
      })
    },
    registrarOrdenDeTrabajo () {
      this.botonCargando = true
      this.$api({
        method: 'post',
        url: 'ordenes-de-trabajo/registrar-orden-de-trabajo',
        headers: { Authorization: 'Bearer ' + localStorage.token },
        data: this.generarDatos()
      })
        .then((response) => {
          this.botonCargando = false
          this.errores = []
          this.respuestaServidor = response.data.mensaje
        })
        .catch((error) => {
          this.botonCargando = false
          this.errores = error.response.data.errors
        }).finally(() => {
          this.$store.commit('recargarDatos')
          this.clienteSeleccionado = null
          this.suministros = []
          this.reiniciarDatos(this.ordenDeTrabajo)
          this.alerta = true
        })
    },
    generarDatos () {
      const datos = {
        id_cliente: this.clienteSeleccionado,
        id_tipo_de_orden: 1,
        precio_total: this.ordenDeTrabajo.precioTotal,
        monto_cancelado: this.ordenDeTrabajo.montoCancelado,
        descripcion_orden_de_trabajo: this.ordenDeTrabajo.descripcion
      }
      if (this.suministros.length > 0) {
        datos.suministros = this.suministros.map(suministro => suministro.id_suministro)
        datos.cantidades = this.suministros.map(suministro => suministro.cantidad)
      }
      return datos
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
