<template>
  <v-container>
    <v-row v-if="ordenDeVenta">
      <v-col cols="12">
        <v-card class="elevation-10">
          <v-card-title>
            <v-row>
              <v-col cols="12" md="10">
                <h3 style="word-break: normal" class="text-center text-md-left">
                  Datos de la orden de venta
                </h3>
              </v-col>
              <v-col cols="12" md="2" class="text-center text-md-end">
                <v-btn block color="error" @click="regresar()">
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
                  <h4 class="text-center">Orden de venta</h4>
                </v-col>
              </v-row>
            </v-container>
          </v-card-title>
          <v-card-text v-if="!overlay">
            <v-list>
              <v-list-item>
                <v-row>
                  <v-col cols="12" md="4" class="text-start text-md-end">
                    <v-list-item-content>
                      <v-list-item-title class="font-weight-black text-wrap"
                        >Código OV:
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-col>
                  <v-col cols="12" md="8" class="text-center">
                    <v-list-item-content>
                      <v-list-item-title>{{
                        ordenDeVenta.codigo_orden_de_venta
                      }}</v-list-item-title>
                    </v-list-item-content>
                  </v-col>
                </v-row>
              </v-list-item>

              <v-divider></v-divider>

              <v-list-item>
                <v-row>
                  <v-col cols="12" md="4" class="text-start text-md-end">
                    <v-list-item-content>
                      <v-list-item-title class="font-weight-black text-wrap"
                        >Descripción:
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-col>
                  <v-col cols="12" md="8" class="text-center">
                    <v-list-item-content>
                      <v-list-item-title>{{
                        ordenDeVenta.observaciones_orden_de_venta
                      }}</v-list-item-title>
                    </v-list-item-content>
                  </v-col>
                </v-row>
              </v-list-item>

              <v-divider></v-divider>

              <v-list-item>
                <v-row>
                  <v-col cols="12" md="4" class="text-start text-md-end">
                    <v-list-item-content>
                      <v-list-item-title class="font-weight-black text-wrap"
                        >Fecha de de registro:
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-col>
                  <v-col cols="12" md="8" class="text-center">
                    <v-list-item-content>
                      <v-list-item-title>{{
                        ordenDeVenta.fecha_formateada
                      }}</v-list-item-title>
                    </v-list-item-content>
                  </v-col>
                </v-row>
              </v-list-item>

              <v-divider></v-divider>

              <v-list-item>
                <v-row>
                  <v-col cols="12" md="4" class="text-start text-md-end">
                    <v-list-item-content>
                      <v-list-item-title class="font-weight-black text-wrap"
                        >Hora de registro:
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-col>
                  <v-col cols="12" md="8" class="text-center">
                    <v-list-item-content>
                      <v-list-item-title>{{
                        ordenDeVenta.hora
                      }}</v-list-item-title>
                    </v-list-item-content>
                  </v-col>
                </v-row>
              </v-list-item>

              <v-divider></v-divider>

              <v-list-item>
                <v-row>
                  <v-col cols="12" md="4" class="text-start text-md-end">
                    <v-list-item-content>
                      <v-list-item-title class="font-weight-black text-wrap"
                        >Usuario:
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-col>
                  <v-col cols="12" md="8" class="text-center">
                    <v-list-item-content>
                      <v-list-item-title>{{
                        ordenDeVenta.usuario
                      }}</v-list-item-title>
                    </v-list-item-content>
                  </v-col>
                </v-row>
              </v-list-item>

              <v-divider></v-divider>

              <v-list-item>
                <v-row>
                  <v-col cols="12" md="4" class="text-start text-md-end">
                    <v-list-item-content>
                      <v-list-item-title class="font-weight-black text-wrap"
                        >Precio total:
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-col>
                  <v-col cols="12" md="8" class="text-center">
                    <v-list-item-content>
                      <v-list-item-title
                        >{{ ordenDeVenta.precio_total }} Bs.</v-list-item-title
                      >
                    </v-list-item-content>
                  </v-col>
                </v-row>
              </v-list-item>

              <v-divider></v-divider>

              <v-list-item>
                <v-row>
                  <v-col cols="12" md="4" class="text-start text-md-end">
                    <v-list-item-content>
                      <v-list-item-title class="font-weight-black text-wrap"
                        >Monto actual cancelado:
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-col>
                  <v-col cols="12" md="8" class="text-center">
                    <v-list-item-content>
                      <v-list-item-title
                        >{{
                          ordenDeVenta.monto_cancelado_actual
                        }}
                        Bs.</v-list-item-title
                      >
                    </v-list-item-content>
                  </v-col>
                </v-row>
              </v-list-item>

              <v-divider></v-divider>

              <v-list-item>
                <v-row>
                  <v-col cols="12" md="4" class="text-start text-md-end">
                    <v-list-item-content>
                      <v-list-item-title class="font-weight-black text-wrap"
                        >Saldo pendiente:
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-col>
                  <v-col cols="12" md="8" class="text-center">
                    <v-list-item-content>
                      <v-list-item-title
                        >{{
                          ordenDeVenta.saldo_restante
                        }}
                        Bs.</v-list-item-title
                      >
                    </v-list-item-content>
                  </v-col>
                </v-row>
              </v-list-item>
            </v-list>
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
          <v-card-text v-if="!overlay">
            <v-list>
              <v-list-item>
                <v-row>
                  <v-col cols="12" md="4" class="text-start text-md-end">
                    <v-list-item-content>
                      <v-list-item-title class="font-weight-black text-wrap"
                        >Nombre/Razón social:
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-col>
                  <v-col cols="12" md="8" class="text-center">
                    <v-list-item-content>
                      <v-list-item-title>{{
                        ordenDeVenta.datos_cliente
                      }}</v-list-item-title>
                    </v-list-item-content>
                  </v-col>
                </v-row>
              </v-list-item>

              <v-divider></v-divider>

              <v-list-item>
                <v-row>
                  <v-col cols="12" md="4" class="text-start text-md-end">
                    <v-list-item-content>
                      <v-list-item-title class="font-weight-black text-wrap"
                        >NIT/CI:
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-col>
                  <v-col cols="12" md="8" class="text-center">
                    <v-list-item-content>
                      <v-list-item-title>{{
                        ordenDeVenta.nit_ci_cliente
                      }}</v-list-item-title>
                    </v-list-item-content>
                  </v-col>
                </v-row>
              </v-list-item>

              <v-divider></v-divider>

              <v-list-item>
                <v-row>
                  <v-col cols="12" md="4" class="text-start text-md-end">
                    <v-list-item-content>
                      <v-list-item-title class="font-weight-black text-wrap"
                        >Teléfono:
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-col>
                  <v-col cols="12" md="8" class="text-center">
                    <v-list-item-content>
                      <v-list-item-title>{{
                        ordenDeVenta.telefono_cliente
                      }}</v-list-item-title>
                    </v-list-item-content>
                  </v-col>
                </v-row>
              </v-list-item>

              <v-divider></v-divider>

              <v-list-item>
                <v-row>
                  <v-col cols="12" md="4" class="text-start text-md-end">
                    <v-list-item-content>
                      <v-list-item-title class="font-weight-black text-wrap"
                        >Correo electrónico:
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-col>
                  <v-col cols="12" md="8" class="text-center">
                    <v-list-item-content>
                      <v-list-item-title>{{
                        ordenDeVenta.correo_cliente
                      }}</v-list-item-title>
                    </v-list-item-content>
                  </v-col>
                </v-row>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="7">
        <v-card class="fill-height elevation-10">
          <v-card-title>
            <v-container class="elevation-4">
              <v-row>
                <v-col cols="12">
                  <h4 class="text-center">Suministros asignados</h4>
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
                  class:
                    'blue-grey lighten-4 black--text text--darken-2 font-weight-bold',
                },
                {
                  text: 'Características',
                  value: 'caracteristicas',
                  class:
                    'blue-grey lighten-4 black--text text--darken-2 font-weight-bold',
                },
                {
                  text: 'Precio unitario',
                  value: 'precio_unitario_suministro',
                  class:
                    'blue-grey lighten-4 black--text text--darken-2 font-weight-bold',
                },
                {
                  text: 'Cantidad',
                  value: 'cantidad_prevista_suministro',
                  class:
                    'blue-grey lighten-4 black--text text--darken-2 font-weight-bold',
                },
                {
                  text: 'Unidad de medida',
                  value: 'unidad_de_medida',
                  class:
                    'blue-grey lighten-4 black--text text--darken-2 font-weight-bold',
                },
                {
                  text: 'Subtotal',
                  value: 'subtotal',
                  class:
                    'blue-grey lighten-4 black--text text--darken-2 font-weight-bold',
                },
              ]"
              :items="suministros"
              item-key="id_suministro"
              fixed-header
              height="240px"
            >
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="5">
        <v-card class="fill-height elevation-10">
          <v-card-title>
            <v-container class="elevation-4">
              <v-row>
                <v-col cols="12">
                  <h4 class="text-center">Pagos registrados</h4>
                </v-col>
              </v-row>
            </v-container>
          </v-card-title>
          <v-card-text>
            <v-data-table
              :headers="[
                {
                  text: 'Usuario',
                  value: 'usuario',
                  class:
                    'blue-grey lighten-4 black--text text--darken-2 font-weight-bold',
                },
                {
                  text: 'Monto',
                  value: 'importe_numeral',
                  class:
                    'blue-grey lighten-4 black--text text--darken-2 font-weight-bold',
                },
                {
                  text: 'Fecha',
                  value: 'fecha_formateada',
                  class:
                    'blue-grey lighten-4 black--text text--darken-2 font-weight-bold',
                },
                {
                  text: 'Hora',
                  value: 'hora',
                  class:
                    'blue-grey lighten-4 black--text text--darken-2 font-weight-bold',
                },
              ]"
              :items="pagos"
              item-key="id_suministro"
              fixed-header
              height="240px"
            >
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
<style scoped>
.text-wrap {
  white-space: normal !important;
}
</style>
<script>
export default {
  name: "DatosOrdenDeVenta",
  data: () => ({
    overlay: true,
    ordenDeVenta: [],
    suministros: [],
    pagos: [],
    vistaAnterior: null,
  }),
  created() {
    this.vistaAnterior = this.$route.params.vistaAnterior;
    this.obtenerDatosOrdenDeTrabajo();
  },
  methods: {
    obtenerDatosOrdenDeTrabajo() {
      this.$api({
        method: "get",
        url:
          "ordenes-de-venta/datos-orden-de-venta/" +
          this.$route.params.idOrdenDeVenta,
        headers: { Authorization: "Bearer " + localStorage.token },
      }).then((response) => {
        console.log(response.data);
        this.ordenDeVenta = response.data.datos[0];
        this.suministros = response.data.suministros;
        this.pagos = response.data.pagos;
        this.overlay = false;
      });
    },
    regresar() {
      if (this.vistaAnterior === "Ordenes de cliente") {
        this.$router.push({
          name: this.vistaAnterior,
          params: { id: this.ordenDeVenta.id_cliente },
        });
      } else {
        this.$router.push({ name: this.vistaAnterior });
      }
    },
  },
};
</script>
