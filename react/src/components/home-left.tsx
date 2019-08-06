import { List, ListItem, ListItemText } from "@material-ui/core";
import React from "react";
import SettingService from "services/setting-service";
import { Page, Project } from "../types";

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

    this.state = { pages: SettingService.getPages(this.props.project.id) }
  }

  render(): React.ReactElement {
    return (
      <List className="home-left-container" dense>
        {this.state.pages.map(page => (
          <ListItem
            key={page.url}
            button
            onClick={() => {
              this.props.onPageSelected(page)
            }}
          >
            <ListItemText primary={page.name} title={page.url} />
          </ListItem>
        ))}
      </List>
    )
  }
}
