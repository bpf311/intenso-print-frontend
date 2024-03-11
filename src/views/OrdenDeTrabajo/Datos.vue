<template>
  <v-container>
    <v-row v-if="ordenDeTrabajo.orden">
      <v-col cols="12">
        <v-card class="elevation-10">
          <v-card-title>
            <v-row>
              <v-col cols="12" md="10">
                <h3 style="word-break: normal" class="text-center text-md-left">
                  Datos de la orden de trabajo
                </h3>
              </v-col>
              <v-col cols="12" md="2" class="text-center text-md-end">
                <v-btn
                  block
                  color="error"
                  @click="regresar()"
                >
                  <v-icon left>mdi-arrow-left </v-icon>
                  Atras
                </v-btn>
              </v-col>
            </v-row>
          </v-card-title>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="fill-height elevation-10">
          <v-card-title>
            <v-container class="elevation-4">
              <v-row>
                <v-col cols="12">
                  <h4 class="text-center">Orden de trabajo</h4>
                </v-col>
              </v-row>
            </v-container>
          </v-card-title>
          <v-card-text>
            <v-row
              v-if="!overlay"
              justify="center"
              class="black--text px-3 mt-3"
            >
              <v-col cols="5">
                <h3 class="font-weight-black">Código OT:</h3>
              </v-col>
              <v-col cols="7">
                <p class="text-body-1 font-weight-regular">
                  {{ ordenDeTrabajo.codigo_orden_de_trabajo }}
                </p>
              </v-col>
              <v-col cols="5">
                <h3 class="font-weight-black">Descripción:</h3>
              </v-col>
              <v-col cols="7">
                <p class="text-body-1 font-weight-regular">
                  {{ ordenDeTrabajo.descripcion_orden_de_trabajo }}
                </p>
              </v-col>
              <v-col cols="5">
                <h3 class="font-weight-black">Fecha y hora de registro:</h3>
              </v-col>
              <v-col cols="7">
                <p class="text-body-1 font-weight-regular">
                  {{ ordenDeTrabajo.orden.fecha_formateada }}
                </p>
              </v-col>
              <v-col cols="5">
                <h3 class="font-weight-black">Precio total:</h3>
              </v-col>
              <v-col cols="7">
                <p class="text-body-1 font-weight-regular">
                  {{ ordenDeTrabajo.orden.precio_total }} Bs
                </p>
              </v-col>
              <v-col cols="5">
                <h3 class="font-weight-black">Monto inicial cancelado:</h3>
              </v-col>
              <v-col cols="7">
                <p class="text-body-1 font-weight-regular">
                  {{ ordenDeTrabajo.orden.monto_cancelado }} Bs
                </p>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="fill-height elevation-10">
          <v-card-title>
            <v-container class="elevation-4">
              <v-row>
                <v-col cols="12">
                  <h4 class="text-center">Cliente</h4>
                </v-col>
              </v-row>
            </v-container>
          </v-card-title>
          <v-card-text>
            <v-row
              v-if="!overlay"
              justify="center"
              class="black--text px-3 mt-3"
            >
              <v-col cols="5">
                <h3 class="font-weight-black">Razon social:</h3>
              </v-col>
              <v-col cols="7">
                <p class="text-body-1 font-weight-regular">
                  {{
                    ordenDeTrabajo.orden.cliente.cliente_empresarial
                      .razon_social_cliente
                  }}
                </p>
              </v-col>
              <v-col cols="5">
                <h3 class="font-weight-black">NIT:</h3>
              </v-col>
              <v-col cols="7">
                <p class="text-body-1 font-weight-regular">
                  {{
                    ordenDeTrabajo.orden.cliente.cliente_empresarial
                      .nit_cliente
                  }}
                </p>
              </v-col>
              <v-col cols="5">
                <h3 class="font-weight-black">Telefono:</h3>
              </v-col>
              <v-col cols="7">
                <p class="text-body-1 font-weight-regular">
                  {{ ordenDeTrabajo.orden.cliente.telefono_cliente }}
                </p>
              </v-col>
              <v-col cols="5">
                <h3 class="font-weight-black">Correo:</h3>
              </v-col>
              <v-col cols="7">
                <p class="text-body-1 font-weight-regular">
                  {{ ordenDeTrabajo.orden.cliente.correo_cliente }}
                </p>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-card class="fill-height elevation-10">
          <v-card-title>
            <v-container class="elevation-4">
              <v-row>
                <v-col cols="12">
                  <h4 class="text-center">
                    Suministros asignados
                  </h4>
                </v-col>
              </v-row>
            </v-container>
          </v-card-title>
          <v-card-text>
            <v-data-table
              :headers="[
                  {
                    text: 'Suministro',
                    value: 'descripcion_suministro',
                    class: 'blue-grey lighten-4 black--text text--darken-2 font-weight-bold'
                  },
                  {
                    text: 'Precio unitario',
                    value: 'pivot.precio_unitario_suministro',
                    class: 'blue-grey lighten-4 black--text text--darken-2 font-weight-bold'
                  },
                  {
                    text: 'Cantidad',
                    value: 'pivot.cantidad_prevista_suministro',
                    class: 'blue-grey lighten-4 black--text text--darken-2 font-weight-bold'
                  },
                  {
                    text: 'Subtotal',
                    value: 'subtotal',
                    class: 'blue-grey lighten-4 black--text text--darken-2 font-weight-bold'
                  },
                ]"
              :items="ordenDeTrabajo.orden.suministros"
              item-key="id_suministro"
              fixed-header
              height="240px"
            >
              <template v-slot:[`item.subtotal`]="{ item }">
                {{
                  (
                    item.pivot.precio_unitario_suministro *
                    item.pivot.cantidad_prevista_suministro
                  ).toFixed(2)
                }}
                Bs
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
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
export default {
  name: 'DatosOrdenDeTrabajo',
  data: () => ({
    overlay: true,
    ordenDeTrabajo: [],
    suministros: [],
    vistaAnterior: null
  }),
  created () {
    this.vistaAnterior = this.$route.params.vistaAnterior
    this.obtenerDatosOrdenDeTrabajo()
  },
  methods: {
    obtenerDatosOrdenDeTrabajo () {
      this.$api({
        method: 'get',
        url:
          'ordenes-de-trabajo/editar-orden-de-trabajo/' +
          this.$route.params.idOrdenDeTrabajo +
          '/' +
          this.$route.params.tipoCliente,
        headers: { Authorization: 'Bearer ' + localStorage.token }
      }).then((response) => {
        this.ordenDeTrabajo = response.data.ordenDeTrabajo[0]
        this.suministros = response.data.suministros
        this.overlay = false
      })
    },
    regresar () {
      if (this.vistaAnterior === 'Ordenes de cliente') {
        this.$router.push({ name: this.vistaAnterior, params: { id: this.ordenDeTrabajo.orden.id_cliente } })
      } else {
        this.$router.push({ name: this.vistaAnterior })
      }
    }
  }
}
</script>
