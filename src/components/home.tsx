import React from "react"
import SplitPane from "react-split-pane"
import HomeLeft from "./home-left"
import { Page } from "../types"
import HomeRight from "./home-right"

interface State {
  page?: Page
}

export default class Home extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props)
    this.state = {}
  }

  render(): React.ReactElement {
    var { page } = this.state

    return (
      <SplitPane split="vertical" minSize={200} defaultSize={300} maxSize={500}>
        <HomeLeft onPageSelected={this.onPageSelected} />
        <HomeRight page={page} />
      </SplitPane>
    )
  }

  onPageSelected = (page: Page): void => {
    this.setState({ page })
  }

  renderRightSide(): React.ReactElement {
    return <span>right side</span>
  }
}
