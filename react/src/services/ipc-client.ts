import { IpcRenderer } from "electron"
import { ConnChannel, InitializeResult, Project } from "cbt-screenshot-common"
import dataCache from "./data-cache"

var ipc: IpcRenderer = window.electron.ipcRenderer

class IpcClient {
  initialize(connectionString: string): Promise<void> {
    return new Promise((resolve, reject) => {
      ipc.once(ConnChannel.InitializeCallback, (evert, error, result: InitializeResult) => {
        if (error) {
          console.error("Initialize Failed", error)
          reject()
        } else {
          dataCache.init(result)
          resolve()
        }
      })

      ipc.send(ConnChannel.Initialize, connectionString)
    })
  }

  createProject(projectName: string): Promise<Project> {
    return new Promise((resolve, reject) => {
      ipc.once(ConnChannel.CreateProjectCallback, (evert, error, project: Project) => {
        if (error) {
          console.error("Create Project Failed", error)
          reject()
        } else {
          dataCache.addProject(project)
          resolve(project)
        }
      })

      ipc.send(ConnChannel.CreateProject, projectName)
    })
  }
}

var ipcClient = new IpcClient()
export default ipcClient
