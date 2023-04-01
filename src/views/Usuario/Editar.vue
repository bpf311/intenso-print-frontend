<template>
  <v-card elevation="5" class="rounded-lg">
    <v-card-title>
      <v-container class="elevation-4">
        <v-row>
          <v-col cols="12" lg="6">
            <h3 class="text-center text-md-left"> Editar datos del usuario </h3>
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
            Por favor, corrija el/los siguiente(s) error(es):
            <ul>
              <li v-for="(item, index) in errores" :key="index">
                {{ item[0] }}
              </li>
            </ul>
          </v-alert>
          <v-row>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="usuario.nombre_usuario"
                label="Nombre(s)"
                outlined
                prepend-icon="mdi-account-box"
                color="blue darken-4"
                @keyup="generarCodigo"
              />
            </v-col>

            <v-col cols="12" md="4">
              <v-text-field
                v-model="usuario.apellido_paterno_usuario"
                label="Apellido paterno"
                outlined
                prepend-icon="mdi-account-box"
                color="blue darken-4"
                @keyup="generarCodigo"
              />
            </v-col>

            <v-col cols="12" md="4">
              <v-text-field
                v-model="usuario.apellido_materno_usuario"
                label="Apellido materno"
                outlined
                prepend-icon="mdi-account-box"
                color="blue darken-4"
                @keyup="generarCodigo"
              />
            </v-col>

            <v-col cols="12" md="4">
              <v-text-field
                v-model="usuario.celular_usuario"
                label="Celular"
                outlined
                prepend-icon="mdi-cellphone"
                color="blue darken-4"
              />
            </v-col>

            <v-col cols="12" md="4">
              <v-text-field
                v-model="usuario.correo_usuario"
                label="Correo"
                outlined
                prepend-icon="mdi-email"
                color="blue darken-4"
              />
            </v-col>

            <v-col cols="12" md="4">
              <v-select
                v-model="usuario.id_rol"
                label="Rol dentro del sistema"
                outlined
                prepend-icon="mdi-briefcase-account"
                :items="roles"
                item-text="rol"
                item-value="id_rol"
                color="blue darken-4"
              />
            </v-col>

            <v-col cols="12" md="4">
              <v-text-field
                v-model="usuario.carnet_identidad_usuario"
                label="Carnet de identidad"
                outlined
                prepend-icon="mdi-numeric"
                color="blue darken-4"
                @keyup="generarCodigo"
              />
            </v-col>

            <v-col cols="12" md="4">
              <v-text-field
                v-model="usuario.codigo_usuario"
                label="Codigo de usuario"
                outlined
                prepend-icon="mdi-badge-account"
                color="blue darken-4"
                disabled
              />
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-card-text>
    <v-card-actions class="mb-2 mr-2">
      <v-spacer />
      <v-btn color="error" class="ml-2" :to="{ name: 'Listado de usuarios' }">
        Atras
      </v-btn>
      <v-btn :loading="botonCargando" color="success" class="mr-0" @click="modificarUsuario()">
        Modificar
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
    <v-overlay :value="overlay" absolute dark opacity="0.8" color="#212121">
      <v-progress-circular indeterminate :size="90" :width="8">
        Cargando
      </v-progress-circular>
    </v-overlay>
  </v-card>
</template>

<script>
export default {
  name: 'EditarUsuario',
  data: () => ({
    botonCargando: false,
    respuestaServidor: null,
    alerta: false,
    overlay: true,
    roles: [],
    errores: [],
    usuario: []
  }),
  created () {
    this.obtenerRoles()
    this.obtenerUsuario()
  },
  methods: {
    obtenerRoles () {
      this.$api({
        method: 'get',
        url: 'roles/obtener-roles',
        headers: { Authorization: 'Bearer ' + localStorage.token }
      }).then((response) => {
        this.roles = response.data.roles
      })
    },
    modificarUsuario () {
      this.botonCargando = true
      this.$api({
        method: 'put',
        url: 'usuarios/modificar-usuario/' + this.$route.params.id,
        headers: { Authorization: 'Bearer ' + localStorage.token },
        data: {
          id_rol: this.usuario.id_rol,
          nombre_usuario: this.usuario.nombre_usuario,
          apellido_paterno_usuario: this.usuario.apellido_paterno_usuario,
          apellido_materno_usuario: this.usuario.apellido_materno_usuario,
          celular_usuario: this.usuario.celular_usuario,
          correo_usuario: this.usuario.correo_usuario,
          carnet_identidad_usuario: this.usuario.carnet_identidad_usuario,
          codigo_usuario: this.usuario.codigo_usuario
        }
      })
        .then((response) => {
          this.botonCargando = false
          this.errores = []
          this.respuestaServidor = response.data.mensaje
          this.alerta = true
          this.$store.commit('recargarDatos')
        })
        .catch((error) => {
          this.botonCargando = false
          this.errores = error.response.data.errors
        })
    },
    obtenerUsuario () {
      this.$api({
        method: 'get',
        url: 'usuarios/editar-usuario/' + this.$route.params.id,
        headers: { Authorization: 'Bearer ' + localStorage.token }
      }).then((response) => {
        this.usuario = response.data.usuario
        this.overlay = false
      })
    },
    generarCodigo () {
      this.usuario.codigo_usuario =
        this.usuario.nombre_usuario.charAt(0) +
        this.usuario.apellido_paterno_usuario.charAt(0) +
        this.usuario.apellido_materno_usuario.charAt(0) +
        this.usuario.carnet_identidad_usuario
    }
  }
}
</script>
