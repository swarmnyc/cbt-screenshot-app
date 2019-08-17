import { AppBar, Button, IconButton, NativeSelect, Toolbar, Typography } from "@material-ui/core"
import { Add, Delete, KeyboardBackspace } from "@material-ui/icons"
import { Project } from "cbt-screenshot-common"
import React from "react"
import { RouteComponentProps } from "react-router-dom"
import ipcClient from "services/ipc-client"
import Swal from "sweetalert2"
import dataCache from "../services/data-cache"
import navigator from "../services/navigator"
import SettingConfig from "./setting-config"
import SettingPage from "./setting-page"

interface State {
  project?: Project
  config?: string
  pages?: string
}

export default class Setting extends React.Component<RouteComponentProps, State> {
  constructor(props: RouteComponentProps) {
    super(props)

    this.state = { project: dataCache.projectArray[0] }
  }

  render(): React.ReactElement {
    var projects = dataCache.projectArray
    var { project } = this.state
    var projectId: string = project ? project._id : ""
    return (
      <>
        <AppBar position="sticky">
          <Toolbar variant="dense" disableGutters={true}>
            <IconButton title="Back" color="inherit" onClick={this.onLeave}>
              <KeyboardBackspace />
            </IconButton>

            <Typography className="flex-grow">Settings</Typography>

            <Typography className="mx-2">Project:</Typography>
            <NativeSelect className="light" value={projectId} onChange={this.onProjectSelected}>
              {projects.length === 0 && <option>No Project</option>}
              {projects.map(p => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </NativeSelect>

            <Button variant="contained" className="m-2" color="default" onClick={this.addProject}>
              <Add className="mr-1" />
              Add
            </Button>

            {projectId && (
              <Button className="mr-3" variant="contained" color="default" onClick={this.deleteProject}>
                <Delete className="mr-1" />
                Delete
              </Button>
            )}
          </Toolbar>
        </AppBar>
        {projectId && this.renderProject()}
      </>
    )
  }

  private renderProject(): React.ReactElement {
    var { project } = this.state
    return (
      <React.Fragment key={project._id}>
        <SettingConfig project={project} onNameChanged={() => this.forceUpdate()} />
        <SettingPage project={project} />
      </React.Fragment>
    )
  }

  private addProject = () => {
    Swal.fire({
      title: "Place enter the project name",
      input: "text",
      showCancelButton: true
    }).then(result => {
      if (result.dismiss) return
      var projectName = result.value
      if (projectName) {
        ipcClient.createProject(projectName).then(project => {
          this.setState({ project })
        })
      }
    })
  }

  private onProjectSelected = (event: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({ project: dataCache.projectMap.get(event.target.value) })
  }

  private deleteProject = () => {
    Swal.fire({
      title: "Do you want to delete this project?",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async result => {
      if (result.dismiss) return
      await ipcClient.deleteProject(this.state.project)
      this.setState({ project: dataCache.projectArray[0] })
    })
  }

  private onLeave = () => {
    navigator.openHome()
  }
}
