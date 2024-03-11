<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card class="elevation-10">
          <v-card-title>
            <v-row>
              <v-col cols="12" md="10">
                <h3 style="word-break: normal" class="text-center text-md-left">
                  Generar reporte de inventario
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
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="reporteInventario.fechaInicio"
                  label="Fecha de inicio"
                  outlined
                  prepend-icon="mdi-account-box"
                  color="blue darken-4"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="reporteInventario.fechaFin"
                  label="Fecha de fin"
                  outlined
                  prepend-icon="mdi-account-box"
                  color="blue darken-4"
                />
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="mb-2 mr-2">
            <v-spacer />
            <v-btn
              :loading="botonCargando"
              color="green"
              class="white--text"
              @click="generarReporte()"
            >
              Generar reporte
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
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
  </v-container>
</template>

<script>
import ExcelJS from 'exceljs'
export default {
  name: 'ReporteInventario',
  data: () => ({
    botonCargando: false,
    respuestaServidor: null,
    datos: null,
    alerta: false,
    errores: [],
    reporteInventario: {
      fechaInicio: '2023-06-01',
      fechaFin: '2023-06-30'
    }
  }),
  methods: {
    generarReporte () {
      this.botonCargando = true
      this.$api({
        method: 'get',
        url:
          'reportes/obtener-reporte-inventario/' +
          this.reporteInventario.fechaInicio +
          '/' +
          this.reporteInventario.fechaFin,
        headers: { Authorization: 'Bearer ' + localStorage.token }
      })
        .then((response) => {
          this.botonCargando = false
          this.errores = []
          this.reiniciarDatos(this.reporteInventario)
          this.respuestaServidor = response.data.mensaje
          this.datos = response.data.resultados
          this.alerta = true
        })
        .catch((error) => {
          this.botonCargando = false
          this.errores = error.response.data.errors
        })
        .finally(() => {
          this.generarExcel()
        })
    },
    generarExcel () {
      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('REPORTE DE INVENTARIO', {
        properties: { tabColor: { argb: 'FFC0000' } }
      })
      const titulo = ['REPORTE DE INVENTARIO']
      const encabezados = ['FECHA Y HORA', 'INGRESO', 'SALIDA', 'SALDO']
      const contenido = this.datos

      worksheet.addRow(titulo)
      worksheet.addRows([[''], ['']])

      contenido.forEach((suministro) => {
        const datosSuministro = [
          'SUMINISTRO', suministro.descripcion_suministro,
          'CODIGO', suministro.codigo_suministro
        ]
        const filaDatosSuministro = worksheet.addRow(datosSuministro)

        filaDatosSuministro.height = 25

        filaDatosSuministro.eachCell((cell) => {
          cell.style = {
            fill: {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'C5D9F1' }
            },
            alignment: {
              horizontal: 'center',
              vertical: 'middle'
            },
            font: {
              name: 'Arial Black',
              family: 2,
              bold: true,
              size: 9
            }
          }
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          }
        })

        const headerRow = worksheet.addRow(encabezados)

        headerRow.height = 20

        // Establecer estilo de la fila de encabezados
        headerRow.eachCell((cell) => {
          cell.style = {
            fill: {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FFC0C0C0' }
            },
            alignment: {
              horizontal: 'center',
              vertical: 'middle'
            },
            font: {
              name: 'Arial Black',
              family: 2,
              bold: true,
              size: 9
            }
          }
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          }
        })

        const registros = suministro.registros.map((objeto) =>
          Object.values(objeto)
        )
        const filas = worksheet.addRows(registros)

        for (const row of filas) {
          row.eachCell((cell) => {
            cell.border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' }
            }
          })
        }

        worksheet.addRows([[''], ['']])
      })

      worksheet.mergeCells(1, 1, 1, 4)

      const fila = worksheet.getRow(1)
      fila.height = 30

      const columnaA = worksheet.getColumn(1)
      columnaA.width = 20

      const columnaB = worksheet.getColumn(2)
      columnaB.width = 15

      const columnaC = worksheet.getColumn(3)
      columnaC.width = 15

      const columnaD = worksheet.getColumn(4)
      columnaD.width = 15

      worksheet.getCell('A1').alignment = {
        horizontal: 'center',
        vertical: 'middle'
      }
      // Genera el archivo Excel en un búfer
      workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        })
        const url = URL.createObjectURL(blob)

        const link = document.createElement('a')
        link.href = url
        link.download = 'Reporte.xlsx'
        link.click()

        URL.revokeObjectURL(url)
      })
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
