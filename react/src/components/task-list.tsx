import {
  AppBar,
  IconButton,
  NativeSelect,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Toolbar,
  Typography
} from "@material-ui/core"
import { Clear, KeyboardBackspace, Refresh, SaveAlt } from "@material-ui/icons"
import { Project, Task, TaskState } from "cbt-screenshot-common"
import React from "react"
import { RouteComponentProps } from "react-router-dom"
import TimeAgo from "react-timeago"
import dataCache from "../services/data-cache"
import navigator from "../services/navigator"
import ipcClient from "services/ipc-client"

interface State {
  project: Project
  executingTasks: Task[]
  pendingTasks: Task[]
  errorTasks: Task[]
}

export default class TaskList extends React.Component<RouteComponentProps, State> {
  constructor(props: RouteComponentProps) {
    super(props)

    this.state = {
      project: dataCache.projectArray[0],
      executingTasks: [],
      pendingTasks: [],
      errorTasks: []
    }
  }

  componentDidMount() {
    this.fetchTasks()
  }

  render(): React.ReactElement {
    var projects = dataCache.projectArray
    var { project } = this.state
    var projectId: string = project ? project._id : ""

    return (
      <>
        <AppBar position="sticky">
          <Toolbar variant="dense" disableGutters={true}>
            <IconButton title="Back" color="inherit" onClick={this.goBack}>
              <KeyboardBackspace />
            </IconButton>

            <Typography className="flex-grow">Tasks</Typography>

            <Typography className="mx-2">Project:</Typography>
            <NativeSelect className="light" value={projectId} onChange={this.onProjectSelected}>
              {projects.map(p => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </NativeSelect>

            <IconButton title="Refresh" color="inherit" onClick={this.fetchTasks}>
              <Refresh />
            </IconButton>
          </Toolbar>
        </AppBar>
        <React.Fragment key={project._id}>
          {this.renderExecuting()}
          {this.renderPending()}
          {this.renderError()}
        </React.Fragment>
      </>
    )
  }

  private renderExecuting(): React.ReactElement {
    var tasks = this.state.executingTasks

    return (
      <>
        <Typography variant="h5" className="m-3">
          Executing Tasks
        </Typography>
        <Paper className="m-2 p-2">
          {tasks.length !== 0 && (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell align="right" style={{ width: "67px" }}>
                    NO.
                  </TableCell>
                  <TableCell align="left">Path</TableCell>
                  <TableCell align="left">Type</TableCell>
                  <TableCell align="left">Queued At</TableCell>
                  <TableCell align="left">Started At</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks.map((task, index) => {
                  var page = dataCache.pageMap.get(task.pageId)

                  return (
                    <TableRow key={task._id}>
                      <TableCell align="right">{index + 1}</TableCell>
                      <TableCell align="left">{page ? page.path : "Deleted"}</TableCell>
                      <TableCell align="left">{task.type}</TableCell>
                      <TableCell align="left">
                        <TimeAgo date={task.createdAt} />
                      </TableCell>
                      <TableCell align="left">
                        <TimeAgo date={task.executedAt} />
                      </TableCell>                      
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}

          {tasks.length === 0 && <Typography>No Items</Typography>}
        </Paper>
      </>
    )
  }

  private renderPending(): React.ReactElement {
    var tasks = this.state.pendingTasks

    return (
      <>
        <Typography variant="h5" className="m-3 mt-4">
          Pending Tasks
        </Typography>
        <Paper className="m-2 p-2">
          {tasks.length !== 0 && (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell align="right" style={{ width: "67px" }}>
                    NO.
                  </TableCell>
                  <TableCell align="left">Path</TableCell>
                  <TableCell align="left">Type</TableCell>
                  <TableCell align="left">Queued At</TableCell>
                  <TableCell style={{ width: "50px" }}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks.map((task, index) => {
                  var page = dataCache.pageMap.get(task.pageId)

                  return (
                    <TableRow key={task._id}>
                      <TableCell align="right">{index + 1}</TableCell>
                      <TableCell align="left">{page ? page.path : "Deleted"}</TableCell>
                      <TableCell align="left">{task.type}</TableCell>
                      <TableCell align="left">
                        <TimeAgo date={task.createdAt} />
                      </TableCell>
                      <TableCell align="right">
                      <IconButton
                          id={"task-" + task._id + "-pending"}
                          title="Cancel"
                          size="small"
                          onClick={this.cancelTask}
                        >
                          <Clear />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}

          {tasks.length === 0 && <Typography>No Items</Typography>}
        </Paper>
      </>
    )
  }

  private renderError(): React.ReactElement {
    var tasks = this.state.errorTasks

    return (
      <>
        <Typography variant="h5" className="m-3 mt-4">
          Error Tasks
        </Typography>
        <Paper className="m-2 p-2">
          {tasks.length !== 0 && (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell align="right" style={{ width: "67px" }}>
                    NO.
                  </TableCell>
                  <TableCell align="left">Path</TableCell>
                  <TableCell align="left">Type</TableCell>
                  <TableCell align="left">Queued At</TableCell>
                  <TableCell align="left">Failed At</TableCell>
                  <TableCell style={{ width: "50px" }}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks.map((task, index) => {
                  var page = dataCache.pageMap.get(task.pageId)

                  return (
                    <TableRow key={task._id}>
                      <TableCell align="right">{index + 1}</TableCell>
                      <TableCell align="left">{page ? page.path : "Deleted"}</TableCell>
                      <TableCell align="left">{task.type}</TableCell>
                      <TableCell align="left">
                        <TimeAgo date={task.createdAt} />
                      </TableCell>
                      <TableCell align="left">
                        <TimeAgo date={task.finishedAt} />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          id={"task-" + task._id + "-archive"}
                          title="Archive"
                          size="small"
                          onClick={this.archiveErrorTask}
                        >
                          <SaveAlt />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}

          {tasks.length === 0 && <Typography>No Items</Typography>}
        </Paper>
      </>
    )
  }

  private onProjectSelected = (event: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({ project: dataCache.projectMap.get(event.target.value) })
  }

  private cancelTask = (event: React.MouseEvent<HTMLButtonElement>) => {
    var arr = event.currentTarget.id.split("-")
    var taskId = arr[1]

    ipcClient.cancelTask(taskId).then(() => {
      this.setState({
        pendingTasks: this.state.pendingTasks.filter(d => d._id !== taskId)
      })
    })
  }

  private archiveErrorTask = (event: React.MouseEvent<HTMLButtonElement>) => {
    var arr = event.currentTarget.id.split("-")
    var taskId = arr[1]

    ipcClient.archiveErrorTask(taskId).then(() => {
      this.setState({
        errorTasks: this.state.errorTasks.filter(d => d._id !== taskId)
      })
    })
  }

  private goBack = () => {
    navigator.openHome()
  }

  private fetchTasks = async () => {
    var tasks = await ipcClient.getTasks()
    var executingTasks = tasks.filter(d => d.state === TaskState.Executing)
    var pendingTasks = tasks.filter(d => d.state === TaskState.Pending)
    var errorTasks = tasks.filter(d => d.state === TaskState.Error)

    this.setState({ executingTasks, pendingTasks, errorTasks })
  }
}
