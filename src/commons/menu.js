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
      },
      {
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
      }
    ]
  },
  {
    title: 'Recibos',
    icon: 'mdi-text-box-multiple',
    children: [
      {
        title: 'Ingresos',
        icon: 'mdi-cash-plus',
        to: { name: 'Listado de ingresos' },
        id: 5
      },
      {
        title: 'Egresos',
        icon: 'mdi-cash-minus',
        to: { name: 'Listado de egresos' },
        id: 6
      }
    ]
  },
  {
    title: 'Gestion de usuarios',
    icon: 'mdi-account-group',
    to: { name: 'Usuarios' },
    id: 7
  },
  {
    title: 'Gestion de clientes',
    icon: 'mdi-account-group',
    to: { name: 'Clientes' },
    id: 8
  },
  {
    title: 'Gestion de inventario',
    icon: 'mdi-warehouse',
    to: { name: 'Suministros' },
    id: 9
  }
  /* {
    title: "Productos",
    icon: "mdi-package",
    to: { name: "Productos" },
    id: 2,
  },
  {
    title: "Ingresos",
    icon: "mdi-archive-arrow-down-outline",
    to: { name: "Listado de clientes" },
    id: 4,
  },
  {
    title: "Egresos",
    icon: "mdi-archive-arrow-up-outline",
    to: { name: "Listado de clientes" },
    id: 6,
  },

  {
    title: "Ventas",
    icon: "mdi-cash-register",
    to: { name: "Listado de clientes" },
    id: 7,
  },
  {
    title: "Reportes",
    icon: "mdi-finance",
    to: { name: "Listado de clientes" },
    id: 8,
  }, */
]

export default menu
