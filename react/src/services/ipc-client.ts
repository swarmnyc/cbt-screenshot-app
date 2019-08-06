import { IpcRenderer } from "electron"
import { ConnChannels } from "cbt-screenshot-common"

var ipc: IpcRenderer = window.electron.ipcRenderer

class RemoteServiceClass {
  initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      ipc.once(ConnChannels.InitializeCallback, error => {
        if (error) {
          console.error(ConnChannels.Initialize, error)
          reject()
        } else {
          resolve()
        }
      })

      ipc.send(ConnChannels.Initialize)
    })
  }
}



var remoteService = new RemoteServiceClass()
export default remoteService
