const url = require("url")
const path = require("path")
const { BrowserWindow } = require("electron")

let mainWindow = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    minWidth: 800,
    minHeight: 600,
    show: false,
    webPreferences: {
      webviewTag: true,
      nodeIntegration: true
    }
  })

  if (process.env.NODE_ENV === "development") {
    mainWindow.loadURL("http://localhost:3000")

    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, "src/index.html"),
        protocol: "file:",
        slashes: true
      })
    )
  }

  mainWindow.once("ready-to-show", () => {
    mainWindow.show()
  })
}

module.exports = createWindow
