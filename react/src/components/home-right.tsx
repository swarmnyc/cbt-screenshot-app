import React from "react"
import { Page } from "../types"

interface Props {
  page?: Page
}

interface State {
  name?: string
  resultUrl?: string
}

const UserAgent = "Mozilla/5.0"

export default class HomeRight extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = this.getPageState(this.props.page)
  }

  componentWillReceiveProps(nextProps: Readonly<Props>): void {
    if (this.props.page != nextProps.page) {
      this.setState(this.getPageState(nextProps.page))
    }
  }

  render(): React.ReactElement {
    console.log("render")
    if (this.props.page) {
      return (
        <>
          {this.state.resultUrl && (
            <webview src={this.state.resultUrl} style={{ width: "100%", height: "100%" }} useragent={UserAgent} />
          )}
          {!this.state.resultUrl && <h5 className="m-2">{this.props.page.name} has no screenshot.</h5>}
        </>
      )
    } else {
      return <h1 className="m-5">Place select a page.</h1>
    }
  }

  getPageState(page: Page): State {
    if (page) {
      return {
        name: page.name,
        resultUrl: page.resultUrl ? `${page.resultUrl}?size=small&type=fullpage` : null
      }
    } else {
      return {
        name: null,
        resultUrl: null
      }
    }
  }
}
