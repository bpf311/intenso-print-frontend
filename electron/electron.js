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
  ipcMain.on("imprimir-contenido", (event, contenido) => {
    const options = {
      printerName: "POS-58", // Especifica el nombre de la impresora,
      silent: true,
      preview: true,
      pageSize: {
        width: 58000,
        height: 210000,
      },
      dpi: { horizontal: 203, vertical: 203 },
      scaleFactor: 100,
      margins: {
        marginType: "custom",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
    };
    const printWindow = new BrowserWindow({
      width: 219,
      height: 964,
      show: false,
    });

    // Carga el contenido HTML en la ventana de impresión
    printWindow
      .loadURL(`data:text/html,${encodeURIComponent(contenido)}`)
      .then(() => {
        printWindow.webContents.on("did-finish-load", () => {
          // Una vez que se carga el contenido, imprímelo sin mostrar el diálogo de impresión
          printWindow.webContents.print(options);
        });
      })
      .catch((error) => {
        // Maneja cualquier error que pueda ocurrir durante la carga de la URL
        console.error("Error al cargar la URL:", error);
      });
  });
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
