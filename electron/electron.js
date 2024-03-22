// electron/electron.js
const path = require("path");
const { app, BrowserWindow, ipcMain } = require("electron");

const isDev = process.env.IS_DEV === "true";

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.setMenuBarVisibility(false);
  console.log("isDev", isDev);

  mainWindow.loadURL(
    isDev
      ? "http://localhost:8080"
      : `file://${path.join(__dirname, "../dist/index.html")}`
  );

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  // Escucha el evento 'print-content' desde la vista
  ipcMain.on("print-content", (event, printContent) => {
    const options = {
      printerName: "POS-58", // Especifica el nombre de la impresora,
      silent: true,
      preview: true,
      pageSize: {
        width: 58000,
        height: 793700,
      },
      dpi: { horizontal: 203, vertical: 203 },
      scaleFactor: 100,
      margins: {
        marginType: "custom",
        top: 0,
        bottom: 10,
        left: 15,
        right: 20,
      },
    };
    const printWindow = new BrowserWindow({
      width: 219,
      height: 964,
      show: true,
    });

    // Carga el contenido HTML en la ventana de impresión
    printWindow.loadURL(`data:text/html,${encodeURIComponent(printContent)}`);

    printWindow.webContents.on("did-finish-load", () => {
      // Una vez que se carga el contenido, imprímelo sin mostrar el diálogo de impresión
      printWindow.webContents.print(options);
    });
  });

  // ESTE MODELO DE IMPRESION FUNCIONA CON LA LIBRERIA POSPRINTER, NO TOCAR ESTE CODIGO QUE ES EL FUNCIONAL.
  /* ipcMain.on('print-content', (event, printContent) => {
    const data = printContent
    const options = {
      printerName: 'POS-58', // Especifica el nombre de la impresora,
      silent: false,
      preview: true,
      pageSize: '58mm',
      // dpi: { horizontal: 203, vertical: 203 }, // DPI funcional segun impresora,
      dpi: { horizontal: 180, vertical: 130 }, // DPI funcional,
      scaleFactor: 100
    }
    PosPrinter.print(data, options).catch((error) => {
      console.error(error)
    })
  }) */
}

app.whenReady().then(() => {
  createWindow();
  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
