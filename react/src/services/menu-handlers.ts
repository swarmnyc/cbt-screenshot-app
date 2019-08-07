import { ConnChannels } from "cbt-screenshot-common"
import { IpcRenderer } from "electron"
import navigator from "./navigator"
import settingService from "./setting-service"

var ipc: IpcRenderer = window.electron.ipcRenderer

ipc.on(ConnChannels.OpenSettings, () => {
  navigator.openSettings()
})

ipc.on(ConnChannels.ChangeConnection, () => {
  settingService.inputDbConnectionString(true).then(connStr => {
    if (connStr) {
      window.location.reload()
    }
  })
})
