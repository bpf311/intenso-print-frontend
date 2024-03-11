<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card class="elevation-10">
          <v-card-title>
            <v-row>
              <v-col cols="12" md="10">
                <h3 style="word-break: normal" class="text-center text-md-left">
                  Listado de roles
                </h3>
              </v-col>
              <v-col cols="12" md="2" class="text-center text-md-end">
                <v-btn
                  v-if="tienePermiso(31)"
                  color="primary"
                  block
                  :to="{ name: 'Registrar rol' }"
                >
                  Registrar
                  <v-icon right>mdi-shield-plus</v-icon>
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
              <v-spacer />
              <v-col cols="12" lg="3">
                <v-text-field
                  v-model="busqueda"
                  append-icon="mdi-magnify"
                  label="Busqueda"
                  outlined
                  hint="Realize una busqueda"
                  persistent-hint
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="items"
              :loading="loading"
              loading-text="Cargando"
              fixed-header
              :height="dynamicTableHeight"
              :footer-props="{
                showCurrentPage: true,
                showFirstLastPage: true,
                firstIcon: 'mdi-arrow-collapse-left',
                lastIcon: 'mdi-arrow-collapse-right',
                prevIcon: 'mdi-minus',
                nextIcon: 'mdi-plus'
              }"
            >
              <template v-slot:item.opciones="row">
                <div class="d-flex">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        color="info"
                        class="rounded-0"
                        small
                        dark
                        v-bind="attrs"
                        v-on="on"
                        @click="abrirVentanaPermisos(row.item)"
                      >
                        <v-icon>mdi-eye</v-icon>
                      </v-btn>
                    </template>
                    <span>Ver permisos asignados</span>
                  </v-tooltip>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        v-if="tienePermiso(32)"
                        color="secondary"
                        class="rounded-0"
                        small
                        dark
                        v-bind="attrs"
                        v-on="on"
                        :to="{
                    name: 'Editar rol',
                    params: { id: row.item['id_rol'] },
                  }"
                      >
                        <v-icon>mdi-pencil</v-icon>
                      </v-btn>
                    </template>
                    <span>Editar datos</span>
                  </v-tooltip>
                </div>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-card elevation="5" class="rounded-lg">
      <v-dialog v-model="ventanaPermisos" width="500" persistent scrollable>
        <v-card>
          <v-card-title class="text-h5 grey lighten-2">
            Permisos asignados al rol
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="mt-5">
            <v-form>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <div>
                      <ol>
                        <li class="black--text" v-for="permiso in permisos" :key="permiso.id_permiso">
                          {{ permiso.permiso }}
                        </li>
                      </ol>
                    </div>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error" @click="cerrarVentanaPermisos"> Cerrar </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
  </v-container>
</template>
<script>
import rolHeaders from '../../commons/tableHeaders/rol'
import { tableMixin } from '@/commons/mixins/tableMixin'
export default {
  mixins: [tableMixin],
  name: 'ListadoDeRoles',
  data: () => ({
    ventanaPermisos: false,
    permisos: [],
    headers: rolHeaders,
    busqueda: null,
    items: [],
    respuestaServidor: null,
    loading: true,
    loadingSelect: true
  }),
  activated () {
    if (this.$store.state.recargar) {
      this.recargarTabla()
      this.$store.commit('noRecargarDatos')
    }
  },
  created () {
    this.obtenerRoles()
  },
  computed: {
    tienePermiso () {
      return this.$store.getters.tienePermiso
    }
  },
  methods: {
    abrirVentanaPermisos (rol) {
      this.permisos = rol.permisos
      this.ventanaPermisos = true
    },
    cerrarVentanaPermisos () {
      this.ventanaPermisos = false
      this.permisos = []
    },
    obtenerRoles () {
      this.$api({
        method: 'get',
        url: 'roles/obtener-roles',
        headers: { Authorization: 'Bearer ' + localStorage.token }
      }).then((response) => {
        this.items = response.data.roles
        this.loading = false
      })
    },
    recargarTabla () {
      this.items = []
      this.loading = true
      this.obtenerRoles()
    }
  }
}
</script>
