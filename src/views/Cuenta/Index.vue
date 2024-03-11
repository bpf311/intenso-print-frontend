<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card class="elevation-10">
          <v-card-title>
            <v-row>
              <v-col cols="12" md="10">
                <h3 style="word-break: normal" class="text-center text-md-left">
                  Editar datos personales
                </h3>
              </v-col>
            </v-row>
          </v-card-title>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-row>
          <v-col cols="12" md="8">
            <v-card class="elevation-10 fill-height">
              <v-card-title>
                <v-container class="elevation-4">
                  <v-row>
                    <v-col cols="12">
                      <h4 class="text-center">Datos personales</h4>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-title>
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
                          v-model="usuario.nombre_usuario"
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
                          v-model="usuario.apellido_paterno_usuario"
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
                          v-model="usuario.apellido_materno_usuario"
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
                          v-model="usuario.celular_usuario"
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
                          v-model="usuario.correo_usuario"
                          label="Correo electrónico"
                          outlined
                          prepend-icon="mdi-email"
                          color="blue darken-4"
                          :error-messages="obtenerValidaciones(errors, 'correo_usuario')"
                        />
                      </ValidationProvider>
                    </v-col>
                    <v-col cols="12" md="4">
                      <ValidationProvider name="Carnet de identidad" rules="required|numeric|min:6" v-slot="{ errors }">
                        <v-text-field
                          v-model="usuario.carnet_identidad_usuario"
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
                        v-model="usuario.codigo_usuario"
                        label="Codigo de usuario"
                        outlined
                        prepend-icon="mdi-badge-account"
                        color="blue darken-4"
                        disabled
                      />
                    </v-col>
                  </v-row>
                </v-card-text>
                <v-card-actions>
                  <v-spacer />
                  <v-btn
                    :loading="botonCargando"
                    color="green"
                    class="white--text"
                    @click="handleSubmit(modificarUsuario)"
                  >
                    Modificar datos
                  </v-btn>
                </v-card-actions>
              </ValidationObserver>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card class="elevation-10 fill-height">
              <v-card-title>
                <v-container class="elevation-4">
                  <v-row>
                    <v-col cols="12">
                      <h4 class="text-center">Contraseña</h4>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-title>
              <ValidationObserver v-slot="{ handleSubmit }" ref="obsPass">
                <v-card-text>
                  <v-alert
                    v-if="validacionServidorContraseña"
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
                    <v-col cols="12">
                      <ValidationProvider name="Contraseña actual" rules="required|numeric|min:6" v-slot="{ errors }">
                        <v-text-field
                          v-model="contraseñaActual"
                          label="Contraseña actual"
                          outlined
                          prepend-icon="mdi-lock"
                          color="blue darken-4"
                          :type="mostrarContraseñaUno ? 'text' : 'password'"
                          @click:append="mostrarContraseñaUno = !mostrarContraseñaUno"
                          :append-icon="mostrarContraseñaUno ? 'mdi-eye' : 'mdi-eye-off'"
                          autocomplete="off"
                          :error-messages="obtenerValidaciones(errors, 'contraseña_usuario')"
                        />
                      </ValidationProvider>
                    </v-col>
                    <v-col cols="12">
                      <ValidationProvider name="Contraseña nueva" rules="required|min:6" v-slot="{ errors }">
                        <v-text-field
                          v-model="contraseña"
                          label="Nueva contraseña"
                          outlined
                          prepend-icon="mdi-lock"
                          color="blue darken-4"
                          :type="mostrarContraseñaDos ? 'text' : 'password'"
                          @click:append="mostrarContraseñaDos = !mostrarContraseñaDos"
                          :append-icon="mostrarContraseñaDos ? 'mdi-eye' : 'mdi-eye-off'"
                          :error-messages="obtenerValidaciones(errors, 'contraseña_nueva')"
                        />
                      </ValidationProvider>
                    </v-col>
                    <v-col cols="12">
                      <ValidationProvider name="Contraseña confirmada" rules="required|min:6|confirmed:Contraseña nueva" v-slot="{ errors }">
                        <v-text-field
                          v-model="contraseñaNueva"
                          label="Confirme la nueva contraseña"
                          outlined
                          prepend-icon="mdi-lock"
                          color="blue darken-4"
                          :type="mostrarContraseñaTres ? 'text' : 'password'"
                          @click:append="mostrarContraseñaTres = !mostrarContraseñaTres"
                          :append-icon="mostrarContraseñaTres ? 'mdi-eye' : 'mdi-eye-off'"
                          :error-messages="obtenerValidaciones(errors, 'contraseña_confirmada')"
                        />
                      </ValidationProvider>
                    </v-col>
                  </v-row>
                </v-card-text>
                <v-card-actions>
                  <v-spacer />
                  <v-btn
                    :loading="botonCargandoContraseña"
                    color="green"
                    class="white--text"
                    @click="handleSubmit(modificarContraseña)"
                  >
                    Modificar contraseña
                  </v-btn>
                </v-card-actions>
              </ValidationObserver>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-overlay :value="overlay" absolute dark opacity="0.8" color="#212121">
      <v-progress-circular indeterminate :size="90" :width="8">
        Cargando
      </v-progress-circular>
    </v-overlay>
  </v-container>
</template>

<script>
export default {
  name: 'EditarUsuarioAutenticado',
  data: () => ({
    mostrarContraseñaUno: false,
    mostrarContraseñaDos: false,
    mostrarContraseñaTres: false,
    botonCargando: false,
    botonCargandoContraseña: false,
    respuestaServidor: null,
    alerta: false,
    overlay: true,
    errores: [],
    contraseña: null,
    contraseñaActual: null,
    contraseñaNueva: null,
    usuario: [],
    validacionServidor: false,
    validacionServidorContraseña: false
  }),
  created () {
    this.obtenerUsuario()
  },
  methods: {
    modificarUsuario () {
      this.botonCargando = true
      this.$api({
        method: 'put',
        url: 'usuarios/modificar-usuario/' + this.usuario.id_usuario,
        headers: { Authorization: 'Bearer ' + localStorage.token },
        data: this.generarDatos()
      })
        .then((response) => {
          this.errores = []
          this.respuestaServidor = response.data.mensaje
        })
        .catch((error) => {
          this.validacionServidor = true
          this.errores = error.response.data.errors
        }).finally(() => {
          this.botonCargando = false
          this.activarNotificacion('usuario')
        })
    },
    modificarContraseña () {
      this.botonCargandoContraseña = true
      this.$api({
        method: 'put',
        url: 'usuarios/cambiar-contraseña-usuario/' + this.usuario.id_usuario,
        headers: { Authorization: 'Bearer ' + localStorage.token },
        data: {
          contraseña_usuario: this.contraseñaActual,
          contraseña_modificada: this.contraseñaNueva
        }
      })
        .then((response) => {
          this.errores = []
          this.respuestaServidor = response.data.mensaje
          setTimeout(() => {
            this.cerrarSesion()
          }, 5000)
        })
        .catch((error) => {
          this.validacionServidorContraseña = true
          this.errores = error.response.data.errors
        }).finally(() => {
          this.botonCargandoContraseña = false
          this.activarNotificacion('contraseña')
        })
    },
    obtenerUsuario () {
      this.$api({
        method: 'get',
        url: 'usuarios/obtener-usuario-autenticado',
        headers: { Authorization: 'Bearer ' + localStorage.token }
      }).then((response) => {
        this.usuario = response.data.usuario
        this.overlay = false
      })
    },
    cerrarSesion () {
      this.$api({
        method: 'get',
        url: 'cerrar-sesion',
        headers: { Authorization: 'Bearer ' + localStorage.token }
      }).then((response) => {
        this.$store.commit('cerrarSesion')
        this.$router.replace({ name: 'Inicio de sesion' })
      })
    },
    generarDatos () {
      return {
        id_rol: this.usuario.id_rol,
        nombre_usuario: this.usuario.nombre_usuario,
        apellido_paterno_usuario: this.usuario.apellido_paterno_usuario,
        apellido_materno_usuario: this.usuario.apellido_materno_usuario,
        celular_usuario: this.usuario.celular_usuario,
        correo_usuario: this.usuario.correo_usuario,
        carnet_identidad_usuario: this.usuario.carnet_identidad_usuario,
        codigo_usuario: this.usuario.codigo_usuario
      }
    },
    generarCodigo () {
      this.usuario.codigo_usuario =
        this.usuario.nombre_usuario.charAt(0) +
        this.usuario.apellido_paterno_usuario.charAt(0) +
        this.usuario.apellido_materno_usuario.charAt(0) +
        this.usuario.carnet_identidad_usuario
    },
    activarNotificacion (tipo) {
      if (Object.keys(this.errores).length > 0) {
        const mensaje = 'No se pudo completar la acción, por favor verifique los errores.'
        this.$toast.error(mensaje)
      } else {
        if (tipo === 'contraseña') {
          this.validacionServidorContraseña = false
          this.$toast.success(this.respuestaServidor)
          this.$refs.obsPass.reset()
        } else {
          this.validacionServidor = false
          this.$refs.obs.reset()
          this.$toast.success(this.respuestaServidor)
        }
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
