import sesion from '../services/sesion'
export default {
  state: {
    usuarioActual: null,
    permisosUsuario: null,
    rolUsuario: null,
    usuarioAutenticado: false,
    recargar: false,
    suministrosDesmarcados: []
  },
  getters: {
    nombreCompleto (state) {
      return state.usuarioActual.nombre_completo
    },
    rolActual (state) {
      return state.rolUsuario.rol
    },
    codigoUsuario (state) {
      return state.usuarioActual.codigo_usuario
    },
    permisosAsignados (state) {
      return state.permisosUsuario
    },
    tienePermiso: (state) => (idPermiso) => {
      return state.permisosUsuario.includes(idPermiso)
    },
    suministrosDesmarcados (state) {
      return state.suministrosDesmarcados
    }
  },
  mutations: {
    recargarDatos (state) {
      state.recargar = true
    },
    noRecargarDatos (state) {
      state.recargar = false
    },
    inicioDeSesionCorrecto (state, datos) {
      state.usuarioAutenticado = true
      sesion.guardarDatos(datos)
      state.usuarioActual = sesion.obtenerUsuario()
      state.permisosUsuario = sesion.obtenerPermisos()
      state.rolUsuario = sesion.obtenerRol()
    },
    cerrarSesion (state) {
      state.usuarioAutenticado = false
      sesion.eliminarDatos()
    },
    verificarInicioDeSesion (state) {
      if (
        localStorage.getItem('usuario') &&
        localStorage.getItem('token') &&
        localStorage.getItem('usuarioAutenticado')
      ) {
        state.usuarioAutenticado = true
      }
    },
    agregarSuministroDesmarcado (state, suministro) {
      state.suministrosDesmarcados.push(suministro)
    },

    quitarSuministroDesmarcado (state, suministro) {
      state.suministrosDesmarcados = state.suministrosDesmarcados.filter(s => s !== suministro)
    },

    limpiarSuministrosDesmarcados (state) {
      state.suministrosDesmarcados = []
    }
  },
  actions: {
    limpiarSuministrosSiEsNecesario ({ commit, state }, rutaActual) {
      // Verificar si la ruta actual es diferente de la ruta donde se está modificando el array
      if (rutaActual !== 'Editar orden de venta') {
        commit('limpiarSuministrosDesmarcados')
      }
    }
  },
  modules: {}
}
