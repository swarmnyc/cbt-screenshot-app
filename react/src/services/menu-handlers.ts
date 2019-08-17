import { M2CChannel } from "cbt-screenshot-common"
import { IpcRenderer } from "electron"
import navigator from "./navigator"
import settingService from "./setting-service"

var ipc: IpcRenderer = window.electron.ipcRenderer

ipc.on(M2CChannel.OpenSettings, () => {
  navigator.openSettings()
})

ipc.on(M2CChannel.OpenTasks, () => {
  navigator.openTasks()
})

ipc.on(M2CChannel.ChangeConnection, () => {
  settingService.inputDbConnectionString(true).then(connStr => {
    if (connStr) {
      window.location.reload()
    }
  })
})
