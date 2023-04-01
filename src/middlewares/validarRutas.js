export function validarRutas (store, router) {
  router.beforeEach((to, from, next) => {
    const usuarioActivo = store.state.usuarioAutenticado

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
