<template>
  <v-app style="background-color: #d9dddd">
    <template v-if="usuarioActivo">
      <aplicacion />
    </template>
    <template v-else>
      <inicio-de-sesion />
    </template>
  </v-app>
</template>
<script>
import Aplicacion from './views/Aplicacion/Main'
import InicioDeSesion from './views/Sesion/InicioDeSesion'
export default {
  components: {
    Aplicacion,
    InicioDeSesion
  },
  computed: {
    usuarioActivo () {
      return this.$store.state.usuarioAutenticado
    }
  }
}
</script>
