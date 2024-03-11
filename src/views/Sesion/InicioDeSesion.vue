<template>
  <v-main class="bg">
    <v-container fill-height>
      <v-row align="center" justify="center">
        <v-col cols="12" md="6">
          <v-card class="elevation-24">
            <v-card-title>
              <v-toolbar class="gradient" tile dark elevation="10">
                <v-spacer/>
                <v-toolbar-title>
                  <h3>INICIO DE SESIÓN</h3>
                </v-toolbar-title>
                <v-spacer/>
              </v-toolbar>
            </v-card-title>
            <v-card-subtitle>
              <v-container>
                <div v-if="validacionServidor">
                  <v-alert
                    outlined
                    prominent
                    text
                    type="error"
                    border="bottom"
                    dismissible
                  >
                    {{ errores }}
                  </v-alert>
                </div>
              </v-container>
            </v-card-subtitle>
            <v-card-text>
              <v-row align="center" justify="center">
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="usuario.codigo"
                    label="Codigo de usuario"
                    name="codigo_usuario"
                    prepend-icon="mdi-account-box"
                    type="text"
                    color="blue darken-4"
                    outlined
                    dense
                    autocomplete="off"
                  />
                  <v-text-field
                    id="password"
                    v-model="usuario.password"
                    label="Contraseña"
                    name="password"
                    :append-icon="mostrarPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    prepend-icon="mdi-lock"
                    :type="mostrarPassword ? 'text' : 'password'"
                    color="blue darken-4"
                    outlined
                    @click:append="mostrarPassword = !mostrarPassword"
                    dense
                    autocomplete="off"
                  />
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                style="background-color: #0C3674"
                class="white--text"
                :disabled="botonDesactivado"
                :loading="botonCargando"
                @click="inicioDeSesion()"
                elevation="24"
              >Ingresar
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn @click="imprimir2">
                imprmir
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>
<style>
.bg {
  background-image: url('../../assets/background.jpg');
  background-size: cover;
  background-position: center;
}

.gradient {
  background: linear-gradient(
    90deg,
    #057FD2 0%,
    #12529C 35%,
    #0C3E83 100%
  );
}
</style>
<script>
export default {
  data () {
    return {
      mostrarPassword: false,
      usuario: {
        codigo: null,
        password: null
      },
      bloqueo: null,
      botonCargando: false,
      respuestaServidor: null,
      validacionServidor: false,
      errores: null
    }
  },
  computed: {
    botonDesactivado () {
      return this.usuario.codigo == null && this.usuario.password == null
    }
  },
  methods: {
    imprimir2 () {
      const printContent2 = [
        {
          type: 'text', // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
          value: 'INTENSO PRINT',
          style: { fontWeight: '700', textAlign: 'center', fontSize: '24px' }
        },
        {
          type: 'text',
          value: 'Cliente: Carlos',
          style: { fontWeight: '200', textAlign: 'left', fontSize: '18px' }
        },
        {
          type: 'text',
          value: 'Recibo de ingreso',
          style: { fontWeight: '700', textAlign: 'center', fontSize: '18px' }
        },
        {
          type: 'text',
          value: 'Fecha:  02/03/2023',
          style: { fontWeight: '200', textAlign: 'left', fontSize: '18px' }
        },
        {
          type: 'text',
          value: 'Concepto: Pago por orden',
          style: { fontWeight: '200', textAlign: 'left', fontSize: '18px' }
        },
        {
          type: 'text',
          value: 'Monto: 500 Bs.',
          style: { fontWeight: '200', textAlign: 'left', fontSize: '18px' }
        },
        {
          type: 'text',
          value: 'Monto literal: Quinientos Bs.',
          style: { fontWeight: '200', textAlign: 'left', fontSize: '18px' }
        },
        {
          type: 'table',
          style: { border: '2px dashed black' },
          tableHeader: ['First name', 'Last name', 'Country', 'Company', 'Contact'],
          tableBody: [
            ['Alfreds Futterkiste', 'Maria Anders', 'Germany', 'Alfreds Futterkiste', 'Maria Anders'],
            ['Centro comercial Moctezuma', 'Francisco Chang', 'Mexico', 'Centro comercial Moctezuma', 'Francisco Chang'],
            ['Ernst Handel', 'Roland Mendel', 'Austria', 'Ernst Handel', 'Roland Mendel'],
            ['Island Trading', 'Helen Bennett', 'UK', 'Island Trading', 'Helen Bennett'],
            ['Laughing Bacchus Winecellars', 'Yoshi Tannamuri', 'Canada', 'Laughing Bacchus Winecellars', 'Yoshi Tannamuri'],
            ['Magazzini Alimentari Riuniti', 'Giovanni Rovelli', 'Italy', 'Magazzini Alimentari Riuniti', 'Giovanni Rovelli']
          ],
          tableFooter: ['Animal', 'Age'],
          tableHeaderStyle: { color: 'black' },
          // custom style for the table body
          tableBodyStyle: { border: '0.5px dashed black', color: 'black', fontSize: '10px', fontWeight: '700' },
          // custom style for the table footer
          tableFooterStyle: { color: 'black' }
        }
      ]
      const printContent = `
    <html lang="es">
<head>
    <style>
        html, body {
            margin: 0 !important;
            padding: 0 !important;
            font-family: 'Tahoma', 'Segoe UI Light', 'Segoe UI', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Verdana, sans-serif !important;
            height: auto;
            width: 217px;
            font-size: 12px;
        }
        table {
          width: 100%;
          font-size: 12px;
          padding: 0;
          border-spacing: 0;
          display: table;
          border-collapse: collapse;
          word-break: break-word;
          text-align: center;
        }
    </style><title>Test</title>
</head>
<body>
    <div class="print">
        <h2 style="text-align: center;"> INTENSO PRINT tsts 55515 </h2>
        <hr>
        <p> Cliente: Test</p>
        <hr>
        <p style="text-align: center;">Recibo de ingreso</p>
        <p> Nro.: 1</p>
        <p> Fecha: 000002/03/2023</p>
        <p> Concepto: Pago por orden</p>
        <hr>
        <p> Monto: 500 Bs</p>
        <p> quinientos Bs</p>
    </div>
    <div>
        <table>
            <tr>
                <th style="width: 10%">Desc.</th>
                <th style="width: 10%">Cant.</th>
                <th style="width: 10%">P. Unit.</th>
                <th style="width: 20%">Subtotal</th>
            </tr>
            <tr>
                <td style="width: 10%">Alfreds Futterkiste</td>
                <td style="width: 10%">5</td>
                <td style="width: 10%">10</td>
                <td style="width: 20%">50</td>
            </tr>
            <!-- Resto de las filas -->
        </table>
    </div>
</body>
</html>
  `
      console.log('printContent', printContent2)
      // llamar al evento imprimirContenido de electron
      window.ipcRenderer.send('print-content', printContent)
    },
    inicioDeSesion () {
      this.botonCargando = true
      this.$api({
        method: 'post',
        url: 'iniciar-sesion',
        data: {
          codigo_usuario: this.usuario.codigo,
          password: this.usuario.password
        }
      })
        .then((response) => {
          this.respuestaServidor = response.data
          this.validacionServidor = false
          this.$store.commit('inicioDeSesionCorrecto', this.respuestaServidor)
          this.$router.push({ name: 'Dashboard' })
        })
        .catch((error) => {
          this.errores = error.response.data.message
          this.validacionServidor = true
        }).finally(() => {
          this.botonCargando = false
          this.reiniciarFormulario()
        })
    },
    reiniciarFormulario () {
      this.respuestaServidor = null
    }
  }
}
</script>
