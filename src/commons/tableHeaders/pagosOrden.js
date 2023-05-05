const pagosOrdenHeaders = [
  {
    text: 'Fecha y hora',
    value: 'fecha_formateada',
    sortable: false,
    align: 'center',
    class: ['font-weight-black', 'black--text'],
    divider: true
  },
  {
    text: 'Monto cancelado',
    value: 'monto_formateado',
    sortable: false,
    align: 'right',
    class: ['font-weight-black', 'black--text'],
    divider: true
  }
]

export default pagosOrdenHeaders
