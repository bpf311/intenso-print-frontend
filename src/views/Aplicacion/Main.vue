<template>
  <div>
    <v-navigation-drawer v-model="menu" app dark color="#171721">
      <v-list>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="text-h6">
              {{ usuario }}
            </v-list-item-title>
            <v-list-item-subtitle> {{ rolUsuario }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-divider />
      <v-list dense nav>
        <template v-for="(item, index) in itemsMenu">
          <v-list-item
            v-if="!item.children"
            :key="index"
            color="indigo"
            class="my-2"
            :to="item.to"
          >
            <v-list-item-icon class="icono">
              <v-icon v-text="item.icon" />
            </v-list-item-icon>
            <v-list-item-title v-text="item.title" />
          </v-list-item>
          <v-list-group v-else :key="index" color="indigo" no-action sub-groups>
            <template v-slot:activator>
              <v-list-item-icon class="icono">
                <v-icon v-text="item.icon" />
              </v-list-item-icon>
              <v-list-item-title v-text="item.title" />
            </template>
            <template>
              <v-list-item
                v-for="(subItem, subIndex) in item.children"
                :key="subIndex"
                :to="subItem.to"
                link
                class="subitem my-2"
              >
                <v-list-item-title v-text="subItem.title" />
                <v-list-item-icon>
                  <v-icon v-text="subItem.icon" />
                </v-list-item-icon>
              </v-list-item>
            </template>
          </v-list-group>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar app color="primary" dark>
      <v-app-bar-nav-icon @click.stop="menu = !menu" />
      <v-spacer />
      <v-avatar class="mr-1">
        <img src="@/assets/avatar.png" alt="John" />
      </v-avatar>
      <div class="text-center">
        <v-menu offset-y rounded="lg" transition="fab-transition">
          <template v-slot:activator="{ on, attrs }">
            <v-btn text v-bind="attrs" small v-on="on">
              <h2>{{ codigoUsuario }}</h2>
              <v-icon right dark> mdi-menu-down </v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item class="opcionesUsuario" :to="{ name: 'Cuenta de usuario' }">
              <v-list-item-icon>
                <v-icon>mdi-account</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Mi cuenta</v-list-item-title>
            </v-list-item>
            <v-list-item class="opcionesUsuario" @click="cerrarSesion()">
              <v-list-item-icon>
                <v-icon>mdi-logout</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Cerrar sesion</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </v-app-bar>
    <v-main class="mx-3">
      <v-container>
        <router-view />
      </v-container>
    </v-main>
  </div>
</template>
<style scoped>
.opcionesUsuario {
  cursor: pointer;
}
.opcionesUsuario:hover {
  background-color: #f2f4f4;
}
.subitem {
  padding-left: 25px !important;
}
.icono {
  margin-right: 15px !important;
}
</style>
<script>
import sesion from '../../services/sesion'
export default {
  data () {
    return {
      menu: true,
      itemsMenu: sesion.obtenerMenu()
    }
  },
  computed: {
    usuario () {
      return this.$store.getters.nombreCompleto
    },
    rolUsuario () {
      return this.$store.getters.rolActual
    },
    codigoUsuario () {
      return this.$store.getters.codigoUsuario
    }
  },
  methods: {
    cerrarSesion () {
      this.$api({
        method: 'get',
        url: 'sesion/cerrar-sesion',
        headers: { Authorization: 'Bearer ' + localStorage.token }
      }).then((response) => {
        this.$store.commit('cerrarSesion')
        this.$router.replace({ name: 'Inicio de sesion' })
      })
    }
  }
}
</script>
