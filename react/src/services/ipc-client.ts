import { IpcRenderer } from "electron"
import { ConnChannels, InitializeResult } from "cbt-screenshot-common"
import dataCache from "./data-cache"

var ipc: IpcRenderer = window.electron.ipcRenderer

class IpcClient {
  initialize(connectionString: string): Promise<void> {
    return new Promise((resolve, reject) => {
      ipc.once(ConnChannels.InitializeCallback, (evert, result: InitializeResult) => {
        if (result.error) {
          console.error("Initialize Failed", result.error)
          reject()
        } else {
          dataCache.init(result)
          resolve()
        }
      })

      ipc.send(ConnChannels.Initialize, connectionString)
    })
  }
}

var ipcClient = new IpcClient()
export default ipcClient
