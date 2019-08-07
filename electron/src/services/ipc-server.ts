import { ConnChannels } from "cbt-screenshot-common"
import { ipcMain, BrowserWindow, Event } from "electron"
import dbClient from "./db-client"

export class IpcServer {
  constructor(private window: BrowserWindow) {
    ipcMain.on(ConnChannels.Initialize, this.initialize)
  }

  initialize = async (event: Event, connectionString: string) => {
    try {
      var result = await dbClient.init(connectionString)
      this.window.webContents.send(ConnChannels.InitializeCallback, result)
    } catch (error) {
      this.window.webContents.send(ConnChannels.InitializeCallback, { error })
    }
  }

  getProjects = async () => {
    this.window.webContents.send(ConnChannels.InitializeCallback)
  }
}
