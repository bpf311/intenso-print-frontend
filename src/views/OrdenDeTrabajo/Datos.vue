<template>
  <v-card elevation="5" class="rounded-lg">
    <v-card-title>
      <v-container class="elevation-4">
        <v-row>
          <v-col cols="12" lg="6">
            <h3 class="text-center text-md-left">
              Datos de la orden de trabajo
            </h3>
          </v-col>
        </v-row>
      </v-container>
    </v-card-title>
    <v-card-text v-if="ordenDeTrabajo.orden">
      <v-row>
        <v-col cols="12" md="6">
          <v-card class="fill-height">
            <v-card-title>
              <v-container class="elevation-4">
                <v-row>
                  <v-col cols="12" lg="6">
                    <h4 class="text-center text-md-left">Cliente</h4>
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
        <v-col cols="12" md="6">
          <v-card class="fill-height">
            <v-card-title>
              <v-container class="elevation-4">
                <v-row>
                  <v-col cols="12" lg="6">
                    <h4 class="text-center text-md-left">Orden de trabajo</h4>
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
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-card class="fill-height">
            <v-card-title>
              <v-container class="elevation-4">
                <v-row>
                  <v-col cols="12" md="7">
                    <h4 class="text-center text-md-left">
                      Suministros asignados
                    </h4>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-title>
            <v-card-text>
              <v-simple-table class="elevation-4">
                <thead>
                  <tr>
                    <th>Suministro</th>
                    <th>Precio unitario</th>
                    <th>Cantidad</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="item in ordenDeTrabajo.orden.suministros"
                    :key="item.id_suministro"
                  >
                    <td>{{ item.descripcion_suministro }}</td>
                    <td>{{ item.pivot.precio_unitario_suministro }}</td>
                    <td>{{ item.pivot.cantidad_prevista_suministro }}</td>
                    <td>
                      {{
                        (
                          item.pivot.precio_unitario_suministro *
                          item.pivot.cantidad_prevista_suministro
                        ).toFixed(2)
                      }}
                      Bs
                    </td>
                  </tr>
                </tbody>
              </v-simple-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions class="mb-2 mr-2">
      <v-spacer />
      <v-btn
        color="error"
        class="ml-2"
        :to="{ name: 'Listado de ordenes de trabajo' }"
      >
        Atras
      </v-btn>
    </v-card-actions>
    <v-overlay :value="overlay" absolute dark opacity="0.8" color="#212121">
      <v-progress-circular indeterminate :size="90" :width="8">
        Cargando
      </v-progress-circular>
    </v-overlay>
  </v-card>
</template>

<script>
export default {
  name: 'DatosOrdenDeTrabajo',
  data: () => ({
    overlay: true,
    ordenDeTrabajo: [],
    suministros: []
  }),
  created () {
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
    }
  }
}
</script>
