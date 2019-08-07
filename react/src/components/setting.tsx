import React from "react"
import { RouteComponentProps } from "react-router-dom"
import SettingService from "services/setting-service"
import Swal from "sweetalert2"
import { Project } from "cbt-screenshot-common"

interface State {
  projects?: Project[]
  projectId?: string
  config?: string
  pages?: string
}

export default class Setting extends React.Component<RouteComponentProps, State> {
  constructor(props: RouteComponentProps) {
    super(props)

    // var projects = SettingService.getProjects()
    // var projectId = projects.length > 0 ? projects[0].id : ""
    // this.state = this.getProjectState(projectId, projects)
  }

  render(): React.ReactElement {
    return <div>test</div>
    // return (
    //   <div className="container-fluid p-3 mb-5">
    //     <h1>Settings</h1>
    //     <div className="row">
    //       <div className="col">
    //         <div className="form-inline">
    //           <label htmlFor="project">Projects</label>
    //           <select
    //             className="custom-select mx-1"
    //             id="project"
    //             value={this.state.projectId}
    //             onChange={this.selectProject}
    //           >
    //             {this.state.projects.length === 0 && <option>No Project</option>}
    //             {this.state.projects.map(p => (
    //               <option key={p.id} value={p.id}>
    //                 {p.name}
    //               </option>
    //             ))}
    //           </select>
    //           <button type="button" className="btn ml-2 btn-dark" onClick={this.addProject}>
    //             Add Project
    //           </button>

    //           {this.state.projectId && (
    //             <>
    //               <button type="button" className="btn mx-1 btn-secondary" onClick={this.renameProject}>
    //                 Rename
    //               </button>

    //               <button type="button" className="btn btn-danger" onClick={this.deleteProject}>
    //                 Delete
    //               </button>
    //             </>
    //           )}
    //         </div>
    //       </div>
    //     </div>

    //     {this.state.projectId && this.renderProject()}

    //     <div className="fixed-bottom bg-secondary py-2 px-3">
    //       <button type="button" className="btn btn-primary" onClick={this.save}>
    //         Save
    //       </button>

    //       <button type="button" className="btn btn-danger float-right" onClick={this.cancel}>
    //         Cancel
    //       </button>
    //     </div>
    //   </div>
    // )
  }

  private renderProject(): React.ReactElement {
    return (
      <>
        <div className="row">
          <div className="col">
            <h2 className="my-2">Config</h2>
            <p>The config of CrossBrowserTesting such as username, password and the browsers of screenshot</p>

            <textarea className="form-control" rows={15} onChange={this.updateConfig} value={this.state.config} />
          </div>
          <div className="col">
            <h2 className="my-2">Pages</h2>
            <p>The settings of pages</p>
            <textarea className="form-control" rows={15} onChange={this.updatePages} value={this.state.pages} />
          </div>
        </div>
      </>
    )
  }

  private addProject = () => {
    // Swal.fire({
    //   title: "Place enter the project name",
    //   input: "text",
    //   showCancelButton: true
    // }).then(result => {
    //   if (result.dismiss) return
    //   var projectName = result.value
    //   if (projectName) {
    //     var project = SettingService.createProject(projectName)
    //     this.setState(this.getProjectState(project.id, SettingService.getProjects()))
    //   }
    // })
  }

  private selectProject = (event: React.SyntheticEvent) => {
    var target = event.target as HTMLSelectElement
    var projectId = target.value

    this.setState(this.getProjectState(projectId))
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

  private cancel = () => {
    this.props.history.replace("/")
  }
}
