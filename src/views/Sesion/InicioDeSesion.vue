<template>
  <v-main>
    <v-container fill-height>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="10" lg="8">
          <v-card class="elevation-6">
            <v-row>
              <v-col cols="12">
                <v-row>
                  <v-col cols="12">
                    <v-toolbar color="blue" dense dark elevation="10">
                      <v-spacer />
                      <v-toolbar-title>
                        <h3>INICIO DE SESIÓN</h3>
                      </v-toolbar-title>
                      <v-spacer />
                    </v-toolbar>
                  </v-col>
                  <v-col cols="12" v-if="bloqueo">
                    <v-alert type="error">
                      {{ bloqueo }}
                    </v-alert>
                  </v-col>
                </v-row>
                <v-card-text>
                  <v-row align="center" justify="center">
                    <v-col cols="12" sm="8">
                      <v-text-field
                        class="mt-7"
                        v-model="usuario.codigo"
                        label="Codigo de usuario"
                        name="codigo_usuario"
                        prepend-icon="mdi-account-box"
                        type="text"
                        color="blue darken-4"
                        outlined
                        :error-messages="datoIncorrecto.codigo"
                        dense
                        autocomplete="off"
                      />
                      <v-text-field
                        id="password"
                        v-model="usuario.password"
                        class="mt-2"
                        label="Contraseña"
                        name="password"
                        :append-icon="
                          mostrarContraseña ? 'mdi-eye' : 'mdi-eye-off'
                        "
                        prepend-icon="mdi-lock"
                        :type="mostrarContraseña ? 'text' : 'password'"
                        color="blue darken-4"
                        outlined
                        :error-messages="datoIncorrecto.password"
                        @click:append="mostrarContraseña = !mostrarContraseña"
                        dense
                        autocomplete="off"
                      />
                      <v-row class="pa-4">
                        <v-spacer></v-spacer>
                        <v-col cols="12" sm="5">
                          <span class="caption blue--text"
                            >¿Olvidaste tu contraseña?</span
                          >
                        </v-col>
                      </v-row>
                      <v-btn
                        color="primary"
                        :disabled="botonDesactivado"
                        :loading="botonCargando"
                        @click="inicioDeSesion()"
                        block
                        elevation="24"
                        >Ingresar</v-btn
                      >
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>
<script>
export default {
  data () {
    return {
      mostrarContraseña: false,
      usuario: {
        codigo: '',
        password: ''
      },
      bloqueo: null,
      botonCargando: false,
      datoIncorrecto: {
        codigo: '',
        password: ''
      }
    }
  },
  computed: {
    botonDesactivado () {
      return this.usuario.codigo && this.usuario.password === ''
    }
  },
  methods: {
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
          const { mensaje } = response.data
          this.botonCargando = false
          if (mensaje === 'Usuario incorrecto') {
            this.datoIncorrecto.codigo = mensaje
            this.datoIncorrecto.password = ''
            this.bloqueo = null
          } else if (
            mensaje === 'Combinacion de Usuario y Contraseña es incorrecta'
          ) {
            this.datoIncorrecto.password = mensaje
            this.datoIncorrecto.codigo = ''
            this.bloqueo = null
          } else {
            this.$store.commit('inicioDeSesionCorrecto', response.data)
            this.$router.push({ name: 'Dashboard' })
          }
        })
        .catch((error) => {
          this.botonCargando = false
          this.bloqueo = error.response.data.errors.codigo_usuario[0]
          this.usuario.codigo = ''
          this.usuario.password = ''
          this.datoIncorrecto.password = ''
          this.datoIncorrecto.codigo = ''
        })
    }
  }
}
</script>
