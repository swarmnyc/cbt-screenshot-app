import { Project, Page } from "../types"

class Service {
  private projects: Map<string, Project> = new Map()

  constructor() {
    var json = localStorage.getItem("setting")
    if (json) {
      var arr: Project[] = JSON.parse(json)
      arr.forEach(p => {
        this.projects.set(p.id, p)
      })
    }
  }

  get hasNoSetting(): boolean {
    return this.projects.size === 0
  }

  createProject(projectName: string): Project {
    var project: Project = {
      id: Date.now().toString(),
      name: projectName,
      config: {
        username: "",
        password: "",
        browsers: [
          "Win10|FF68|1366x768",
          "Win10|Chrome75x64|1366x768",
          "Win10|IE11|1366x768",
          "Mac10.14|Safari12|1366x768",
          "Pixel2-And90|MblChrome74|1080x1920",
          "iPhoneXRSim|MblSafari12.0|1125x2436"
        ]
      },
      pages: []
    }

    this.projects.set(project.id, project)

    return project
  }

  getProjects(): Project[] {
    return Array.from(this.projects.values())
  }

  getProject(projectId: string): Project {
    return this.projects.get(projectId)
  }

  getPages(projectId: string): Page[] {
    return this.projects.get(projectId).pages
  }

  deleteProject(projectId: string): void {
    this.projects.delete(projectId)
  }

  save(): void {
    var json = JSON.stringify(this.getProjects())
    localStorage.setItem("setting", json)
  }
}

var SettingService = new Service()

export default SettingService
