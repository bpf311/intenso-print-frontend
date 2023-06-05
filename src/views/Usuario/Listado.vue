<template>
  <v-card elevation="5" class="rounded-lg">
    <v-card-title>
      <v-container class="elevation-4">
        <v-row>
          <v-col cols="12" lg="6">
            <h3 style="word-break: normal" class="text-center text-md-left"> Listado de usuarios </h3>
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="12" lg="2">
            <v-btn color="primary" block :to="{ name: 'Registrar usuario' }">
              Registrar
              <v-icon
                right
              >
                mdi-account-plus
              </v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card-title>
    <v-card-subtitle class="mt-2">
      <v-container class="elevation-4">
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
              hint="Realize una busqueda"
              persistent-hint
            ></v-text-field>
          </v-col>
        </v-row>
      </v-container>
    </v-card-subtitle>
    <v-card-text>
      <v-data-table
        v-if="seleccionRol"
        :headers="headers"
        :items="items"
        :search="busqueda"
        :loading="loading"
        loading-text="Cargando"
        class="elevation-4"
        fixed-header
        height="240px"
      >
        <template v-slot:item.opciones="row">
          <div class="d-flex">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
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
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  :color="row.item['estado_usuario'] === 1 ? 'red' : 'green darken-2'"
                  class="rounded-0"
                  small
                  dark
                  v-bind="attrs"
                  v-on="on"
                  @click="cambiarEstadoUsuario(row.item['id_usuario'])"
                >
                  <v-icon v-if="row.item['estado_usuario'] === 1" color="white">
                    mdi-account-cancel
                  </v-icon>
                  <v-icon v-if="row.item['estado_usuario'] === 0" color="white">
                    mdi-account-check
                  </v-icon>
                </v-btn>
              </template>
              <span v-if="row.item['estado_usuario'] === 1"
              >Desactivar cuenta</span>
              <span v-if="row.item['estado_usuario'] === 0"
              >Activar cuenta</span>
            </v-tooltip>
          </div>
        </template>
      </v-data-table>
    </v-card-text>
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
import usuarioHeaders from '../../commons/tableHeaders/usuario'
export default {
  name: 'ListadoDeUsuarios',
  data: () => ({
    headers: usuarioHeaders,
    busqueda: null,
    items: [],
    respuestaServidor: null,
    alerta: false,
    loading: true,
    loadingSelect: true,
    seleccionRol: null,
    seleccionEstado: 'todos',
    roles: [],
    estados: [
      { id: 'todos', estado: 'Todos' },
      { id: 1, estado: 'Activos' },
      { id: 0, estado: 'Inactivos' }
    ]
  }),
  activated () {
    if (
      this.seleccionRol &&
      this.$store.state.recargar
    ) {
      this.recargarTabla()
      this.$store.commit('noRecargarDatos')
    }
  },
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
        this.respuestaServidor = response.data.mensaje
        this.alerta = true
        this.obtenerUsuarios()
      })
    },
    recargarTabla () {
      this.items = []
      this.loading = true
      this.busqueda = null
      this.obtenerUsuarios()
    }
  }
}
</script>
