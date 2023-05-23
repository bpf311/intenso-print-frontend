const ingresoSuministroHeaders = [
  {
    text: 'Fecha y hora de registro',
    value: 'fecha_formateada',
    align: 'center',
    divider: true,
    sortable: false
  },
  {
    text: 'Usuario',
    value: 'usuario.nombre_completo',
    align: 'center',
    divider: true,
    sortable: false
  },
  {
    text: 'Orden',
    value: 'orden.orden_de_trabajo.codigo_orden_de_trabajo',
    align: 'center',
    divider: true,
    sortable: false
  },
  {
    text: 'Cantidad egresada',
    value: 'cantidad_egreso',
    align: 'center',
    divider: true,
    sortable: false
  },
  {
    text: 'Unidad de medida',
    value: 'suministro.unidad_de_medida.unidad_de_medida',
    align: 'center',
    divider: true,
    sortable: false
  }
]

export default ingresoSuministroHeaders
