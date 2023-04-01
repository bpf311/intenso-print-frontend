import menu from '../commons/menu'

const sesion = {
  guardarDatos (datos) {
    const { permisos, usuario, rol, token } = datos
    const permisosAsignados = permisos.map(
      (elemento) => elemento.id_permiso
    )
    localStorage.setItem('usuario', JSON.stringify(usuario))
    localStorage.setItem('permisos', JSON.stringify(permisosAsignados))
    localStorage.setItem('rol', JSON.stringify(rol))
    localStorage.setItem('token', token)
    localStorage.setItem('usuarioAutenticado', 'true')
  },

  eliminarDatos () {
    localStorage.clear()
  },

  obtenerPermisos () {
    if (JSON.parse(localStorage.getItem('permisos')) === null) {
      return null
    }
    return JSON.parse(localStorage.getItem('permisos'))
  },

  obtenerUsuario () {
    if (JSON.parse(localStorage.getItem('usuario')) === null) {
      return null
    }
    return JSON.parse(localStorage.getItem('usuario'))
  },

  obtenerRol () {
    if (JSON.parse(localStorage.getItem('rol')) === null) {
      return null
    }
    return JSON.parse(localStorage.getItem('rol'))
  },

  obtenerMenu () {
    const permisos = this.obtenerPermisos()

    return menu.filter((item) => {
      if (item.id) {
        return permisos.includes(item.id)
      } else if (item.children) {
        const objetosAnidados = item.children.filter((child) =>
          permisos.includes(child.id)
        )
        if (objetosAnidados.length) {
          item.children = objetosAnidados
          return true
        }
      }
      return false
    })
  }
}

export default sesion
