// electron/electron.js
const path = require('path')
const { app, BrowserWindow, ipcMain } = require('electron')
const { PosPrinter } = require('electron-pos-printer')

const isDev = process.env.IS_DEV === 'true'

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  // ocultar el menu superior
  // mainWindow.removeMenu()
  mainWindow.setMenuBarVisibility(false)
  console.log('isDev', isDev)
  // and load the index.html of the app.
  // win.loadFile("index.html");
  mainWindow.loadURL(
    isDev
      ? 'http://localhost:8080'
      : `file://${path.join(__dirname, '../dist/index.html')}`
  )
  // Open the DevTools.
  if (isDev) {
    mainWindow.webContents.openDevTools()
  }

  // Escucha el evento 'print-content' desde la vista
  ipcMain.on('print-content', (event, printContent) => {
    console.log('print-content', printContent)
    const options = {
      printerName: 'POS-58', // Especifica el nombre de la impresora,
      silent: true,
      preview: true,
      pageSize: {
        width: 58000,
        height: 234950
      },
      // margin: '10 10 10 10',
      dpi: { horizontal: 220, vertical: 220 },
      // pageSize: {
      //  height: 1200,
      //  width: 353
      // },
      scaleFactor: 80,
      margins: {
        marginType: 'none'
      }
    }
    const printWindow = new BrowserWindow({
      width: 219,
      height: 964,
      show: true
    })

    // Carga el contenido HTML en la ventana de impresión
    printWindow.loadURL(`data:text/html,${encodeURIComponent(printContent)}`)

    printWindow.webContents.executeJavaScript('document.body.clientHeight').then((height) => {
      doSomethingWithPageHeight(height)
    })

    function doSomethingWithPageHeight (height) {
      // Esta función puede ser llamada dentro del then o en cualquier otro lugar
      console.log('Doing something with pageHeight:', height)
      printWindow.setSize(219, height)
    }

    printWindow.webContents.on('did-finish-load', () => {
      // Una vez que se carga el contenido, imprímelo sin mostrar el diálogo de impresión
      printWindow.webContents.print(options)
    })
  })

  /* ipcMain.on('print-content', (event, printContent) => {
    const data = printContent
    const options = {
      printerName: 'POS-58', // Especifica el nombre de la impresora,
      silent: false,
      preview: true,
      pageSize: '58mm',
      width: 170, // 58 mm convertido a micrones
      dpi: { horizontal: 203, vertical: 203 }, // DPI funcional segun impresora,
      // dpi: { horizontal: 180, vertical: 130 }, // DPI funcional,
      scaleFactor: 100
    }
    PosPrinter.print(data, options).catch((error) => {
      console.error(error)
    })
  }) */

  // ESTE MODELO DE IMPRESION FUNCIONA, NO TOCAR ESTE CODIGO QUE ES EL FUNCIONAL.
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
  createWindow()
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
