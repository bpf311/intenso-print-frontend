<template>
  <v-card elevation="5" class="rounded-lg">
    <v-card-title>
      <v-container class="elevation-4">
        <v-row>
          <v-col cols="12" lg="6">
            <h3 class="text-center text-md-left"> Registrar nuevo rol </h3>
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
            <v-col cols="12" md="6">
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="rol.nombre"
                    label="Rol"
                    outlined
                    prepend-icon="mdi-account-box"
                    color="blue darken-4"
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="rol.descripcion"
                    label="Descripcion"
                    outlined
                    prepend-icon="mdi-account-box"
                    color="blue darken-4"
                  />
                </v-col>
                {{ permisosAsignados }}
              </v-row>
            </v-col>
            <v-col cols="12" md="6">
              <v-row>
                <v-col>
                  <v-simple-table>
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
      <v-btn :loading="botonCargando" color="green" class="white--text" @click="registrarRol()">
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
  name: 'CrearRol',
  data: () => ({
    botonCargando: false,
    respuestaServidor: null,
    alerta: false,
    permisos: [],
    errores: [],
    rol: {
      nombre: null,
      descripcion: null
    },
    permisosAsignados: []
  }),
  created () {
    this.obtenerPermisos()
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
    registrarRol () {
      this.botonCargando = true
      this.$api({
        method: 'post',
        url: 'roles/registrar-rol',
        headers: { Authorization: 'Bearer ' + localStorage.token },
        data: this.generarDatos()
      })
        .then((response) => {
          this.botonCargando = false
          this.errores = []
          this.reiniciarDatos(this.rol)
          this.respuestaServidor = response.data.mensaje
          this.alerta = true
          this.$store.commit('recargarDatos')
        })
        .catch((error) => {
          this.botonCargando = false
          this.errores = error.response.data.errors
        })
    },
    generarDatos () {
      return {
        rol: this.rol.nombre,
        descripcion_rol: this.rol.descripcion,
        permisos: this.permisosAsignados
      }
    },
    reiniciarDatos (obj) {
      this.permisosAsignados = []
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
