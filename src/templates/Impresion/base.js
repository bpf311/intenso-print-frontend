export default function generarPlantillaBase(titulo) {
  return `
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <style>
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          font-family: Verdana, Geneva, sans-serif; !important;
          height: auto;
          width: 180px;
          font-size: 12px;
        }
        h2, h3, h4 {
          text-align: center;
        }
        .suministros {
          width: 100%;
          font-size: 9px;
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
        .suministros td {
          border-bottom: 1px dashed black;
          font-weight: normal;
        }
        .datos {
          width: 100%;
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
      <div id="cabecera">
        <hr>
        <h2> INTENSO PRINT </h2>
        <hr>
        <h3> ${titulo} </h3>
        <hr>
      </div>
      <div id="contenido">
        <!-- Contenido de la plantilla -->
      </div>
      <div id="pie">
        <hr>
        <h4>¡Gracias por su preferencia! </h4>
        <hr>
      </div>
    </body>
    </html>
    `;
}
