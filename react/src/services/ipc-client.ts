import { IpcRenderer } from "electron"
import { C2MChannel, InitializeResult, Project, Page, Task } from "cbt-screenshot-common"
import dataCache from "./data-cache"
import { ObjectId } from "bson"

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

  deleteProject(project: Project): Promise<void> {
    return this.createHandler(
      C2MChannel.DeleteProject,
      () => {
        dataCache.deleteProject(project)
      },
      project._id
    )
  }

  createPage(page: Page): Promise<void> {
    return this.createHandler(
      C2MChannel.CreatePage,
      () => {
        dataCache.addPage(page)
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

  deletePage(page: Page): Promise<void> {
    return this.createHandler(
      C2MChannel.DeletePage,
      () => {
        dataCache.deletePage(page)
      },
      page._id
    )
  }

  bulkPageEdit(project: Project, csv: string): Promise<[number, number]> {
    var lines = csv.split("\n")

    var inserts: Page[] = []
    var updates: Page[] = []
    var pages = dataCache.projectPageMap.get(project._id)

    lines.forEach(line => {
      var props = line.split(",").map(s => s.trim())
      if (props.length !== 5) return

      var [path, name, folder, did, mid] = props
      path = path.toLowerCase()
      var page = pages.find(p => p.path === path)

      if (page) {
        // exist
        if (
          page.name !== name ||
          page.folder !== folder ||
          page.desktopResultId !== did ||
          page.mobileResultId !== mid
        ) {
          page.name = name
          page.folder = folder
          page.desktopResultId = did
          page.mobileResultId = mid
          updates.push(page)
        }
      } else {
        // new
        inserts.push({
          _id: new ObjectId().toHexString(),
          projectId: project._id,
          path,
          name,
          folder,
          desktopResultId: did,
          mobileResultId: mid
        })
      }
    })

    if (inserts.length === 0 && updates.length === 0) {
      return Promise.resolve([0, 0])
    } else {
      return this.createHandler(
        C2MChannel.BulkEditPages,
        () => {
          inserts.forEach(p => dataCache.addPage(p))

          return [inserts.length, updates.length]
        },
        inserts,
        updates
      )
    }
  }

  getTasks(): Promise<Task[]> {
    return this.createHandler(C2MChannel.GetTasks, result => result)
  }

  cancelTask(taskId: string): Promise<void> {
    return this.createHandler(C2MChannel.CancelTask, () => {}, taskId)
  }

  archiveErrorTask(taskId: string): Promise<void> {
    return this.createHandler(C2MChannel.ArchiveErrorTask, () => {}, taskId)
  }

  newTasks(project: Project, pageIds: string[]): Promise<void> {
    return this.createHandler(C2MChannel.NewTasks, () => {}, project, pageIds)
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
