<template>
  <v-container>
    <v-row v-if="usuario">
      <v-col cols="12">
        <v-card class="elevation-10">
          <v-card-title>
            <v-row>
              <v-col cols="12" md="10">
                <h3 style="word-break: normal" class="text-center text-md-left">
                  Editar datos del usuario
                </h3>
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
                  <ValidationProvider  name="Nombre(s)" rules="required" v-slot="{ errors }">
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
                  <ValidationProvider name="Rol" rules="required" v-slot="{ errors }">
                    <v-select
                      v-model="usuario.id_rol"
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
                Modificar
              </v-btn>
            </v-card-actions>
          </ValidationObserver>
        </v-card>
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
  name: 'EditarUsuario',
  data: () => ({
    botonCargando: false,
    respuestaServidor: null,
    overlay: true,
    roles: [],
    errores: [],
    usuario: [],
    validacionServidor: false
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
          this.errores = []
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
