import { ConnChannels } from "cbt-screenshot-common"
import { ipcMain } from "electron"

class IpcServer {
  constructor() {
    ipcMain.on(ConnChannels.Initialize, this.initialize)
  }

  initialize = () => {}
}

var ipcServer = new IpcServer()

export default ipcServer
