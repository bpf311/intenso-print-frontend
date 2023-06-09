const menu = [
  {
    title: 'Dashboard',
    icon: 'mdi-monitor-dashboard',
    to: { name: 'Dashboard' },
    id: 1
  },
  {
    title: 'Ordenes',
    icon: 'mdi-clipboard-list-outline',
    children: [
      {
        title: 'Ordenes de trabajo',
        icon: 'mdi-view-dashboard',
        to: { name: 'Ordenes de trabajo' },
        id: 2
      }
      /* {
        title: 'Ordenes de servicio',
        icon: 'mdi-view-dashboard',
        to: { name: 'Listado de ordenes de servicios' },
        id: 3
      },
      {
        title: 'Ordenes de venta',
        icon: 'mdi-view-dashboard',
        to: { name: 'Listado de ordenes de ventas' },
        id: 4
      } */
    ]
  },
  {
    title: 'Recibos',
    icon: 'mdi-text-box-multiple',
    children: [
      {
        title: 'Ingresos',
        icon: 'mdi-cash-plus',
        to: { name: 'Recibos de ingreso' },
        id: 5
      }
    ]
  },
  {
    title: 'Gestion de usuarios',
    icon: 'mdi-account-group',
    to: { name: 'Usuarios' },
    id: 6
  },
  {
    title: 'Gestion de clientes',
    icon: 'mdi-briefcase-account',
    to: { name: 'Clientes' },
    id: 7
  },
  {
    title: 'Gestion de inventario',
    icon: 'mdi-warehouse',
    to: { name: 'Suministros' },
    id: 8
  },
  {
    title: 'Gestion de roles y permisos',
    icon: 'mdi-shield-account',
    to: { name: 'Roles' },
    id: 9
  },
  /* {
    title: 'Reportes',
    icon: 'mdi-finance',
    to: { name: 'Listado de clientes' },
    id: 10
  }, */
  {
    title: 'Gestion de proveedores',
    icon: 'mdi-store',
    to: { name: 'Proveedores' },
    id: 11
  }
]

export default menu
