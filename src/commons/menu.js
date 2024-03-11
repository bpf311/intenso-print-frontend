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
        to: { name: 'Ordenes de servicio' },
        id: 7
      },
      {
        title: 'Ordenes de venta',
        icon: 'mdi-view-dashboard',
        to: { name: 'Ordenes de venta' },
        id: 11
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
        to: { name: 'Recibos de ingreso' },
        id: 15
      },
      {
        title: 'Ingresos',
        icon: 'mdi-cash-plus',
        to: { name: 'Recibos de ingreso' },
        id: 16
      }
    ]
  },
  {
    title: 'Gestion de usuarios',
    icon: 'mdi-account-group',
    to: { name: 'Usuarios' },
    id: 17
  },
  {
    title: 'Gestion de clientes',
    icon: 'mdi-briefcase-account',
    to: { name: 'Clientes' },
    id: 22
  },
  {
    title: 'Gestion de inventario',
    icon: 'mdi-warehouse',
    to: { name: 'Suministros' },
    id: 26
  },
  {
    title: 'Gestion de roles y permisos',
    icon: 'mdi-shield-account',
    to: { name: 'Roles' },
    id: 30
  },
  {
    title: 'Gestion de proveedores',
    icon: 'mdi-store',
    to: { name: 'Proveedores' },
    id: 33
  },
  {
    title: 'Reportes',
    icon: 'mdi-finance',
    children: [
      {
        title: 'Reporte de inventario',
        icon: 'mdi-cash-plus',
        to: { name: 'Reporte de inventario' },
        id: 36
      },
      {
        title: 'Reporte de ingresos',
        icon: 'mdi-cash-plus',
        to: { name: 'Reporte de inventario' },
        id: 37
      },
      {
        title: 'Reporte de egresos',
        icon: 'mdi-cash-plus',
        to: { name: 'Reporte de inventario' },
        id: 38
      },
      {
        title: 'Reporte de deudas pendientes',
        icon: 'mdi-cash-plus',
        to: { name: 'Reporte de inventario' },
        id: 39
      },
      {
        title: 'Log del sistema',
        icon: 'mdi-cash-plus',
        to: { name: 'Reporte de inventario' },
        id: 40
      }
    ]
  }
]

export default menu
