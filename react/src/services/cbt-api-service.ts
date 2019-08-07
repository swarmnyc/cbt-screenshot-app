import { Page, Project, CbtScreenshot } from "cbt-screenshot-common"

class CbtApiService {
  getScreenshot(project: Project, page: Page): Promise<CbtScreenshot> {
    var url = `https://crossbrowsertesting.com/api/v3/screenshots/${page.resultId}`
    var options: RequestInit = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + btoa(project.authName + ":" + project.authKey)
      }
    }

    return fetch(url, options).then(async res => {
      var result = await res.json()

      if (res.status === 200) {
        return result
      } else {
        throw result
      }
    })
  }
}

var cbtApiService = new CbtApiService()
export default cbtApiService
