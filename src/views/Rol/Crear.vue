<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card class="elevation-10">
          <v-card-title>
            <v-row>
              <v-col cols="12" md="10">
                <h3 style="word-break: normal" class="text-center text-md-left">
                  Registrar nuevo rol
                </h3>
              </v-col>
              <v-col cols="12" md="2" class="text-center text-md-end">
                <v-btn
                  block
                  color="error"
                  :to="{ name: 'Listado de roles' }"
                >
                  <v-icon left>mdi-arrow-left</v-icon>
                  Atras
                </v-btn>
              </v-col>
            </v-row>
          </v-card-title>
        </v-card>
      </v-col>
      <v-col cols="12">
        <ValidationObserver v-slot="{ handleSubmit }" ref="obs">
          <v-row>
            <v-col cols="12" md="5">
              <v-card class="fill-height elevation-10">
                <v-card-title>
                  <v-container class="elevation-4">
                    <v-row>
                      <v-col cols="12">
                        <h4 class="text-center">Datos generales</h4>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-title>
                <v-card-text>
                  <v-alert
                    v-if="validacionServidor"
                    outlined
                    prominent
                    type="error"
                    elevation="2"
                    text
                    class="mb-8"
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
                      <ValidationProvider name="Rol" rules="required" v-slot="{ errors }">
                        <v-text-field
                          v-model="rol.nombre"
                          label="Rol"
                          outlined
                          prepend-icon="mdi-account-box"
                          color="blue darken-4"
                          :error-messages="obtenerValidaciones(errors, 'rol')"
                        />
                      </ValidationProvider>
                    </v-col>
                    <v-col cols="12">
                      <ValidationProvider name="Descripción" rules="required" v-slot="{ errors }">
                        <v-textarea
                          v-model="rol.descripcion"
                          label="Descripción"
                          outlined
                          prepend-icon="mdi-account-box"
                          color="blue darken-4"
                          :error-messages="obtenerValidaciones(errors, 'descripcion')"
                        />
                      </ValidationProvider>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" md="7">
              <v-card class="fill-height elevation-10">
                <v-card-title>
                  <v-container class="elevation-4">
                    <v-row>
                      <v-col cols="12">
                        <h4 class="text-center">Permisos</h4>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-title>
                <v-card-text>
                  <v-alert
                    v-if="alMenosUnPermisoSeleccionado"
                    outlined
                    prominent
                    type="error"
                    elevation="2"
                    text
                    class="mb-8"
                  >
                    Debe seleccionar al menos un permiso
                  </v-alert>
                  <v-simple-table fixed-header :height="dynamicTableHeight">
                    <tbody v-for="(permisosCategoria, categoria) in permisosAgrupados" :key="categoria">
                    <tr>
                      <th colspan="2" class="blue text-center lighten-3 black--text text--darken-2 font-weight-bold">{{ categoria }}</th>
                    </tr>
                    <tr>
                      <th class="blue-grey lighten-4 black--text text--darken-2 font-weight-bold">Permiso</th>
                      <th class="blue-grey lighten-4 black--text text--darken-2 font-weight-bold">Estado</th>
                    </tr>
                    <tr v-for="(permiso, index) in permisosCategoria" :key="permiso.id_permiso">
                      <td>{{ permiso.permiso }}</td>
                      <td>
                        <v-switch
                          v-model="permisosAsignados"
                          inset
                          :value="permiso.id_permiso"
                          :disabled="index > 0 && !permisosAsignados.includes(permisosCategoria[0].id_permiso) && categoria !== 'Reporte' && categoria !== 'Recibo'"
                          @change="updateSwitches(categoria)"
                        ></v-switch>
                        {{ categoria }}
                      </td>
                    </tr>
                    </tbody>
                  </v-simple-table>
                </v-card-text>
                <v-card-actions class="mb-2 mr-2">
                  <v-spacer/>
                  <v-btn
                    :loading="botonCargando"
                    color="green"
                    class="white--text"
                    @click="handleSubmit(registrarRol)"
                  >
                    Registrar
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </ValidationObserver>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { tableMixin } from '@/commons/mixins/tableMixin'

export default {
  mixins: [tableMixin],
  name: 'CrearRol',

  data: () => ({
    botonCargando: false,
    respuestaServidor: null,
    permisos: [],
    errores: [],
    rol: {
      nombre: null,
      descripcion: null
    },
    permisosAsignados: [],
    validacionServidor: false,
    alMenosUnPermisoSeleccionado: false
  }),
  created () {
    this.obtenerPermisos()
  },
  computed: {
    permisosAgrupados () {
      const grupos = {}
      this.permisos.forEach((permiso) => {
        if (!grupos[permiso.categoria]) {
          grupos[permiso.categoria] = []
        }
        grupos[permiso.categoria].push(permiso)
      })
      return grupos
    }
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
      if (this.permisosAsignados.length === 0) {
        this.alMenosUnPermisoSeleccionado = true
        return
      } else {
        this.alMenosUnPermisoSeleccionado = false
      }
      this.botonCargando = true
      this.$api({
        method: 'post',
        url: 'roles/registrar-rol',
        headers: { Authorization: 'Bearer ' + localStorage.token },
        data: this.generarDatos()
      })
        .then((response) => {
          this.errores = []
          this.reiniciarDatos(this.rol)
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
    },
    activarNotificacion () {
      if (Object.keys(this.errores).length > 0) {
        const mensaje = 'No se pudo completar la acción, por favor verifique los errores.'
        this.$toast.error(mensaje)
      } else {
        this.validacionServidor = false
        this.alMenosUnPermisoSeleccionado = false
        this.$refs.obs.reset()
        this.$toast.success(this.respuestaServidor)
      }
    },
    obtenerValidaciones (errors, field) {
      const veeErrors = errors || []
      const serverErrors = this.errores[field] || []
      return [...veeErrors, ...serverErrors]
    },
    updateSwitches (categoria) {
      if (categoria === 'Reporte' || categoria === 'Recibo') {
        return
      }
      const primerPermiso = this.permisosAgrupados[categoria][0].id_permiso
      if (!this.permisosAsignados.includes(primerPermiso)) {
        for (let i = 1; i < this.permisosAgrupados[categoria].length; i++) {
          const index = this.permisosAsignados.indexOf(this.permisosAgrupados[categoria][i].id_permiso)
          if (index !== -1) {
            this.permisosAsignados.splice(index, 1)
          }
        }
      }
    }
  }
}
</script>
