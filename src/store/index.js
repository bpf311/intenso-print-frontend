import sesion from '../services/sesion'
export default {
  state: {
    usuarioActual: null,
    permisosUsuario: null,
    rolUsuario: null,
    usuarioAutenticado: false,
    recargar: false,
    pasoRegistroOrdenDeTrabajo: 1,
    ordenDeTrabajo: {}
  },
  getters: {
    pasoActual (state) {
      return state.pasoRegistroOrdenDeTrabajo
    },
    datosOrdenDeTrabajo (state) {
      return state.ordenDeTrabajo
    },
    nombreCompleto (state) {
      return state.usuarioActual.nombre_completo
    },
    rolActual (state) {
      return state.rolUsuario.rol
    },
    codigoUsuario (state) {
      return state.usuarioActual.codigo_usuario
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
    pasoSiguiente (state) {
      state.pasoRegistroOrdenDeTrabajo++
    },
    pasoAnterior (state) {
      state.pasoRegistroOrdenDeTrabajo--
    },
    asignarDatosOrdenDeTrabajo (state, datos) {
      Object.keys(datos).forEach(function (key) {
        state.ordenDeTrabajo[key] = datos[key]
      })
    },
    reiniciarOrden (state) {
      state.ordenDeTrabajo = {}
      state.pasoRegistroOrdenDeTrabajo = 1
    }
  },
  actions: {},
  modules: {}
}
