<template>
  <v-card-text>
    <v-row justify="center" class="black--text px-3 mt-3">
      <v-col cols="5">
        <h3 class="font-weight-black">Ingreso con factura:</h3>
      </v-col>
      <v-col cols="7">
        <p class="text-body-1 font-weight-regular">
          {{ ingreso.recibo_egreso.es_factura === 1 ? "Si" : "No" }}
        </p>
      </v-col>
      <v-col cols="5">
        <h3 class="font-weight-black">Nro de factura:</h3>
      </v-col>
      <v-col cols="7">
        <p class="text-body-1 font-weight-regular">
          {{ ingreso.recibo_egreso.nro_factura }}
        </p>
      </v-col>
      <v-col cols="5">
        <h3 class="font-weight-black">Proveedor:</h3>
      </v-col>
      <v-col cols="7">
        <p class="text-body-1 font-weight-regular">
          {{ ingreso.proveedor.razon_social_proveedor }}
        </p>
      </v-col>
      <v-col cols="5">
        <h3 class="font-weight-black">Usuario:</h3>
      </v-col>
      <v-col cols="7">
        <p class="text-body-1 font-weight-regular">
          {{ ingreso.usuario.nombre_completo }}
        </p>
      </v-col>
      <v-col cols="5">
        <h3 class="font-weight-black">Fecha y hora de registro:</h3>
      </v-col>
      <v-col cols="7">
        <p class="text-body-1 font-weight-regular">
          {{ ingreso.fecha_formateada }}
        </p>
      </v-col>
      <v-col cols="5">
        <h3 class="font-weight-black">Importe total numeral:</h3>
      </v-col>
      <v-col cols="7">
        <p class="text-body-1 font-weight-regular">
          {{ ingreso.recibo_egreso.importe_numeral + " Bs" }}
        </p>
      </v-col>
      <v-col cols="5">
        <h3 class="font-weight-black">Importe total literal:</h3>
      </v-col>
      <v-col cols="7">
        <p class="text-body-1 font-weight-regular">
          {{ ingreso.recibo_egreso.importe_literal }}
        </p>
      </v-col>
      <v-col cols="5">
        <h3 class="font-weight-black">Cantidad ingresada:</h3>
      </v-col>
      <v-col cols="7">
        <p class="text-body-1 font-weight-regular">
          {{
            ingreso.cantidad_ingreso +
            " " +
            ingreso.suministro.unidad_de_medida.unidad_de_medida
          }}
        </p>
      </v-col>
    </v-row>
  </v-card-text>
</template>
<script>
export default {
  name: 'Datos',
  props: {
    ingreso: Object
  }
}
</script>
