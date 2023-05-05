import sesion from '../services/sesion'
const usuario = sesion.obtenerUsuario()
const permisos = sesion.obtenerPermisos()
const rol = sesion.obtenerRol()
export default {
  state: {
    usuarioActual: usuario,
    permisosUsuario: permisos,
    rolUsuario: rol,
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
      console.log(state.rolUsuario.rol)
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
