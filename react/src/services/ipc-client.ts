import { IpcRenderer } from "electron"
import { C2MChannel, InitializeResult, Project } from "cbt-screenshot-common"
import dataCache from "./data-cache"

var ipc: IpcRenderer = window.electron.ipcRenderer

class IpcClient {
  initialize(connectionString: string): Promise<void> {
    return this.createHandler(
      C2MChannel.Initialize,
      (result: InitializeResult) => {
        dataCache.init(result)
      },
      connectionString
    )
  }

  createProject(projectName: string): Promise<Project> {
    return this.createHandler(
      C2MChannel.CreateProject,
      (project: Project) => {
        dataCache.addProject(project)
        return project
      },
      projectName
    )
  }

  updateProjectProperty(project: Project, prop: keyof Project, value: any): Promise<void> {
    if (prop === "desktopBrowsers" || prop === "mobileBrowsers") {
      if (typeof value === "string") {
        value = value.split(",").map(s => s.trim())
      }
    }

    return this.createHandler(
      C2MChannel.UpdateProjectProperty,
      () => {
        project[prop] = value
      },
      project._id,
      prop,
      value
    )
  }

  private createHandler<T>(
    channel: C2MChannel,
    successHandler: (...eventArgs: any) => T,
    ...sendArgs: any[]
  ): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      ipc.once(channel + "Callback", (evert, error, ...receiveArgs: any[]) => {
        if (error) {
          console.error(`Exec ${channel} failed`, error)
          reject()
        } else {
          var result = successHandler.apply(this, receiveArgs)

          resolve(result)
        }
      })

      ipc.send(channel, ...sendArgs)
    })
  }
}

var ipcClient = new IpcClient()
export default ipcClient
