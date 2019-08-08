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
  projects?: Project[]
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
          <TextField id="project-name" fullWidth label="Name" defaultValue={project.name} />

          <TextField
            id="project-username"
            label="CBT UserName"
            className="mt-3"
            fullWidth
            defaultValue={project.authName}
          />

          <TextField
            id="project-authkey"
            label="CBT Auth Key"
            className="mt-3"
            fullWidth
            defaultValue={project.authKey}
          />

          <TextField
            id="project-mobile-browsers"
            label="CBT Auth Key"
            className="mt-3"
            helperText="use comma to separate"
            fullWidth
            defaultValue={mobileBrowsers}
          />

          <TextField
            id="project-desktop-browsers"
            label="CBT Auth Key"
            className="mt-3"
            fullWidth
            defaultValue={desktopBrowsers}
            helperText="use comma to separate"
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

  private getProjectState = (projectId: string, projects?: Project[]): State => {
    throw new Error()
    // var project = projectId ? SettingService.getProject(projectId) : null
    // var config = project ? JSON.stringify(project.config, null, 4) : ""
    // var pages = project ? JSON.stringify(project.pages, null, 4) : ""

    // var state: State = { projectId, config, pages }
    // if (projects) {
    //   state.projects = projects
    // }

    // return state
  }

  private renameProject = () => {
    // var project = SettingService.getProject(this.state.projectId)
    // Swal.fire({
    //   title: "Place enter the project name",
    //   input: "text",
    //   inputValue: project.name,
    //   showCancelButton: true
    // }).then(result => {
    //   if (result.dismiss) return
    //   var projectName = result.value
    //   if (projectName && projectName !== project.name) {
    //     project.name = projectName
    //     this.forceUpdate()
    //   }
    // })
  }

  private deleteProject = () => {
    // Swal.fire({
    //   title: "Do you want to delete this project?",
    //   type: "warning",
    //   showCancelButton: true,
    //   confirmButtonColor: "#3085d6",
    //   cancelButtonColor: "#d33",
    //   confirmButtonText: "Yes, delete it!"
    // }).then(result => {
    //   if (result.dismiss) return
    //   SettingService.deleteProject(this.state.projectId)
    //   var projects = SettingService.getProjects()
    //   var project = projects[0]
    //   var projectId = project ? project.id : null
    //   this.setState(this.getProjectState(projectId, projects))
    // })
  }

  private updateConfig = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    // try {
    //   var config = JSON.parse(event.target.value)
    //   SettingService.getProject(this.state.projectId).config = config
    // } catch (e) {}
    // this.setState({ config: event.target.value })
  }

  private updatePages = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    // try {
    //   var pages = JSON.parse(event.target.value)
    //   SettingService.getProject(this.state.projectId).pages = pages
    // } catch (e) {}
    // this.setState({ pages: event.target.value })
  }

  private save = () => {
    // SettingService.save()
    this.props.history.replace("/")
  }

  private onLeave = () => {
    // TODO: check change or not
    navigator.openHome()
  }
}
