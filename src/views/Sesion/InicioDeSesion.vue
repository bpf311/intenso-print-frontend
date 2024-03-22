<template>
  <v-main class="bg">
    <v-container fill-height>
      <v-row align="center" justify="center">
        <v-col cols="12" md="6">
          <v-card class="elevation-24">
            <v-card-title>
              <v-toolbar class="gradient" tile dark elevation="10">
                <v-spacer />
                <v-toolbar-title>
                  <h3>INICIO DE SESIÓN</h3>
                </v-toolbar-title>
                <v-spacer />
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
                style="background-color: #0c3674"
                class="white--text"
                :disabled="botonDesactivado"
                :loading="botonCargando"
                @click="inicioDeSesion()"
                elevation="24"
                >Ingresar
              </v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>
<style>
.bg {
  background-image: url("../../assets/background.jpg");
  background-size: cover;
  background-position: center;
}

.gradient {
  background: linear-gradient(90deg, #057fd2 0%, #12529c 35%, #0c3e83 100%);
}
</style>
<script>
export default {
  data() {
    return {
      mostrarPassword: false,
      usuario: {
        codigo: null,
        password: null,
      },
      bloqueo: null,
      botonCargando: false,
      respuestaServidor: null,
      validacionServidor: false,
      errores: null,
    };
  },
  computed: {
    botonDesactivado() {
      return this.usuario.codigo == null && this.usuario.password == null;
    },
  },
  methods: {
    inicioDeSesion() {
      this.botonCargando = true;
      this.$api({
        method: "post",
        url: "iniciar-sesion",
        data: {
          codigo_usuario: this.usuario.codigo,
          password: this.usuario.password,
        },
      })
        .then((response) => {
          this.respuestaServidor = response.data;
          this.validacionServidor = false;
          this.$store.commit("inicioDeSesionCorrecto", this.respuestaServidor);
          this.$router.push({ name: "Dashboard" });
        })
        .catch((error) => {
          this.errores = error.response.data.message;
          this.validacionServidor = true;
        })
        .finally(() => {
          this.botonCargando = false;
          this.reiniciarFormulario();
        });
    },
    reiniciarFormulario() {
      this.respuestaServidor = null;
    },
  },
};
</script>
