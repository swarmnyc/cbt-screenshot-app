import { app, dialog } from "electron"
import { createWindow } from "./window"
import { autoUpdater } from "electron-updater"
import { createMenu } from "./menu"

app.on("ready", () => {
  createMenu()
  createWindow()

  // autoUpdater.on('error', (err) => {
  //   dialog.showMessageBox(window, {
  //     message: "on error:" + err.message
  //   })
  // })
  // autoUpdater.on('download-progress', (progressObj) => {
  //   dialog.showMessageBox(window, {
  //     message: "download-progress" + JSON.stringify(progressObj)
  //   })
  // })
  // autoUpdater.on('update-downloaded', (info) => {
  //   dialog.showMessageBox(window, {
  //     message: "download-progress" + JSON.stringify(info)
  //   })
  // });

  // for AutoUpdate
  autoUpdater
    .checkForUpdatesAndNotify()
    // .then(result => {
    //   dialog.showMessageBox(window, {
    //     message: JSON.stringify(result || {}, null , 2)
    //   })
    // })
    // .catch(error => {
    //   dialog.showMessageBox(window, {
    //     message: "Catch Error:" + JSON.stringify(error)
    //   })
    // })
})
