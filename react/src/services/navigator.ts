import { createBrowserHistory, History } from "history"

class Navigator {
  history: History = createBrowserHistory()
  openHome = (): void => {
    this.history.replace("/home")
  }

  openSettings = (): void => {
    this.history.replace("/settings")
  }

  openTasks = (): void => {
    this.history.replace("/tasks")
  }
}

var navigator = new Navigator()

export default navigator
