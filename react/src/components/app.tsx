import { CssBaseline } from "@material-ui/core"
import { InitStatus } from "cbt-screenshot-common"
import React from "react"
import { Redirect, Route, Router, Switch } from "react-router-dom"
import dataCache from "services/data-cache"
import ipcClient from "services/ipc-client"
import settingService from "services/setting-service"
import "../services/menu-handlers"
import navigator from "../services/navigator"
import Error from "./error"
import Home from "./home"
import Loading from "./loading"
import Setting from "./setting"

interface State {
  status?: InitStatus
}

export default class App extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props)

    this.state = { status: InitStatus.initializing }
  }

  componentDidMount(): void {
    // init
    settingService.getDbConnectionString().then(connStr => {
      if (connStr == null) return

      ipcClient
        .initialize(connStr)
        .then(() => {
          this.setState({ status: InitStatus.initialized })
        })
        .catch(() => {
          this.setState({ status: InitStatus.error })
        })
    })
    // if (localStorage.getItem("DbConnectionString"))
  }

  render(): React.ReactElement {
    switch (this.state.status) {
      case InitStatus.initializing:
        return <Loading />
      case InitStatus.error:
        return <Error />
      default:
        return (
          <>
            <CssBaseline />
            <Router history={navigator.history}>
              <Switch>
                <Route path="/settings" component={Setting} />
                <Route path="/home" component={Home} />
                <Route render={this.redirect} />
              </Switch>
            </Router>
          </>
        )
    }
  }

  redirect(): React.ReactElement {
    if (dataCache.hasNoProject) {
      return <Redirect to="/settings" />
    } else {
      return <Redirect to="/home" />
    }
  }
}
