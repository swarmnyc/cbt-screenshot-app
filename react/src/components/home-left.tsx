import { List, ListItem, ListItemText, Typography, withStyles } from "@material-ui/core"
import MuiExpansionPanel from "@material-ui/core/ExpansionPanel"
import MuiExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails"
import MuiExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import { Page, Project } from "cbt-screenshot-common"
import Noty from "noty"
import React from "react"
import dataCache from "services/data-cache"
import ipcClient from "services/ipc-client"
import SearchBox from "./search-box"

const ExpansionPanel = withStyles({
  root: {
    border: "1px solid rgba(0, 0, 0, .125)",
    boxShadow: "none",
    "&:first-child": {
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0
    },
    "&:last-child": {
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0
    },
    "&:not(:last-child)": {
      borderBottom: 0
    },
    "&:before": {
      display: "none"
    },
    "&$expanded": {
      margin: "auto"
    }
  },
  expanded: {}
})(MuiExpansionPanel)

const ExpansionPanelSummary = withStyles({
  root: {
    backgroundColor: "rgba(0, 0, 0, .03)",
    borderBottom: "1px solid rgba(0, 0, 0, .125)",
    marginBottom: -1,
    minHeight: 42,
    "&$expanded": {
      minHeight: 42
    }
  },
  content: {
    display: "block",
    "&$expanded": {
      margin: "8px 0"
    }
  },
  expanded: {}
})(MuiExpansionPanelSummary)

const ExpansionPanelDetails = withStyles({
  root: {
    display: "block",
    padding: 0
  }
})(MuiExpansionPanelDetails)

interface Props {
  project: Project
  onPageSelected: (page: Page) => void
}

interface State {
  pages?: Map<string, Page[]>
}

export default class HomeLeft extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = { pages: dataCache.getPagesByFolders(this.props.project) }
  }

  render(): React.ReactElement {
    var comps: React.ReactElement[] = []

    this.state.pages.forEach((pages, folder) => {
      comps.push(
        <ExpansionPanel key={folder}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography onContextMenu={e => this.showFolderContextMenu(pages)}>{folder}</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <List dense>
              {pages.map(page => (
                <ListItem
                  key={page._id}
                  button
                  onClick={() => {
                    this.props.onPageSelected(page)
                  }}
                  onContextMenu={e => this.showPageContextMenu(page)}
                >
                  <ListItemText primary={page.name} title={page.path} />
                </ListItem>
              ))}
            </List>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      )
    })

    return (
      <div className="home-left-container">
        <SearchBox onChanged={this.search} className="borderless" />
        {comps}
      </div>
    )
  }

  private search = (search: string) => {
    this.setState({ pages: dataCache.getPagesByFolders(this.props.project, search.toLowerCase()) })
  }

  private showFolderContextMenu = (pages: Page[]) => {
    var { Menu, MenuItem } = window.electron.remote
    const menu = new Menu()
    menu.append(
      new MenuItem({
        label: "Take Screenshots of this folder",
        click: () => {
          ipcClient.newTasks(this.props.project, pages.map(p => p._id)).then(() => this.showSuccessMessage(false))
        }
      })
    )
    menu.popup()
  }

  private showPageContextMenu = (page: Page) => {
    var { Menu, MenuItem } = window.electron.remote
    const menu = new Menu()
    menu.append(
      new MenuItem({
        label: "Take Screenshot",
        click: () => {
          ipcClient.newTasks(this.props.project, [page._id]).then(() => this.showSuccessMessage(true))
        }
      })
    )
    menu.popup()
  }

  private showSuccessMessage(single: boolean) {
    new Noty({
      theme: "nest",
      type: "success",
      layout: "topRight",
      timeout: 2000,
      text: single ? "Task Created" : "Tasks Created"
    }).show()
  }
}
