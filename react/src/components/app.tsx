import { Box, CircularProgress, CssBaseline, Typography } from "@material-ui/core"
import React from "react"
import { Route, Router, Switch } from "react-router-dom"
import navigator from "../services/navigator"
import Home from "./home"
import Setting from "./setting"
import "../services/menu-handlers"

interface State {
  initialized?: boolean
}

export default class App extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props)

    this.state = { initialized: true }
  }

  componentDidMount(): void {}

  render(): React.ReactElement {
    if (this.state.initialized != true) {
      return (
        <Box className="screen-center">
          <Box textAlign="center">
            <CircularProgress />
          </Box>

          <Typography variant="h5" className="mt-2">
            LOADING
          </Typography>
        </Box>
      )
    }

    return (
      <>
        <CssBaseline />
        <Router history={navigator.history}>
          <Switch>
            <Route path="/settings" component={Setting} />
            <Route path="/home" component={Home} />
          </Switch>
        </Router>
      </>
    )
  }
}
