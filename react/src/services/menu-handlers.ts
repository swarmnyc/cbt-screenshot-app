import { IpcRenderer } from "electron"
import { ConnChannels } from "cbt-screenshot-common"
import navigator from "./navigator"

var ipc: IpcRenderer = window.electron.ipcRenderer

ipc.on(ConnChannels.OpenSettings, () => {
  navigator.openSettings()
})
