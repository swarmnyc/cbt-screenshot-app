import React from "react"
import { Page, Project } from "../types"
import SettingService from "services/setting-service"
import Swal from "sweetalert2"
import ApiService from "services/api-service"

interface Props {
  onPageSelected: (page: Page) => void
}

interface State {
  projects?: Project[]
  project?: Project
  isProcessing: boolean
}

export default class HomeLeft extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    var projects = SettingService.getProjects()
    this.state = { projects, project: projects[0], isProcessing: false }
  }

  render(): React.ReactElement {
    return (
      <>
        <div className="form-inline m-2">
          <label htmlFor="project">Projects</label>
          <select
            className="custom-select mx-1"
            id="project"
            value={this.state.project.id}
            onChange={this.selectProject}
          >
            {this.state.projects.map(p => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {this.renderPages()}

        <div className="take-screenshot-container bg-secondary">
          <button type="button" className="btn btn-primary" onClick={this.takeScreenshots}>
            Take all screenshots
          </button>
          {this.state.isProcessing && (
            <span className="spinner-border text-light float-right mt-1" role="status">
              <span className="sr-only">Loading...</span>
            </span>
          )}
        </div>
      </>
    )
  }

  private renderPages(): React.ReactElement {
    return (
      <div className="page-item-container">
        {this.state.project.pages.map(page => (
          <button
            key={page.url}
            type="button"
            className="btn btn-link page-item"
            onClick={() => {
              this.props.onPageSelected(page)
            }}
          >
            {page.name}
          </button>
        ))}
      </div>
    )
  }

  private selectProject = (event: React.SyntheticEvent) => {
    var target = event.target as HTMLSelectElement

    this.props.onPageSelected(null)
    this.setState({ project: SettingService.getProject(target.value) })
  }

  private takeScreenshots = () => {
    this.setState({ isProcessing: true })
    ApiService.takeScreenshots(this.state.project).on("done", () => {
      this.setState({ isProcessing: false })
    })
  }
}
