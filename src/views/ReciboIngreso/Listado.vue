<template>
  <v-card elevation="5" class="rounded-lg">
    <v-card-title>
      <v-container class="elevation-4">
        <v-row>
          <v-col cols="12" lg="6">
            <h3 style="word-break: normal" class="text-center text-md-left">
              Listado de recibos de ingreso
            </h3>
          </v-col>
        </v-row>
      </v-container>
    </v-card-title>
    <v-card-subtitle class="mt-2">
      <v-container class="elevation-4">
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
              label="Busqueda"
              outlined
              hint="Realize una busqueda"
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
                <h2 class="mt-2 black--text text-center">{{ totalDia }} Bs</h2>
              </v-card-subtitle>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-card-subtitle>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="items"
        :search="busqueda"
        :loading="loading"
        loading-text="Cargando"
        class="elevation-4"
        fixed-header
        height="240px"
      >
        <template v-slot:item.opciones="row">
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
    <v-snackbar v-model="alerta" :timeout="4000" color="success" app top right>
      <v-row align="center" justify="center">
        <v-col cols="2">
          <v-icon large color="white"> mdi-check-circle-outline </v-icon>
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
import reciboIngresoHeaders from '../../commons/tableHeaders/reciboIngreso'
import moment from 'moment'
export default {
  name: 'ListadoDeRecibosIngreso',
  data: () => ({
    menu: false,
    headers: reciboIngresoHeaders,
    busqueda: null,
    items: [],
    respuestaServidor: null,
    alerta: false,
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
        console.log(pagos)
        this.items = pagos
        this.totalDia = totalDia
        this.loading = false
      })
    },
    imprimir (item) {
      const ventanaImpresion = window.open('', '_blank')

      // Generar el contenido del recibo dinámicamente en la ventana emergente

      ventanaImpresion.document.write(`
      <html>
        <head>
          <!-- Estilos CSS para la impresión -->
          <style>
            @media print and (width: 55mm) and (height: 150mm) {
              body {
                  width: 50mm !important;
                  height: 150mm !important;
                  border: 1px solid black !important;
              }
            }
          </style>
        </head>
        <body>
          <div class="print">
            <h2 style="text-align: center;"> INTENSO PRINT </h2>
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
          </div>
        </body>
      </html>
    `)

      ventanaImpresion.document.close()
      ventanaImpresion.print()
      /* ventanaImpresion.onload = function () {
        ventanaImpresion.print()
        ventanaImpresion.close()
      } */

      /* const contenidoImprimir = this.generarContenidoImprimir(item)

      // Crea un elemento iframe
      const iframe = document.createElement('iframe')
      const style = document.createElement('style')
      iframe.style.display = 'none'
      iframe.style.height = '50mm'
      iframe.style.width = '50mm'

      style.textContent =
      `@media print {
        body {
          background-color: red !important;
          width: 50mm !important;
          height: 50mm !important;
        }
      }
      body {
        background-color: red !important;
        width: 50mm !important;
        height: 50mm !important;
      }
      `

      // Agrega el iframe al documento actual
      document.body.appendChild(iframe)
      iframe.contentDocument.head.appendChild(style)

      // Establece el contenido del iframe
      iframe.contentDocument.write(contenidoImprimir)

      iframe.contentDocument.close()

      // Imprime el contenido del iframe
      iframe.contentWindow.focus()
      iframe.contentWindow.print()

      // Elimina el iframe del documento
      document.body.removeChild(iframe) */
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
    /* imprimir (item) {
      try {
        console.log(item)
        // Obtener la impresora seleccionada por el usuario
        const printerName = 'POS-58'

        // Obtener la ventana actual
        const ventana = window

        // Imprimir la ventana actual en la impresora seleccionada
        ventana.print({
          // Establecer la impresora seleccionada
          deviceName: printerName,

          // Especificar que se debe imprimir sin mostrar el cuadro de diálogo de impresión
          silent: true
        })
      } catch (e) {
        alert('Error al imprimir: ' + e.message)
      }
    }, */
    recargarTabla () {
      this.items = []
      this.loading = true
      this.busqueda = null
      this.obtenerPagosDeOrdenesPorFecha()
    }
  }
}
</script>
