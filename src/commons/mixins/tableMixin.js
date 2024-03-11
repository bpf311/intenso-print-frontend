export const tableMixin = {
  data () {
    return {
      dynamicTableHeight: 0
    }
  },
  mounted () {
    this.calculateTableHeight()
    window.addEventListener('resize', this.calculateTableHeight)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.calculateTableHeight)
  },
  methods: {
    calculateTableHeight () {
      const windowHeight = window.innerHeight
      // Lógica para calcular la altura de la tabla
      this.dynamicTableHeight = windowHeight * 0.5 // Por ejemplo, el 60% del alto de la ventana
    }
  }
}
