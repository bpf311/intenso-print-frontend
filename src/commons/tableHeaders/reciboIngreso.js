const reciboIngresoHeaders = [
  {
    text: 'Fecha y hora de registro',
    value: 'fecha_formateada'
  },
  {
    text: 'Codigo Orden',
    value: 'orden.orden_de_trabajo.codigo_orden_de_trabajo'
  },
  {
    text: 'Usuario',
    value: 'usuario.nombre_completo'
  },
  {
    text: 'Cliente',
    value: 'cliente.cliente_empresarial.razon_social_cliente'
  },
  {
    text: 'Importe',
    value: 'importe_numeral'
  },
  {
    text: 'Opciones',
    value: 'opciones',
    sortable: false
  }
]

export default reciboIngresoHeaders
