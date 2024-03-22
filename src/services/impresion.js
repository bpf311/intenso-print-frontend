export const impresionService = {
  imprimir(datos, suministros) {
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
    const printContent = `
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <style>
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          font-family: Verdana, Geneva, sans-serif; !important;
          height: auto;
          width: 219px;
          font-size: 12px;
        }
        h2, h3, h5 {
          text-align: center;
        }
        .suministros {
          width: 100%;
          font-size: 11px;
          border-collapse: collapse;
          word-break: break-word;
          text-align: center;
          border: 1px dashed black;
          margin: 0 auto;
          font-weight: normal;
        }
        .suministros thead {
          border-bottom: 1px dashed black;
          font-weight: normal;
        }
        .suministros tfoot {
          border-top: 1px dashed black;
          font-weight: normal;
        }
        .datos {
          width: 90%;
          font-size: 12px;
          border-collapse: collapse;
          word-break: break-word;
          text-align: center;
          margin: 0 auto;
          font-weight: normal;
        }
        hr {
          border-top: 2px dashed black
        }
      </style>
      <title>Recibo</title>
    </head>
    <body>
      <div>
        <h2> INTENSO PRINT </h2>
        <hr>
        <h3> RECIBO </h3>
        <hr>
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
        <p> Importe: ${datos.monto_cancelado_actual} Bs.</p>
        <p> Saldo: ${datos.saldo_restante} Bs.</p>
        <hr>
        <p> Usuario: ${datos.usuario}</p>
        <hr>
        <h5>¡Gracias por su preferencia! </h5>
        <hr>
      </div>
    </body>
    </html>
    `;
    // llamar al evento imprimirContenido de electron
    window.ipcRenderer.send("print-content", printContent);
  },
};
