const ingresoSuministroHeaders = [
  {
    text: 'Fecha y hora de registro',
    value: 'fecha_formateada',
    align: 'center',
    class: 'blue-grey lighten-4 black--text text--darken-2 font-weight-bold',
    sortable: false
  },
  {
    text: 'Usuario',
    value: 'usuario.nombre_completo',
    align: 'center',
    class: 'blue-grey lighten-4 black--text text--darken-2 font-weight-bold',
    sortable: false
  },
  {
    text: 'Proveedor',
    value: 'proveedor.razon_social_proveedor',
    align: 'center',
    class: 'blue-grey lighten-4 black--text text--darken-2 font-weight-bold',
    sortable: false
  },
  {
    text: 'Cantidad ingresada',
    value: 'cantidad_ingreso',
    align: 'center',
    class: 'blue-grey lighten-4 black--text text--darken-2 font-weight-bold',
    sortable: false
  },
  {
    text: 'Unidad de medida',
    value: 'suministro.unidad_de_medida.unidad_de_medida',
    align: 'center',
    class: 'blue-grey lighten-4 black--text text--darken-2 font-weight-bold',
    sortable: false
  }
]

export default ingresoSuministroHeaders
