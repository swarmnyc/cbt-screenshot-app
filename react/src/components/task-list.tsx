import {
  AppBar,
  IconButton,
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
import { Task, TaskState } from "cbt-screenshot-common"
import React from "react"
import { RouteComponentProps } from "react-router-dom"
import TimeAgo from "react-timeago"
import ipcClient from "services/ipc-client"
import dataCache from "../services/data-cache"
import navigator from "../services/navigator"

interface State {
  executingTasks: Task[]
  pendingTasks: Task[]
  errorTasks: Task[]
}

export default class TaskList extends React.Component<RouteComponentProps, State> {
  constructor(props: RouteComponentProps) {
    super(props)

    this.state = {
      executingTasks: [],
      pendingTasks: [],
      errorTasks: []
    }
  }

  componentDidMount() {
    this.fetchTasks()
  }

  render(): React.ReactElement {
    return (
      <>
        <AppBar position="sticky">
          <Toolbar variant="dense" disableGutters={true}>
            <IconButton title="Back" color="inherit" onClick={this.goBack}>
              <KeyboardBackspace />
            </IconButton>

            <Typography className="flex-grow">Tasks</Typography>

            <IconButton title="Refresh" color="inherit" onClick={this.fetchTasks}>
              <Refresh />
            </IconButton>
          </Toolbar>
        </AppBar>

        {this.renderExecuting()}
        {this.renderPending()}
        {this.renderError()}
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
                  <TableCell align="left">Project</TableCell>
                  <TableCell align="left">Path</TableCell>
                  <TableCell align="left">Type</TableCell>
                  <TableCell align="left">Queued At</TableCell>
                  <TableCell align="left">Started At</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks.map((task, index) => {
                  var page = dataCache.pageMap.get(task.pageId)
                  var project = dataCache.projectMap.get(task.projectId)

                  return (
                    <TableRow key={task._id}>
                      <TableCell align="right">{index + 1}</TableCell>
                      <TableCell align="left">{project ? project.name : "Deleted"}</TableCell>
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
                  <TableCell align="left">Project</TableCell>
                  <TableCell align="left">Path</TableCell>
                  <TableCell align="left">Type</TableCell>
                  <TableCell align="left">Queued At</TableCell>
                  <TableCell style={{ width: "50px" }}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks.map((task, index) => {
                  var page = dataCache.pageMap.get(task.pageId)
                  var project = dataCache.projectMap.get(task.projectId)

                  return (
                    <TableRow key={task._id}>
                      <TableCell align="right">{index + 1}</TableCell>
                      <TableCell align="left">{project ? project.name : "Deleted"}</TableCell>
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
                  <TableCell align="left">Project</TableCell>
                  <TableCell align="left">Path</TableCell>
                  <TableCell align="left">Type</TableCell>
                  <TableCell align="left">Queued At</TableCell>
                  <TableCell align="left">Failed At</TableCell>
                  <TableCell align="left">Reason</TableCell>
                  <TableCell style={{ width: "50px" }}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks.map((task, index) => {
                  var page = dataCache.pageMap.get(task.pageId)
                  var project = dataCache.projectMap.get(task.projectId)

                  return (
                    <TableRow key={task._id}>
                      <TableCell align="right">{index + 1}</TableCell>
                      <TableCell align="left">{project ? project.name : "Deleted"}</TableCell>
                      <TableCell align="left">{page ? page.path : "Deleted"}</TableCell>
                      <TableCell align="left">{task.type}</TableCell>
                      <TableCell align="left">
                        <TimeAgo date={task.createdAt} />
                      </TableCell>
                      <TableCell align="left">
                        <TimeAgo date={task.finishedAt} />
                      </TableCell>
                      <TableCell align="left">
                        <Typography title={task.reason}>
                          {task.reason && task.reason.length > 10 ? task.reason.substring(0, 10) + "..." : task.reason}
                        </Typography>
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
