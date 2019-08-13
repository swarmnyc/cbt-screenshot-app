import { C2MChannel, Page } from "cbt-screenshot-common"
import { ipcMain, BrowserWindow, Event } from "electron"
import dbClient from "./db-client"

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
  }

  initialize = async (_: Event, connectionString: string) => {
    this.execute(C2MChannel.Initialize, () => dbClient.init(connectionString))
  }

  createProject = async (_: Event, projectName: string) => {
    this.execute(C2MChannel.CreateProject, () => dbClient.createProject(projectName))
  }

  updateProjectProperty = async (_: Event, projectId: string, prop: string, value: any) => {
    this.execute(C2MChannel.UpdateProjectProperty, () => dbClient.updateProjectProperty(projectId, prop, value))
  }

  deleteProject = async (_: Event, projectId: string) => {
    this.execute(C2MChannel.DeleteProject, () => dbClient.deleteProject(projectId))
  }

  createPage = async (_: Event, page: Page) => {
    this.execute(C2MChannel.CreatePage, () => dbClient.createPage(page))
  }

  updatePageProperty = async (_: Event, pageId: string, prop: string, value: any) => {
    this.execute(C2MChannel.UpdatePageProperty, () => dbClient.updatePageProperty(pageId, prop, value))
  }

  deletePage = async (_: Event, pageId: string) => {
    this.execute(C2MChannel.DeletePage, () => dbClient.deletePage(pageId))
  }

  bulkEditPages = async (_: Event, inserts: Page[], updates: Page[]) => {
    this.execute(C2MChannel.BulkEditPages, () => dbClient.bulkEditPages(inserts, updates))
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
