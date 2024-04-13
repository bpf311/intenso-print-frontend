import generarPlantillaBase from "./base.js";

export default function ordenConSuministros(datos, suministros) {
  const plantillaBase = generarPlantillaBase("RECIBO");

  let filasHTML = "";
  suministros.forEach((fila) => {
    filasHTML += `
      <tr>
        <td>${fila.suministro}</td>
        <td>${fila.cantidad_prevista_suministro}</td>
        <td>${fila.precio_unitario_suministro}</td>
        <td>${fila.subtotal}</td>
      </tr>
     `;
  });
  const contenido = `
    </div>
      <table class="datos">
        <tr>
          <td>Fecha: </td>
          <td>${datos.fecha_formateada}</td>
        </tr>
        <tr>
          <td>Hora: </td>
          <td>${datos.hora}</td>
        </tr>
        <tr>
          <td>Cliente: </td>
          <td>${datos.datos_cliente}</td>
        </tr>
        <tr>
          <td>NIT/CI: </td>
          <td>${datos.nit_ci_cliente}</td>
        </tr>
        <tr>
          <td>Código de orden: </td>
          <td>${datos.codigo_orden_de_venta}</td>
        </tr>
      </table>
      <hr>
    </div>
    <div>
      <table class="suministros">
        <thead>
          <tr>
            <th>Desc.</th>
            <th>Cant.</th>
            <th>P. Unit.</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${filasHTML}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3">Total</td>
            <td>${datos.precio_total} Bs.</td>
          </tr>
        </tfoot>
      </table>
    </div>
    <div>
      <hr>
      <table class="datos">
        <tr>
          <td>Importe: </td>
          <td>${datos.monto_cancelado_actual} Bs.</td>
        </tr>
        <tr>
          <td>Saldo pendiente: </td>
          <td>${datos.saldo_restante} Bs.</td>
        </tr>
      </table>
      <hr>
      <p> Usuario: ${datos.usuario}</p>
    </div>
   `;

  return plantillaBase.replace("<!-- Contenido de la plantilla -->", contenido);
}
