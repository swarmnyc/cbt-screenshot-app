import { AppBar, IconButton, NativeSelect, Toolbar, Typography } from "@material-ui/core"
import { PresentToAll, Settings } from "@material-ui/icons"
import React from "react"
import SplitPane from "react-split-pane"
import SettingService from "services/setting-service"
import { Page, Project } from "../types"
import HomeLeft from "./home-left"
import HomeRight from "./home-right"
import Swal from "sweetalert2"

interface State {
  projects?: Project[]
  project?: Project
  page?: Page
}

export default class Home extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props)

    var projects = SettingService.getProjects()
    this.state = { projects, project: projects[0] }
  }

  render(): React.ReactElement {
    var { page } = this.state

    return (
      <>
        <AppBar position="static">
          <Toolbar variant="dense">
            <Typography variant="h6" className="flex-grow">
              CBT Screenshot App
            </Typography>

            <Typography>Projects:</Typography>
            <NativeSelect value={this.state.project.id} onChange={this.onProjectSelected} className="m-2 light">
              {this.state.projects.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </NativeSelect>

            <IconButton title="Task Screenshots" color="inherit" onClick={() => {}}>
              <PresentToAll />
            </IconButton>
            <IconButton edge="end" title="Settings" color="inherit">
              <Settings />
            </IconButton>
          </Toolbar>
        </AppBar>
        <SplitPane split="vertical" minSize={200} defaultSize={300} maxSize={500} style={{ height: "" }}>
          <HomeLeft project={this.state.project} onPageSelected={this.onPageSelected} />
          <HomeRight page={page} />
        </SplitPane>
      </>
    )
  }

  onProjectSelected = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    this.setState({ project: SettingService.getProject(event.target.value), page: null })
  }

  onPageSelected = (page: Page): void => {
    this.setState({ page })
  }

  renderRightSide(): React.ReactElement {
    return <span>right side</span>
  }
}
