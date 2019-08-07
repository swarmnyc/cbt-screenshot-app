import { List, ListItem, ListItemText } from "@material-ui/core"
import { Page, Project } from "cbt-screenshot-common"
import React from "react"
import dataCache from "services/data-cache"

interface Props {
  project: Project
  onPageSelected: (page: Page) => void
}

interface State {
  pages?: Page[]
}

export default class HomeLeft extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = { pages: dataCache.projectPageMap.get(this.props.project._id) }
  }

  render(): React.ReactElement {
    return (
      <List className="home-left-container" dense>
        {this.state.pages.map(page => (
          <ListItem
            key={page._id}
            button
            onClick={() => {
              this.props.onPageSelected(page)
            }}
          >
            <ListItemText primary={page.name} title={page.path} />
          </ListItem>
        ))}
      </List>
    )
  }
}
