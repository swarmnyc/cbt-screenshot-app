import { AppBar, IconButton, NativeSelect, Toolbar, Typography, Box, Switch } from "@material-ui/core"
import { OpenInBrowser } from "@material-ui/icons"
import { Page, Project } from "cbt-screenshot-common"
import React from "react"
import SplitPane from "react-split-pane"
import dataCache from "../services/data-cache"
import HomeLeft from "./home-left"
import HomeRight from "./home-right"
import settingService from "services/setting-service"

interface State {
  project?: Project
  page?: Page
  mobileMode: boolean
  resultUrl?: string
}

export default class Home extends React.Component<{}, State> {
  homeRightRef: HomeRight

  constructor(props: {}) {
    super(props)

    var project = dataCache.projectMap.get(settingService.getLastSelectProjectId())
    if (project == null) {
      project = dataCache.projectArray[0]
    }

    this.state = { project, mobileMode: true }
  }

  render(): React.ReactElement {
    var projects = dataCache.projectArray
    var { page, project, mobileMode, resultUrl } = this.state

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

            {resultUrl && (
              <IconButton title="Open Browser" color="inherit" onClick={this.openBrowser}>
                <OpenInBrowser />
              </IconButton>
            )}

            {page && (
              <>
                <Typography>Desktop</Typography>
                <Switch checked={mobileMode} onChange={this.onModeChanged} />
                <Typography className="mr-2">Mobile</Typography>
              </>
            )}
          </Toolbar>
        </AppBar>
        <SplitPane
          key={project._id}
          split="vertical"
          minSize={200}
          defaultSize={300}
          maxSize={500}
          style={{ height: "" }}
        >
          <HomeLeft project={project} onPageSelected={this.onPageSelected} />
          <HomeRight
            project={project}
            page={page}
            mobileMode={mobileMode}
            onResultUrlFetched={this.onResultUrlChanged}
          />
        </SplitPane>
      </>
    )
  }

  private onProjectSelected = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    var project = dataCache.projectMap.get(event.target.value)
    settingService.setLastSelectProjectId(project._id)
    this.setState({ project, page: null })
  }

  private onPageSelected = (page: Page): void => {
    this.setState({ page })
  }

  private onModeChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ mobileMode: event.target.checked })
  }

  private onResultUrlChanged = (url: string) => {
    this.setState({ resultUrl: url })
  }

  private openBrowser = () => {
    window.electron.shell.openExternal(this.state.resultUrl)
  }
}
