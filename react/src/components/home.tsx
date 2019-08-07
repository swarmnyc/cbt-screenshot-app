import { AppBar, IconButton, NativeSelect, Toolbar, Typography, Box } from "@material-ui/core"
import { PresentToAll, Settings } from "@material-ui/icons"
import { Page, Project } from "cbt-screenshot-common"
import React from "react"
import SplitPane from "react-split-pane"
import dataCache from "services/data-cache"
import HomeLeft from "./home-left"
import HomeRight from "./home-right"

interface State {
  project?: Project
  page?: Page
}

export default class Home extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props)

    this.state = { project: dataCache.projectArray[0] }
  }

  render(): React.ReactElement {
    var projects = dataCache.projectArray
    var { page, project } = this.state

    return (
      <>
        <AppBar position="static">
          <Toolbar variant="dense" disableGutters={true}>
            <Typography className="mx-2">Project:</Typography>
            <NativeSelect value={project._id} onChange={this.onProjectSelected} className="light">
              {projects.map(p => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </NativeSelect>
            <Box className="flex-grow" />

            <IconButton title="Task Screenshots" color="inherit" onClick={() => {}}>
              <PresentToAll />
            </IconButton>
            <IconButton title="Settings" color="inherit">
              <Settings />
            </IconButton>
          </Toolbar>
        </AppBar>
        <SplitPane split="vertical" minSize={200} defaultSize={300} maxSize={500} style={{ height: "" }}>
          <HomeLeft project={project} onPageSelected={this.onPageSelected} />
          <HomeRight project={project} page={page} />
        </SplitPane>
      </>
    )
  }

  onProjectSelected = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    this.setState({ project: dataCache.projectMap.get(event.target.value), page: null })
  }

  onPageSelected = (page: Page): void => {
    this.setState({ page })
  }

  renderRightSide(): React.ReactElement {
    return <span>right side</span>
  }
}
