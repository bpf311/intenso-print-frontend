<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card class="elevation-10">
          <v-card-title>
            <v-row>
              <v-col cols="12" md="10">
                <h3 style="word-break: normal" class="text-center text-md-left"> Registrar nuevo usuario </h3>
              </v-col>
              <v-col cols="12" md="2" class="text-center text-md-end">
                <v-btn
                  block
                  color="error"
                  :to="{ name: 'Listado de usuarios' }"
                >
                  <v-icon left>mdi-arrow-left </v-icon>
                  Atras
                </v-btn>
              </v-col>
            </v-row>
          </v-card-title>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-card class="elevation-10">
          <ValidationObserver v-slot="{ handleSubmit }" ref="obs">
            <v-card-text>
              <v-alert
                v-if="validacionServidor"
                outlined
                prominent
                type="error"
                elevation="2"
                text
                class="mb-8"
                dismissible
                border="bottom"
              >
                Por favor, revise y corrija cualquier error identificado a continuación:
                <ul>
                  <li v-for="(item, index) in errores" :key="index">
                    {{ item[0] }}
                  </li>
                </ul>
              </v-alert>
              <v-row>
                <v-col cols="12" md="4">
                  <ValidationProvider name="Nombre(s)" rules="required" v-slot="{ errors }">
                    <v-text-field
                      v-model="usuario.nombre"
                      label="Nombre(s)"
                      outlined
                      prepend-icon="mdi-account-box"
                      color="blue darken-4"
                      @keyup="generarCodigo"
                      :error-messages="obtenerValidaciones(errors, 'nombre_usuario')"
                    />
                  </ValidationProvider>
                </v-col>
                <v-col cols="12" md="4">
                  <ValidationProvider name="Apellido paterno" rules="required" v-slot="{ errors }">
                    <v-text-field
                      v-model="usuario.apellidoPaterno"
                      label="Apellido paterno"
                      outlined
                      prepend-icon="mdi-account-box"
                      color="blue darken-4"
                      @keyup="generarCodigo"
                      :error-messages="obtenerValidaciones(errors, 'apellido_paterno_usuario')"
                    />
                  </ValidationProvider>
                </v-col>
                <v-col cols="12" md="4">
                  <ValidationProvider name="Apellido materno" rules="required" v-slot="{ errors }">
                    <v-text-field
                      v-model="usuario.apellidoMaterno"
                      label="Apellido materno"
                      outlined
                      prepend-icon="mdi-account-box"
                      color="blue darken-4"
                      @keyup="generarCodigo"
                      :error-messages="obtenerValidaciones(errors, 'apellido_materno_usuario')"
                    />
                  </ValidationProvider>
                </v-col>
                <v-col cols="12" md="4">
                  <ValidationProvider name="Número de celular" rules="required|numeric|min:6" v-slot="{ errors }">
                    <v-text-field
                      v-model="usuario.celular"
                      label="Número de celular"
                      outlined
                      prepend-icon="mdi-cellphone"
                      color="blue darken-4"
                      :error-messages="obtenerValidaciones(errors, 'celular_usuario')"
                    />
                  </ValidationProvider>
                </v-col>
                <v-col cols="12" md="4">
                  <ValidationProvider name="Correo electrónico" rules="required|email" v-slot="{ errors }">
                    <v-text-field
                      v-model="usuario.correo"
                      label="Correo electrónico"
                      outlined
                      prepend-icon="mdi-email"
                      color="blue darken-4"
                      :error-messages="obtenerValidaciones(errors, 'correo_usuario')"
                    />
                  </ValidationProvider>
                </v-col>
                <v-col cols="12" md="4">
                  <ValidationProvider name="Rol" rules="required" v-slot="{ errors }">
                    <v-select
                      v-model="usuario.rol"
                      label="Rol dentro del sistema"
                      outlined
                      prepend-icon="mdi-briefcase-account"
                      :items="roles"
                      item-text="rol"
                      item-value="id_rol"
                      color="blue darken-4"
                      :error-messages="obtenerValidaciones(errors, 'id_rol')"
                    />
                  </ValidationProvider>
                </v-col>
                <v-col cols="12" md="4">
                  <ValidationProvider name="Carnet de identidad" rules="required|numeric|min:6" v-slot="{ errors }">
                    <v-text-field
                      v-model="usuario.carnet"
                      label="Carnet de identidad"
                      outlined
                      prepend-icon="mdi-numeric"
                      color="blue darken-4"
                      @keyup="generarCodigo"
                      :error-messages="obtenerValidaciones(errors, 'carnet_identidad_usuario')"
                    />
                  </ValidationProvider>
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
                <v-col cols="12">
                  <v-alert
                    border="bottom"
                    outlined
                    type="info"
                    elevation="2"
                    prominent
                    text
                    dismissible
                  >
                    Por favor, tenga en cuenta que la contraseña para el nuevo usuario registrado será su número de carnet de identidad.
                  </v-alert>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions class="mb-2 mr-2">
              <v-spacer />
              <v-btn
                :loading="botonCargando"
                color="green"
                class="white--text"
                @click="handleSubmit(registrarUsuario)"
              >
                Registrar
              </v-btn>
            </v-card-actions>
          </ValidationObserver>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'CrearUsuario',
  data: () => ({
    botonCargando: false,
    respuestaServidor: null,
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
    },
    validacionServidor: false
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
          this.errores = []
          this.reiniciarDatos(this.usuario)
          this.respuestaServidor = response.data.mensaje
          this.$store.commit('recargarDatos')
        })
        .catch((error) => {
          this.validacionServidor = true
          this.errores = error.response.data.errors
        }).finally(() => {
          this.botonCargando = false
          this.activarNotificacion()
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
    },
    activarNotificacion () {
      if (Object.keys(this.errores).length > 0) {
        const mensaje = 'No se pudo completar la acción, por favor verifique los errores.'
        this.$toast.error(mensaje)
      } else {
        this.validacionServidor = false
        this.$refs.obs.reset()
        this.$toast.success(this.respuestaServidor)
      }
    },
    obtenerValidaciones (errors, field) {
      const veeErrors = errors || []
      const serverErrors = this.errores[field] || []
      return [...veeErrors, ...serverErrors]
    }
  }
}
</script>
