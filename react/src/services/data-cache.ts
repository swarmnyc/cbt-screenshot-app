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

  get hasNoProject(): boolean {
    return this.projectArray.length === 0
  }
}

var dataCache = new DataCache()
export default dataCache
