const path = require("path")
const { BrowserWindow } = require("electron")

let mainWindow = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    show: false
  })

  if (process.env.NODE_ENV === "development") {
    mainWindow.loadURL("http://localhost:3000")

    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, "../build/index.html"))
  }

  mainWindow.once("ready-to-show", () => {
    mainWindow.show()
  })
}

module.exports = createWindow
