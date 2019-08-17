import { C2MChannel, Page, InitializeResult, Project } from "cbt-screenshot-common"
import { ipcMain, BrowserWindow, Event } from "electron"
import dbClient from "./db-client"
import { SqsClient } from "./sqs-client"

export class IpcServer {
  constructor(private window: BrowserWindow) {
    ipcMain.on(C2MChannel.Initialize, this.initialize)

    ipcMain.on(C2MChannel.CreateProject, this.createProject)
    ipcMain.on(C2MChannel.UpdateProjectProperty, this.updateProjectProperty)
    ipcMain.on(C2MChannel.DeleteProject, this.deleteProject)

    ipcMain.on(C2MChannel.CreatePage, this.createPage)
    ipcMain.on(C2MChannel.UpdatePageProperty, this.updatePageProperty)
    ipcMain.on(C2MChannel.DeletePage, this.deletePage)
    ipcMain.on(C2MChannel.BulkEditPages, this.bulkEditPages)

    ipcMain.on(C2MChannel.GetTasks, this.getTasks)
    ipcMain.on(C2MChannel.NewTasks, this.newTasks)
    ipcMain.on(C2MChannel.CancelTask, this.cancelTask)
    ipcMain.on(C2MChannel.ArchiveErrorTask, this.archiveErrorTask)
  }

  initialize = (_: Event, connectionString: string) => {
    this.execute(C2MChannel.Initialize, () => dbClient.init(connectionString))
  }

  createProject = (_: Event, projectName: string) => {
    this.execute(C2MChannel.CreateProject, () => dbClient.createProject(projectName))
  }

  updateProjectProperty = (_: Event, projectId: string, prop: string, value: any) => {
    this.execute(C2MChannel.UpdateProjectProperty, () => dbClient.updateProjectProperty(projectId, prop, value))
  }

  deleteProject = (_: Event, projectId: string) => {
    this.execute(C2MChannel.DeleteProject, () => dbClient.deleteProject(projectId))
  }

  createPage = (_: Event, page: Page) => {
    this.execute(C2MChannel.CreatePage, () => dbClient.createPage(page))
  }

  updatePageProperty = (_: Event, pageId: string, prop: string, value: any) => {
    this.execute(C2MChannel.UpdatePageProperty, () => dbClient.updatePageProperty(pageId, prop, value))
  }

  deletePage = (_: Event, pageId: string) => {
    this.execute(C2MChannel.DeletePage, () => dbClient.deletePage(pageId))
  }

  bulkEditPages = (_: Event, inserts: Page[], updates: Page[]) => {
    this.execute(C2MChannel.BulkEditPages, () => dbClient.bulkEditPages(inserts, updates))
  }

  getTasks = (_: Event) => {
    this.execute(C2MChannel.GetTasks, () => dbClient.getTasks())
  }

  cancelTask = (_: Event, taskId: string) => {
    this.execute(C2MChannel.CancelTask, async () => dbClient.cancelTask(taskId))
  }

  archiveErrorTask = (_: Event, taskId: string) => {
    this.execute(C2MChannel.ArchiveErrorTask, async () => dbClient.archiveErrorTask(taskId))
  }

  newTasks = (_: Event, project: Project, pageIds: string[]) => {
    this.execute(C2MChannel.NewTasks, async () => {
      await dbClient.newTasks(project, pageIds)

      if (!(await dbClient.hasExecutingTask())) {
        var sqsClient = new SqsClient(project)

        await sqsClient.send("trigger lambda")
      }
    })
  }

  private execute(channel: C2MChannel, body: () => Promise<any>): void {
    body()
      .then(result => {
        this.window.webContents.send(channel + "Callback", null, result)
      })
      .catch(error => {
        this.window.webContents.send(channel + "Callback", error)
      })
  }
}
