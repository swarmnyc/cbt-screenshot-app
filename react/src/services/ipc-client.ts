import { IpcRenderer } from "electron"
import { C2MChannel, InitializeResult, Project, Page } from "cbt-screenshot-common"
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

  deleteProject(project: Project) {
    return this.createHandler(
      C2MChannel.DeleteProject,
      () => {
        dataCache.deleteProject(project)
      },
      project._id
    )
  }

  createPage(page: Page): Promise<Page> {
    return this.createHandler(
      C2MChannel.CreatePage,
      (id: string) => {
        page._id = id
        dataCache.addPage(page)

        return page
      },
      page
    )
  }

  updatePageProperty(page: Page, prop: keyof Page, value: any): Promise<void> {
    return this.createHandler(
      C2MChannel.UpdatePageProperty,
      () => {
        page[prop] = value
      },
      page._id,
      prop,
      value
    )
  }

  deletePage(page: Page) {
    return this.createHandler(
      C2MChannel.DeletePage,
      () => {
        dataCache.deletePage(page)
      },
      page._id
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
