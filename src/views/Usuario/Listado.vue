<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card class="elevation-10">
          <v-card-title>
            <v-row>
              <v-col cols="12" md="10">
                <h3 style="word-break: normal" class="text-center text-md-left">
                  Listado de usuarios
                </h3>
              </v-col>
              <v-col cols="12" md="2" class="text-center text-md-end">
                <v-btn
                  v-if="tienePermiso(18)"
                  color="primary"
                  block
                  :to="{ name: 'Registrar usuario' }"
                >
                  Registrar
                  <v-icon right>mdi-account-plus</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-card-title>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-card elevation="10">
          <v-card-text>
            <v-row>
              <v-col cols="12" lg="3">
                <v-select
                  v-model="seleccionRol"
                  outlined
                  :items="roles"
                  label="Rol dentro del sistema"
                  :loading="loadingSelect"
                  item-text="rol"
                  item-value="id_rol"
                  hint="Seleccione el rol dentro del sistema"
                  persistent-hint
                  @change="recargarTabla()"
                />
              </v-col>
              <v-col cols="12" lg="2">
                <v-select
                  v-if="seleccionRol"
                  v-model="seleccionEstado"
                  outlined
                  :items="estados"
                  item-text="estado"
                  label="Estado"
                  item-value="id"
                  hint="Seleccione el estado"
                  persistent-hint
                  @change="recargarTabla()"
                />
              </v-col>
              <v-spacer />
              <v-col cols="12" lg="3">
                <v-text-field
                  v-if="seleccionRol"
                  v-model="busqueda"
                  append-icon="mdi-magnify"
                  label="Busqueda"
                  outlined
                  hint="Realice una busqueda"
                  persistent-hint
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-text>
            <v-data-table
              v-if="seleccionRol"
              :headers="headers"
              :items="items"
              :search="busqueda"
              :loading="loading"
              loading-text="Cargando"
              fixed-header
              :height="dynamicTableHeight"
            >
              <template v-slot:item.opciones="row">
                <div class="d-flex">
                  <v-tooltip bottom v-if="usuarioAdministrador">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        v-if="tienePermiso(19)"
                        color="secondary"
                        class="rounded-0"
                        small
                        dark
                        v-bind="attrs"
                        :to="{
                          name: 'Editar usuario',
                          params: { id: row.item['id_usuario'] },
                        }"
                        v-on="on"
                      >
                        <v-icon>mdi-pencil</v-icon>
                      </v-btn>
                    </template>
                    <span>Editar datos</span>
                  </v-tooltip>
                  <v-tooltip bottom v-if="idUsuario !== row.item['id_usuario']">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        v-if="tienePermiso(20)"
                        :color="
                          row.item['estado_usuario'] === 1
                            ? 'red'
                            : 'green darken-2'
                        "
                        class="rounded-0"
                        small
                        dark
                        v-bind="attrs"
                        v-on="on"
                        @click="cambiarEstadoUsuario(row.item['id_usuario'])"

                      >
                        <v-icon
                          v-if="row.item['estado_usuario'] === 1"
                          color="white"
                        >
                          mdi-account-cancel
                        </v-icon>
                        <v-icon
                          v-if="row.item['estado_usuario'] === 0"
                          color="white"
                        >
                          mdi-account-check
                        </v-icon>
                      </v-btn>
                    </template>
                    <span v-if="row.item['estado_usuario'] === 1"
                      >Desactivar cuenta</span
                    >
                    <span v-if="row.item['estado_usuario'] === 0"
                      >Activar cuenta</span
                    >
                  </v-tooltip>
                  <v-tooltip bottom v-if="idUsuario !== row.item['id_usuario']">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        v-if="tienePermiso(21)"
                        color="info"
                        class="rounded-0"
                        small
                        dark
                        v-bind="attrs"
                        v-on="on"
                        @click="abrirVentanaConfirmacion(row.item['id_usuario'])"
                      >
                        <v-icon>mdi-account-key</v-icon>
                      </v-btn>
                    </template>
                    <span>Restablecer contraseña</span>
                  </v-tooltip>
                </div>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="ventanaConfirmacion" persistent width="500">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          Confirmar acción
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="mt-5">
          <p class="text-justify black--text">
            La contraseña sera restablecida utilizando como información el número de carnet de identidad del usuario.
          </p>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="cerrarVentanaConfirmacion">
            Cancelar
          </v-btn>
          <v-btn
            color="green"
            class="white--text"
            :loading="botonCargando"
            @click="restablecerClave"
          >
            Confirmar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
import usuarioHeaders from '../../commons/tableHeaders/usuario'
import { tableMixin } from '@/commons/mixins/tableMixin'
import sesion from '@/services/sesion'
export default {
  mixins: [tableMixin],
  name: 'ListadoDeUsuarios',
  data: () => ({
    headers: usuarioHeaders,
    busqueda: null,
    items: [],
    respuestaServidor: null,
    loading: true,
    loadingSelect: true,
    seleccionRol: null,
    seleccionEstado: 'todos',
    roles: [],
    estados: [
      { id: 'todos', estado: 'Todos' },
      { id: 1, estado: 'Activos' },
      { id: 0, estado: 'Inactivos' }
    ],
    validacionServidor: false,
    ventanaConfirmacion: false,
    botonCargando: false,
    idUsuarioContraseña: null
  }),
  computed: {
    idUsuario () {
      return sesion.obtenerUsuario().id_usuario
    },
    usuarioAdministrador () {
      return sesion.obtenerUsuario().id_rol === 1
    },
    tienePermiso () {
      return this.$store.getters.tienePermiso
    }
  },
  activated () {
    if (this.seleccionRol && this.$store.state.recargar) {
      this.recargarTabla()
      this.$store.commit('noRecargarDatos')
    }
  },
  created () {
    this.obtenerRoles()
  },
  methods: {
    abrirVentanaConfirmacion (id) {
      this.ventanaConfirmacion = true
      this.idUsuarioContraseña = id
    },
    cerrarVentanaConfirmacion () {
      this.ventanaConfirmacion = false
      this.idUsuarioContraseña = null
    },
    obtenerRoles () {
      this.$api({
        method: 'get',
        url: 'roles/obtener-roles',
        headers: { Authorization: 'Bearer ' + localStorage.token }
      }).then((response) => {
        this.roles = response.data.roles
        this.loadingSelect = false
      })
    },
    obtenerUsuarios () {
      this.$api({
        method: 'get',
        url:
          'usuarios/obtener-usuarios/' +
          this.seleccionRol +
          '/' +
          this.seleccionEstado,
        headers: { Authorization: 'Bearer ' + localStorage.token }
      }).then((response) => {
        const { usuarios } = response.data
        this.items = usuarios
        this.loading = false
      })
    },
    cambiarEstadoUsuario (id) {
      this.$api({
        method: 'put',
        url: 'usuarios/cambiar-estado-usuario/' + id,
        headers: { Authorization: 'Bearer ' + localStorage.token }
      }).then((response) => {
        this.validacionServidor = false
        this.respuestaServidor = response.data.mensaje
      }).catch((error) => {
        this.respuestaServidor = error.response.data.message
        this.validacionServidor = true
      }).finally(() => {
        this.activarNotificacion()
        this.obtenerUsuarios()
      })
    },
    restablecerClave () {
      console.log(this.idUsuarioContraseña)
      this.botonCargando = true
      this.$api({
        method: 'put',
        url: 'usuarios/restablecer-contraseña-usuario/' + this.idUsuarioContraseña,
        headers: {
          Authorization: 'Bearer ' + localStorage.token
        }
      }).then((response) => {
        this.validacionServidor = false
        this.respuestaServidor = response.data.mensaje
      }).catch((error) => {
        this.respuestaServidor = error.response.data.message
        this.validacionServidor = true
      }).finally(() => {
        this.botonCargando = false
        this.ventanaConfirmacion = false
        this.activarNotificacion()
      })
    },
    recargarTabla () {
      this.items = []
      this.loading = true
      this.busqueda = null
      this.obtenerUsuarios()
    },
    activarNotificacion () {
      if (this.validacionServidor) {
        this.$toast.error(this.respuestaServidor)
      } else {
        this.$toast.success(this.respuestaServidor)
      }
    }
  }
}
</script>
