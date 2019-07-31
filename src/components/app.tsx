import React from "react"
import { Switch, Route, Router, Redirect } from "react-router-dom"
import { createBrowserHistory } from "history"
import Setting from "./setting"
import Home from "./home"
import SettingService from "../services/setting-service"

var history = createBrowserHistory()

export default class App extends React.Component {
  componentDidMount(): void {
    if (window.electron) {
      // listen menu action
      window.electron.ipcRenderer.on("goToSettings", () => {
        history.replace("/settings")
      })
    }
  }

  render(): React.ReactElement {
    return (
      <Router history={history}>
        <Switch>
          <Route path="/settings" component={Setting} />
          <Route path="/home" component={Home} />
          <Route path="/" render={this.redirect} />
        </Switch>
      </Router>
    )
  }

  redirect(): React.ReactElement {
    if (SettingService.hasNoSetting) {
      return <Redirect to="/settings" />
    } else {
      return <Redirect to="/home" />
    }
  }
}
