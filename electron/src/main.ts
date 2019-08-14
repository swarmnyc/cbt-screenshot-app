import { app } from "electron"
import { createWindow } from "./window"
import "./menu"

app.on("ready", () => {
  createWindow()
})

// for AutoUpdate
import { autoUpdater } from "electron-updater"
autoUpdater.checkForUpdatesAndNotify()
