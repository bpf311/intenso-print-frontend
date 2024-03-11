export function validarRutas (store, router) {
  router.beforeEach((to, from, next) => {
    const usuarioActivo = store.state.usuarioAutenticado
    const rutaAnterior = from.name
    const rutaActual = to.name

    if (rutaAnterior === 'Editar orden de venta') {
      // Llama a la acción del store para limpiar el array de id_suministros
      store.dispatch('limpiarSuministrosSiEsNecesario', rutaActual)
    }

    if (
      to.matched.some((record) => record.meta.requiereIniciarSesion) &&
      !usuarioActivo
    ) {
      next({ name: 'Inicio de sesion' })
    } else {
      next()
    }

    if (to.name === 'Inicio de sesion' && usuarioActivo) {
      next({ name: 'Calendario' })
    } else {
      next()
    }
  })
}
