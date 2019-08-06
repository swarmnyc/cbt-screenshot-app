import url from "url"
import path from "path"
import { BrowserWindow } from "electron"

let mainWindow: BrowserWindow = null

export function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    minWidth: 800,
    minHeight: 600,
    show: false,
    title: "CBT Screenshot App",
    webPreferences: {
      webviewTag: true,
      nodeIntegration: true
    }
  })

  if (process.env.NODE_ENV === "development") {
    mainWindow.loadURL("http://localhost:3000")

    mainWindow.webContents.openDevTools()
    mainWindow.webContents.executeJavaScript("require('devtron').install()")
  } else {
    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, "client/index.html"),
        protocol: "file:",
        slashes: true
      })
    )
  }

  mainWindow.once("ready-to-show", () => {
    mainWindow.show()
  })
}
