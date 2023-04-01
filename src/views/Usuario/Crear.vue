<template>
  <v-card elevation="5" class="rounded-lg">
    <v-card-title>
      <v-container class="elevation-4">
        <v-row>
          <v-col cols="12" lg="6">
            <h3 class="text-center text-md-left"> Registrar nuevo usuario </h3>
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
            Por favor, corrija los siguientes errores
            <ul>
              <li v-for="(item, index) in errores" :key="index">
                {{ item[0] }}
              </li>
            </ul>
          </v-alert>
          <v-row>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="usuario.nombre"
                label="Nombre(s)"
                outlined
                prepend-icon="mdi-account-box"
                color="blue darken-4"
                @keyup="generarCodigo"
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="usuario.apellidoPaterno"
                label="Apellido paterno"
                outlined
                prepend-icon="mdi-account-box"
                color="blue darken-4"
                @keyup="generarCodigo"
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="usuario.apellidoMaterno"
                label="Apellido materno"
                outlined
                prepend-icon="mdi-account-box"
                color="blue darken-4"
                @keyup="generarCodigo"
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="usuario.celular"
                label="Celular"
                outlined
                prepend-icon="mdi-cellphone"
                color="blue darken-4"
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="usuario.correo"
                label="Correo"
                outlined
                prepend-icon="mdi-email"
                color="blue darken-4"
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-select
                v-model="usuario.rol"
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
                v-model="usuario.carnet"
                label="Carnet de identidad"
                outlined
                prepend-icon="mdi-numeric"
                color="blue darken-4"
                @keyup="generarCodigo"
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="usuario.codigo"
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
      <v-btn :loading="botonCargando" color="green" class="white--text" @click="registrarUsuario()">
        Registrar
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
  </v-card>
</template>

<script>
export default {
  name: 'CrearUsuario',
  data: () => ({
    botonCargando: false,
    respuestaServidor: null,
    alerta: false,
    roles: [],
    errores: [],
    usuario: {
      rol: null,
      nombre: null,
      apellidoPaterno: null,
      apellidoMaterno: null,
      celular: null,
      correo: null,
      carnet: null,
      codigo: null
    }
  }),
  created () {
    this.obtenerRoles()
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
    registrarUsuario () {
      this.botonCargando = true
      this.$api({
        method: 'post',
        url: 'usuarios/registrar-usuario',
        headers: { Authorization: 'Bearer ' + localStorage.token },
        data: {
          id_rol: this.usuario.rol,
          nombre_usuario: this.usuario.nombre,
          apellido_paterno_usuario: this.usuario.apellidoPaterno,
          apellido_materno_usuario: this.usuario.apellidoMaterno,
          celular_usuario: this.usuario.celular,
          correo_usuario: this.usuario.correo,
          carnet_identidad_usuario: this.usuario.carnet,
          codigo_usuario: this.usuario.codigo
        }
      })
        .then((response) => {
          this.botonCargando = false
          this.errores = []
          this.reiniciarDatos(this.usuario)
          this.respuestaServidor = response.data.mensaje
          this.alerta = true
          this.$store.commit('recargarDatos')
        })
        .catch((error) => {
          this.botonCargando = false
          this.errores = error.response.data.errors
        })
    },
    generarCodigo () {
      if (this.usuario.nombre && this.usuario.apellidoPaterno && this.usuario.apellidoMaterno && this.usuario.carnet) {
        this.usuario.codigo =
        this.usuario.nombre.charAt(0) +
        this.usuario.apellidoPaterno.charAt(0) +
        this.usuario.apellidoMaterno.charAt(0) +
        this.usuario.carnet
      }
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
