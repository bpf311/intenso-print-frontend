<template>
  <v-card elevation="5" class="rounded-lg">
    <v-card-title>
      <v-container class="elevation-4">
        <v-row>
          <v-col cols="12" lg="6">
            <h3 style="word-break: normal" class="text-center text-md-left"> Editar datos y permisos del rol </h3>
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
            <v-col cols="12" md="6" class="pa-5">
              <v-row class="elevation-4">
                <v-col cols="12">
                  <v-text-field
                    v-model="rol.rol"
                    label="Rol"
                    outlined
                    prepend-icon="mdi-account-box"
                    color="blue darken-4"
                  />
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="rol.descripcion_rol"
                    label="Descripcion"
                    outlined
                    prepend-icon="mdi-account-box"
                    color="blue darken-4"
                  />
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" md="6" class="pa-5">
              <v-row class="elevation-4">
                <v-col>
                  <v-simple-table fixed-header height="290px">
                    <thead>
                      <tr>
                        <th>Permiso</th>
                        <th>Asignar</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="permiso in permisos" :key="permiso.id_permiso">
                        <td>{{ permiso.permiso }}</td>
                        <td>
                          <v-switch
                            v-model="permisosAsignados"
                            inset
                            :value="permiso.id_permiso"
                          ></v-switch>
                        </td>
                      </tr>
                    </tbody>
                  </v-simple-table>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-card-text>
    <v-card-actions class="mb-2 mr-2">
      <v-spacer />
      <v-btn color="error" class="ml-2" :to="{ name: 'Listado de roles' }">
        Atras
      </v-btn>
      <v-btn :loading="botonCargando" color="success" class="mr-0" @click="modificarRol()">
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
  name: 'EditarRol',
  data: () => ({
    botonCargando: false,
    respuestaServidor: null,
    alerta: false,
    overlay: true,
    errores: [],
    rol: {},
    permisos: [],
    permisosAsignados: []
  }),
  created () {
    this.obtenerPermisos()
    this.obtenerRol()
  },
  methods: {
    obtenerPermisos () {
      this.$api({
        method: 'get',
        url: 'permisos/obtener-permisos',
        headers: { Authorization: 'Bearer ' + localStorage.token }
      }).then((response) => {
        this.permisos = response.data.permisos
      })
    },
    modificarRol () {
      this.botonCargando = true
      this.$api({
        method: 'put',
        url: 'roles/modificar-rol/' + this.$route.params.id,
        headers: { Authorization: 'Bearer ' + localStorage.token },
        data: this.generarDatos()
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
    obtenerRol () {
      this.$api({
        method: 'get',
        url: 'roles/editar-rol/' + this.$route.params.id,
        headers: { Authorization: 'Bearer ' + localStorage.token }
      }).then((response) => {
        const permisos = response.data.rol.permisos.map(permiso => permiso.id_permiso)
        this.rol = response.data.rol
        this.permisosAsignados = permisos
        this.overlay = false
      })
    },
    generarDatos () {
      return {
        rol: this.rol.rol,
        descripcion_rol: this.rol.descripcion_rol,
        permisos: this.permisosAsignados
      }
    }
  }
}
</script>
