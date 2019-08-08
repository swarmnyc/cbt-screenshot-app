import { ConnChannel } from "cbt-screenshot-common"
import { ipcMain, BrowserWindow, Event } from "electron"
import dbClient from "./db-client"

export class IpcServer {
  constructor(private window: BrowserWindow) {
    ipcMain.on(ConnChannel.Initialize, this.initialize)
    ipcMain.on(ConnChannel.CreateProject, this.createProject)
  }

  initialize = async (_: Event, connectionString: string) => {
    this.execute(ConnChannel.InitializeCallback, () => dbClient.init(connectionString))
  }

  createProject = async (_: Event, projectName: string) => {
    this.execute(ConnChannel.CreateProjectCallback, () => dbClient.createProject(projectName))
  }

  private execute(channel: ConnChannel, body: () => Promise<any>): void {
    body()
      .then(result => {
        this.window.webContents.send(channel, null, result)
      })
      .catch(error => {
        this.window.webContents.send(channel, error)
      })
  }
}
