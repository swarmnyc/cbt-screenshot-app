import { createBrowserHistory, History } from "history"

class Navigator {
  history: History = createBrowserHistory()
  openHome = (): void => {
    this.history.replace("/home")
  }

  openSettings = (): void => {
    this.history.replace("/settings")
  }

  openScreenshots = (): void => {
    this.history.replace("/screenshots")
  }
}

var navigator = new Navigator()

export default navigator
