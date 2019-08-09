import React from "react"
import { RouteComponentProps } from "react-router-dom"
import SettingService from "services/setting-service"
import Swal from "sweetalert2"
import { Project } from "cbt-screenshot-common"
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Typography,
  NativeSelect,
  Button,
  FormControl,
  InputLabel,
  Input,
  Paper,
  TextField
} from "@material-ui/core"
import { KeyboardBackspace } from "@material-ui/icons"
import navigator from "../services/navigator"
import dataCache from "../services/data-cache"
import { display } from "@material-ui/system"
import ipcClient from "services/ipc-client"

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
        <AppBar position="static">
          <Toolbar variant="dense" disableGutters={true}>
            <IconButton title="Back" color="inherit" onClick={this.onLeave}>
              <KeyboardBackspace />
            </IconButton>

            <Typography>Settings</Typography>
          </Toolbar>
        </AppBar>
        <Box className="m-2">
          <Box style={{ display: "flex", alignItems: "center" }}>
            <Typography variant="h6" className="mx-2">
              Project:
            </Typography>
            <NativeSelect value={projectId} onChange={this.onProjectSelected}>
              {projects.length === 0 && <option>No Project</option>}
              {projects.map(p => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </NativeSelect>
            <Button variant="contained" className="m-2" onClick={this.addProject}>
              Add
            </Button>

            {projectId && (
              <>
                <Button variant="contained" onClick={this.deleteProject}>
                  Delete
                </Button>
              </>
            )}
          </Box>
        </Box>
        {projectId && this.renderProject()}
      </>
    )
  }

  private renderProject(): React.ReactElement {
    var { project } = this.state
    var mobileBrowsers = (project.mobileBrowsers || []).join(", ")
    var desktopBrowsers = (project.desktopBrowsers || []).join(", ")

    return (
      <>
        <Typography className="mx-3 my-2">Configs</Typography>

        <Paper className="m-2 p-2" key={project._id}>
          <TextField
            id="project-name"
            label="Name"
            fullWidth
            defaultValue={project.name}
            onBlur={this.onConfigChanged}
          />

          <TextField
            id="project-authName"
            label="CBT UserName"
            className="mt-3"
            fullWidth
            defaultValue={project.authName}
            onBlur={this.onConfigChanged}
          />

          <TextField
            id="project-authKey"
            label="CBT Auth Key"
            className="mt-3"
            fullWidth
            defaultValue={project.authKey}
            onBlur={this.onConfigChanged}
          />

          <TextField
            id="project-domain"
            label="Website domain"
            className="mt-3"
            fullWidth
            defaultValue={project.domain}
            onBlur={this.onConfigChanged}
          />

          <TextField
            id="project-mobileBrowsers"
            label="CBT Mobile Browsers"
            className="mt-3"
            helperText="use comma(,) to separate"
            fullWidth
            defaultValue={mobileBrowsers}
            onBlur={this.onConfigChanged}
          />

          <TextField
            id="project-desktopBrowsers"
            label="CBT Desktop Browsers"
            className="mt-3"
            fullWidth
            defaultValue={desktopBrowsers}
            helperText="use comma(,) to separate"
            onBlur={this.onConfigChanged}
          />
        </Paper>
      </>
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

  private onConfigChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    var prop = event.target.id.split("-")[1] as keyof Project
    var value = event.target.value.trim()

    if (event.target.defaultValue != event.target.value) {
      ipcClient.updateProjectProperty(this.state.project, prop, value).then(() => {
        // update name on select
        if (prop == "name") {
          this.setState({ project: this.state.project })
        }
      })
    }
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
