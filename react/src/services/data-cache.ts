import { InitializeResult, Page, Project } from "cbt-screenshot-common"

class DataCache {
  projectArray: Project[]
  pageArray: Page[]
  projectMap: Map<string, Project>
  projectPageMap: Map<string, Page[]>
  pageMap: Map<string, Page>

  init(data: InitializeResult) {
    this.projectArray = data.projects
    this.pageArray = data.pages

    this.projectMap = new Map()
    this.projectPageMap = new Map()
    this.pageMap = new Map()

    data.projects.forEach(p => {
      this.projectMap.set(p._id, p)
      this.projectPageMap.set(p._id, [])
    })

    data.pages.forEach(p => {
      p.projectId = p.projectId.toString()

      this.projectPageMap.get(p.projectId).push(p)
      this.pageMap.set(p._id, p)
    })
  }

  addProject(project: Project) {
    this.projectArray.push(project)
    this.projectMap.set(project._id, project)
    this.projectPageMap.set(project._id, [])
  }

  deleteProject(project: Project) {
    this.projectArray = this.projectArray.filter(p => p !== project)
    this.projectMap.delete(project._id)
    this.projectPageMap.delete(project._id)
  }

  addPage(page: Page) {
    this.pageArray.push(page)
    this.pageMap.set(page._id, page)
    this.projectPageMap.get(page.projectId).push(page)
  }

  deletePage(page: Page) {
    this.pageArray = this.pageArray.filter(p => p !== page)
    this.pageMap.delete(page._id)
    this.projectPageMap.get(page.projectId).filter(p => p !== page)
  }

  get hasNoProject(): boolean {
    return this.projectArray.length === 0
  }
}

var dataCache = new DataCache()
export default dataCache
