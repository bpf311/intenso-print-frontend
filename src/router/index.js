import Vue from 'vue'
import VueRouter from 'vue-router'
import InicioDeSesion from '@/views/Sesion/InicioDeSesion.vue'
import Sistema from '@/views/Sistema.vue'
import Dashboard from '@/views/Dashboard/Dashboard.vue'
import IndexUsuario from '@/views/Usuario/Index.vue'
import ListadoDeUsuarios from '@/views/Usuario/Listado.vue'
import CrearUsuario from '@/views/Usuario/Crear.vue'
import EditarUsuario from '@/views/Usuario/Editar.vue'
import UsuarioAutenticado from '@/views/Cuenta/Index.vue'
import UsuarioDesactivado from '@/views/CuentaInactiva/Index.vue'
import IndexCliente from '@/views/Cliente/Index.vue'
import ListadoDeClientes from '@/views/Cliente/Listado.vue'
import CrearCliente from '@/views/Cliente/Crear.vue'
import EditarCliente from '@/views/Cliente/Editar.vue'
import OrdenesDeCliente from '@/views/Cliente/Ordenes.vue'
import IndexSuministro from '@/views/Suministro/Index.vue'
import ListadoDeSuministros from '@/views/Suministro/Listado.vue'
import CrearSuministro from '@/views/Suministro/Crear.vue'
import CrearIngresoSuministro from '@/views/Suministro/CrearIngreso.vue'
import DatosSuministro from '@/views/Suministro/Datos.vue'
import EditarSuministro from '@/views/Suministro/Editar.vue'
import IndexOrdenDeTrabajo from '@/views/OrdenDeTrabajo/Index.vue'
import ListadoDeOrdenesDeTrabajo from '@/views/OrdenDeTrabajo/Listado.vue'
import CrearOrdenDeTrabajo from '@/views/OrdenDeTrabajo/Crear.vue'
import EditarOrdenDeTrabajo from '@/views/OrdenDeTrabajo/Editar.vue'
import DatosOrdenDeTrabajo from '@/views/OrdenDeTrabajo/Datos.vue'
import CrearPagoOrdenDeTrabajo from '@/views/OrdenDeTrabajo/CrearPago.vue'
import IndexRol from '@/views/Rol/Index.vue'
import ListadoDeRoles from '@/views/Rol/Listado.vue'
import CrearRol from '@/views/Rol/Crear.vue'
import EditarRol from '@/views/Rol/Editar.vue'
import IndexProveedor from '@/views/Proveedor/Index.vue'
import ListadoDeProveedores from '@/views/Proveedor/Listado.vue'
import CrearProveedor from '@/views/Proveedor/Crear.vue'
import EditarProveedor from '@/views/Proveedor/Editar.vue'
import IndexReciboIngreso from '@/views/ReciboIngreso/Index.vue'
import ListadoDeRecibosIngreso from '@/views/ReciboIngreso/Listado.vue'
import IndexReporte from '@/views/Reporte/Index.vue'
import ReporteInventario from '@/views/Reporte/ReporteInventario.vue'
import IndexOrdenDeServicio from '@/views/OrdenDeServicio/Index.vue'
import ListadoDeOrdenesDeServicio from '@/views/OrdenDeServicio/Listado.vue'
import IndexOrdenDeVenta from '@/views/OrdenDeVenta/Index.vue'
import ListadoDeOrdenesDeVenta from '@/views/OrdenDeVenta/Listado.vue'
import CrearOrdenDeVenta from '@/views/OrdenDeVenta/Crear.vue'
import EditarOrdenDeVenta from '@/views/OrdenDeVenta/Editar.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/iniciar-sesion',
    name: 'Inicio de sesion',
    component: InicioDeSesion
  },
  {
    path: '/sistema',
    component: Sistema,
    meta: {
      requiereIniciarSesion: true
    },
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: Dashboard
      },
      {
        name: 'Cuenta de usuario',
        path: '/cuenta-usuario',
        component: UsuarioAutenticado
      },
      {
        path: '/cuenta-desactivada',
        name: 'Cuenta desactivada',
        component: UsuarioDesactivado
      },
      {
        path: '/usuarios',
        name: 'Usuarios',
        component: IndexUsuario,
        redirect: { name: 'Listado de usuarios' },
        children: [
          {
            name: 'Listado de usuarios',
            path: 'listado-usuarios',
            component: ListadoDeUsuarios
          },
          {
            name: 'Registrar usuario',
            path: 'registrar-usuario',
            component: CrearUsuario
          },
          {
            name: 'Editar usuario',
            path: 'editar-usuario/:id',
            component: EditarUsuario
          }
        ]
      },
      {
        path: '/roles',
        name: 'Roles',
        component: IndexRol,
        redirect: { name: 'Listado de roles' },
        children: [
          {
            name: 'Listado de roles',
            path: 'listado-roles',
            component: ListadoDeRoles
          },
          {
            name: 'Registrar rol',
            path: 'registrar-rol',
            component: CrearRol
          },
          {
            name: 'Editar rol',
            path: 'editar-rol/:id',
            component: EditarRol
          }
        ]
      },
      {
        path: '/clientes',
        name: 'Clientes',
        component: IndexCliente,
        redirect: { name: 'Listado de clientes' },
        children: [
          {
            name: 'Listado de clientes',
            path: 'listado-clientes',
            component: ListadoDeClientes
          },
          {
            name: 'Registrar cliente',
            path: 'registrar-cliente',
            component: CrearCliente
          },
          {
            name: 'Editar cliente',
            path: 'editar-cliente/:id/:tipoCliente',
            component: EditarCliente
          },
          {
            name: 'Ordenes de cliente',
            path: 'ordenes-de-cliente/:id',
            component: OrdenesDeCliente
          }
        ]
      },
      {
        path: '/suministros',
        name: 'Suministros',
        component: IndexSuministro,
        redirect: { name: 'Listado de suministros' },
        children: [
          {
            name: 'Listado de suministros',
            path: 'listado-suministros',
            component: ListadoDeSuministros
          },
          {
            name: 'Registrar suministro',
            path: 'registrar-suministro',
            component: CrearSuministro
          },
          {
            name: 'Editar suministro',
            path: 'editar-suministro/:id',
            component: EditarSuministro
          },
          {
            name: 'Datos del suministro',
            path: 'datos-suministro/:id',
            component: DatosSuministro
          },
          {
            name: 'Registrar ingreso de suministro',
            path: 'registrar-ingreso-suministro/:id',
            component: CrearIngresoSuministro
          }
        ]
      },
      {
        path: '/ordenes-de-trabajo',
        name: 'Ordenes de trabajo',
        component: IndexOrdenDeTrabajo,
        redirect: { name: 'Listado de ordenes de trabajo' },
        children: [
          {
            name: 'Listado de ordenes de trabajo',
            path: 'listado-ordenes-de-trabajo',
            component: ListadoDeOrdenesDeTrabajo
          },
          {
            name: 'Registrar orden de trabajo',
            path: 'registrar-orden-de-trabajo',
            component: CrearOrdenDeTrabajo
          },
          {
            name: 'Editar orden de trabajo',
            path: 'editar-orden-de-trabajo/:idOrden/:idOrdenDeTrabajo/:tipoCliente',
            component: EditarOrdenDeTrabajo
          },
          {
            name: 'Datos de orden de trabajo',
            path: 'datos-orden-de-trabajo/:idOrden/:idOrdenDeTrabajo/:tipoCliente/:vistaAnterior',
            component: DatosOrdenDeTrabajo
          },
          {
            name: 'Registrar pago de orden de trabajo',
            path: 'registrar-pago-orden-de-trabajo/:id/:idOrden',
            component: CrearPagoOrdenDeTrabajo
          }
        ]
      },
      {
        path: '/ordenes-de-servicio',
        name: 'Ordenes de servicio',
        component: IndexOrdenDeServicio,
        redirect: { name: 'Listado de ordenes de servicio' },
        children: [
          {
            name: 'Listado de ordenes de servicio',
            path: 'listado-ordenes-de-servicio',
            component: ListadoDeOrdenesDeServicio
          },
          {
            name: 'Registrar orden de servicio',
            path: 'registrar-orden-de-servicio',
            component: CrearOrdenDeTrabajo
          },
          {
            name: 'Editar orden de servicio',
            path: 'editar-orden-de-servicio/:idOrden/:idOrdenDeTrabajo/:tipoCliente',
            component: EditarOrdenDeTrabajo
          },
          {
            name: 'Datos de orden de servicio',
            path: 'datos-orden-de-servicio/:idOrden/:idOrdenDeTrabajo/:tipoCliente/:vistaAnterior',
            component: DatosOrdenDeTrabajo
          },
          {
            name: 'Registrar pago de orden de servicio',
            path: 'registrar-pago-orden-de-servicio/:id/:idOrden',
            component: CrearPagoOrdenDeTrabajo
          }
        ]
      },
      {
        path: '/ordenes-de-venta',
        name: 'Ordenes de venta',
        component: IndexOrdenDeVenta,
        redirect: { name: 'Listado de ordenes de venta' },
        children: [
          {
            name: 'Listado de ordenes de venta',
            path: 'listado-ordenes-de-venta',
            component: ListadoDeOrdenesDeVenta
          },
          {
            name: 'Registrar orden de venta',
            path: 'registrar-orden-de-venta',
            component: CrearOrdenDeVenta
          },
          {
            name: 'Editar orden de venta',
            path: 'editar-orden-de-venta/:idOrden/:idOrdenDeVenta/:tipoCliente',
            component: EditarOrdenDeVenta
          }
        ]
      },
      {
        path: '/proveedores',
        name: 'Proveedores',
        component: IndexProveedor,
        redirect: { name: 'Listado de proveedores' },
        children: [
          {
            name: 'Listado de proveedores',
            path: 'listado-proveedores',
            component: ListadoDeProveedores
          },
          {
            name: 'Registrar proveedor',
            path: 'registrar-proveedor',
            component: CrearProveedor
          },
          {
            name: 'Editar proveedor',
            path: 'editar-proveedor/:id',
            component: EditarProveedor
          }
        ]
      },
      {
        path: '/recibos-de-ingreso',
        name: 'Recibos de ingreso',
        component: IndexReciboIngreso,
        redirect: { name: 'Listado de recibos de ingreso' },
        children: [
          {
            name: 'Listado de recibos de ingreso',
            path: 'listado-recibos-de-ingreso',
            component: ListadoDeRecibosIngreso
          }
        ]
      },
      {
        path: '/reportes',
        name: 'Reportes',
        component: IndexReporte,
        children: [
          {
            name: 'Reporte de inventario',
            path: 'reporte-inventario',
            component: ReporteInventario
          }
        ]
      }
    ]
  },
  {
    path: '*',
    redirect: { name: 'Inicio de sesion' }
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: '',
  routes
})

export default router
