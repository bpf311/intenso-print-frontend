<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card class="elevation-10">
          <v-card-title>
            <v-row>
              <v-col cols="12" md="10">
                <h3 style="word-break: normal" class="text-center text-md-left">
                  Listado de recibos de ingreso
                </h3>
              </v-col>
            </v-row>
          </v-card-title>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-card class="elevation-10">
          <v-card-text>
            <v-row>
              <v-col cols="12" md="3">
                <v-menu
                  v-model="menu"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="seleccionFecha"
                      label="Seleccione la fecha"
                      prepend-inner-icon="mdi-calendar"
                      readonly
                      outlined
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="seleccionFecha"
                    @input="menu = false"
                    @change="recargarTabla()"
                    :max="fechaActual"
                    first-day-of-week="1"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  v-model="busqueda"
                  append-icon="mdi-magnify"
                  label="Búsqueda"
                  outlined
                  hint="Realice una búsqueda"
                  persistent-hint
                ></v-text-field>
              </v-col>
              <v-spacer />
              <v-col cols="12" md="5">
                <div class="elevation-4">
                  <v-card-subtitle>
                    <h3 class="black--text text-center">
                      Total de ingresos en el día:
                    </h3>
                    <h2 class="mt-2 black--text text-center">
                      {{ totalDia }} Bs
                    </h2>
                  </v-card-subtitle>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="items"
              :search="busqueda"
              :loading="loading"
              loading-text="Cargando"
              fixed-header
              :height="dynamicTableHeight"
            >
              <template v-slot:[`item.opciones`]="row">
                <div class="d-flex">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        color="info"
                        class="rounded-0"
                        small
                        dark
                        v-bind="attrs"
                        v-on="on"
                        @click="imprimir(row.item)"
                      >
                        <v-icon>mdi-printer-pos</v-icon>
                      </v-btn>
                    </template>
                    <span>Imprimir recibo</span>
                  </v-tooltip>
                </div>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import reciboIngresoHeaders from '../../commons/tableHeaders/reciboIngreso'
import { tableMixin } from '@/commons/mixins/tableMixin'
import moment from 'moment'

export default {
  mixins: [tableMixin],
  name: 'ListadoDeRecibosIngreso',
  data: () => ({
    menu: false,
    headers: reciboIngresoHeaders,
    busqueda: null,
    items: [],
    loading: true,
    loadingSelect: true,
    totalDia: null,
    seleccionFecha: moment().format('YYYY-MM-DD'),
    fechaActual: moment().format('YYYY-MM-DD')
  }),
  activated () {
    if (this.seleccionRol && this.$store.state.recargar) {
      this.recargarTabla()
      this.$store.commit('noRecargarDatos')
    }
  },
  created () {
    this.obtenerPagosDeOrdenesPorFecha()
  },
  methods: {
    obtenerPagosDeOrdenesPorFecha () {
      this.$api({
        method: 'get',
        url:
          'pagos-de-ordenes/obtener-pagos-de-ordenes-por-fecha/' +
          this.seleccionFecha,
        headers: { Authorization: 'Bearer ' + localStorage.token }
      }).then((response) => {
        const { pagos } = response.data
        const { totalDia } = response.data
        this.items = pagos
        this.totalDia = totalDia
        this.loading = false
      })
    },
    imprimir (item) {
      console.log('Imprimir recibo', item)
      const printContent = `
    <html lang="es">
      <body>
        <div class="print">
          <h2 style="text-align: center;"> INTENSO PRINT </h2>
          <hr></hr>
          <p> Cliente: ${item.datos_cliente}</p>
          <hr></hr>
          <p style="text-align: center;">Recibo de ingreso</p>
          <p> Nro.: ${item.id_recibo_ingreso}</p>
          <p> Fecha: ${item.fecha_formateada}</p>
          <p> Concepto: Pago por orden</p>
          <hr></hr>
          <p> Monto: ${item.importe_numeral} Bs</p>
          <p> ${item.importe_literal} Bs</p>
        </div>
        <div>
          <table>
            <tr>
              <th>Company</th>
              <th>Contact</th>
              <th>Country</th>
            </tr>
            <tr>
              <td>Alfreds Futterkiste</td>
              <td>Maria Anders</td>
              <td>Germany</td>
            </tr>
            <tr>
              <td>Centro comercial Moctezuma</td>
              <td>Francisco Chang</td>
              <td>Mexico</td>
            </tr>
            <tr>
              <td>Ernst Handel</td>
              <td>Roland Mendel</td>
              <td>Austria</td>
            </tr>
            <tr>
              <td>Island Trading</td>
              <td>Helen Bennett</td>
              <td>UK</td>
            </tr>
            <tr>
              <td>Laughing Bacchus Winecellars</td>
              <td>Yoshi Tannamuri</td>
              <td>Canada</td>
            </tr>
            <tr>
              <td>Magazzini Alimentari Riuniti</td>
              <td>Giovanni Rovelli</td>
              <td>Italy</td>
            </tr>
          </table>
        </div>
      </body>
    </html>
  `
      const printContent2 = [
        {
          type: 'text', // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
          value: 'INTENSO PRINT',
          style: { fontWeight: '700', textAlign: 'center', fontSize: '24px' }
        },
        {
          type: 'text',
          value: 'Cliente: ' + item.datos_cliente,
          style: { fontWeight: '200', textAlign: 'left', fontSize: '18px' }
        },
        {
          type: 'text',
          value: 'Recibo de ingreso',
          style: { fontWeight: '700', textAlign: 'center', fontSize: '18px' }
        },
        {
          type: 'text',
          value: 'Fecha: ' + item.fecha_formateada,
          style: { fontWeight: '200', textAlign: 'left', fontSize: '18px' }
        },
        {
          type: 'text',
          value: 'Concepto: Pago por orden',
          style: { fontWeight: '200', textAlign: 'left', fontSize: '18px' }
        },
        {
          type: 'text',
          value: 'Monto: ' + item.importe_numeral + ' Bs.',
          style: { fontWeight: '200', textAlign: 'left', fontSize: '18px' }
        },
        {
          type: 'text',
          value: 'Monto literal: ' + item.importe_literal,
          style: { fontWeight: '200', textAlign: 'left', fontSize: '18px' }
        },
        {
          type: 'table',
          // style the table
          style: { border: '2px dashed black' },
          // list of the columns to be rendered in the table header
          tableHeader: ['Animal', 'Age'],
          // multi dimensional array depicting the rows and columns of the table body
          tableBody: [
            ['Cat', 2],
            ['Dog', 4],
            ['Horse', 12],
            ['Pig', 4]
          ],
          // list of columns to be rendered in the table footer
          tableFooter: ['Animal', 'Age'],
          // custom style for the table header
          tableHeaderStyle: { backgroundColor: '#000', color: 'black' },
          // custom style for the table body
          tableBodyStyle: { border: '0.5px dashed black', backgroundColor: '#000', color: 'black', fontSize: '10px', fontWeight: '700' },
          // custom style for the table footer
          tableFooterStyle: { backgroundColor: '#000', color: 'black' }
        }
      ]
      console.log('printContent', printContent)
      // llamar al evento imprimirContenido de electron
      window.ipcRenderer.send('print-content', printContent2)
      // window.ipcRenderer.send('print-content', printContent)
    },
    generarContenidoImprimir (item) {
      // Genera el contenido dinámicamente
      return `<h2 style="text-align: center;"> INTENSO PRINT </h2>
        <hr></hr>
        <p> Cliente: ${item.nombre_razon_social}</p>
        <p> CI/NIT: ${item.ci_nit}</p>
        <hr></hr>
        <p style="text-align: center;">Recibo de ingreso</p>
        <p> Nro.: ${item.id_recibo_ingreso}</p>
        <p> Fecha: ${item.fecha_formateada}</p>
        <p> Concepto: Pago por orden</p>
        <hr></hr>
        <p> Monto: ${item.importe_numeral} Bs</p>
       `
    },
    recargarTabla () {
      this.items = []
      this.loading = true
      this.busqueda = null
      this.obtenerPagosDeOrdenesPorFecha()
    }
  }
}
</script>
