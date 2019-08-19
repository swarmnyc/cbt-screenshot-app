import { Paper, TextField, Typography } from "@material-ui/core"
import { ActionFunc, Project } from "cbt-screenshot-common"
import React from "react"
import ipcClient from "services/ipc-client"

interface Props {
  project: Project
  onNameChanged: ActionFunc
}

interface State {
  pages?: string
}

export default class SettingConfig extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {}
  }

  render(): React.ReactElement {
    var project = this.props.project
    var mobileBrowsers = (project.mobileBrowsers || []).join(", ")
    var desktopBrowsers = (project.desktopBrowsers || []).join(", ")

    return (
      <>
        <Typography variant="h5" className="mx-3 my-2">
          Configs
        </Typography>

        <Paper className="m-2 p-2">
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
            id="project-authPassword"
            label="CBT Auth Password"
            className="mt-3"
            fullWidth
            defaultValue={project.authPassword}
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
            id="project-awsKey"
            label="AWS Access Key"
            className="mt-3"
            fullWidth
            defaultValue={project.awsKey}
            onBlur={this.onConfigChanged}
          />

          <TextField
            id="project-awsKeySecret"
            label="AWS Access Key Secret"            
            className="mt-3"
            fullWidth
            defaultValue={project.awsKeySecret}
            onBlur={this.onConfigChanged}
          />

          <TextField
            id="project-awsRegion"
            label="AWS Region"
            className="mt-3"
            fullWidth
            defaultValue={project.awsRegion}
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

  private onConfigChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    var prop = event.target.id.split("-")[1] as keyof Project
    var value = event.target.value.trim()

    if (event.target.defaultValue !== value) {
      ipcClient.updateProjectProperty(this.props.project, prop, value).then(() => {
        if (prop === "name") {
          this.props.onNameChanged()
        }
      })
    }
  }
}
