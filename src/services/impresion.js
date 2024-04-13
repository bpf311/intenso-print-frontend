import ordenConSuministros from "@/templates/Impresion/ordenConSuministros";

export const impresionService = {
  imprimirReciboConSuministros(datos, suministros) {
    const contenido = ordenConSuministros(datos, suministros);
    // llamar al evento imprimirContenido de electron
    window.ipcRenderer.send("imprimir-contenido", contenido);
  },

  imprimirReciboSinSuministros(datos) {
    // llamar al evento imprimirContenido de electron
    window.ipcRenderer.send("imprimir-contenido", datos);
  },
};
