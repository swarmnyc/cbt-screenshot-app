import { Project, Page } from "../types"
import SettingService from "./setting-service"
import { EventEmitter } from "events"

class Service {
  private event = new EventEmitter()
  private project: Project
  private queue: Page[]

  takeScreenshots(project: Project): EventEmitter {
    if (this.queue && this.queue.length != 0) {
      return this.event
    }

    this.project = project
    this.queue = this.project.pages.map(p => p)

    if (this.queue.length > 0) {
      this.takeScreenshotInQueue()
    } else {
      setTimeout(() => this.event.emit("done"), 100)
    }

    return this.event
  }

  private takeScreenshotInQueue = (): Promise<void> => {
    var config = this.project.config
    var page = this.queue[0]
    var url: string

    if (page.resultId) {
      url = `https://crossbrowsertesting.com/api/v3/screenshots/${page.resultId}/${page.resultVersionId}`
    } else {
      url = "https://crossbrowsertesting.com/api/v3/screenshots"
    }

    var options: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + btoa(config.username + ":" + config.password)
      },
      body: JSON.stringify({
        format: "json",
        url: page.url,
        browsers: config.browsers
      })
    }

    return fetch(url, options)
      .then(async res => {
        if (res.status == 200) {
          var result = await res.json()
          var resultVersion = result.versions[result.version_count - 1]
          page.resultId = result.screenshot_test_id
          page.resultVersionId = resultVersion.version_id
          page.resultUrl = resultVersion.show_results_public_url

          SettingService.save()
          this.queue.splice(0, 1)
        } else {
          var error = await res.json()
          var message: string = error.message

          if (!message.includes("maximum number of parallel")) {
            this.queue = []
            console.error("TakeScreenshot", error)
          }
        }

        if (this.queue.length > 0) {
          setTimeout(this.takeScreenshotInQueue, 60000)
        } else {
          this.event.emit("done")
        }
      })
      .catch(error => {
        this.queue = []
        this.event.emit("done")
        console.error("TakeScreenshot", error)
      })
  }
}

var CbtApiService = new Service()
export default CbtApiService
