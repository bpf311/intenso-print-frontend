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
    text: 'Proveedor',
    value: 'proveedor.razon_social_proveedor',
    align: 'center',
    divider: true,
    sortable: false
  },
  {
    text: 'Cantidad ingresada',
    value: 'cantidad_ingreso',
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
  },
  {
    text: 'Opciones',
    value: 'opciones',
    sortable: false,
    align: 'center',
    divider: true
  }
]

export default ingresoSuministroHeaders
