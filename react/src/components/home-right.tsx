import { Box, Typography } from "@material-ui/core"
import { CbtScreenshot, CbtScreenshotVersion, LoadStatus, PageView, Project } from "cbt-screenshot-common"
import React from "react"
import cbtApiService from "services/cbt-api-service"
import Error from "./error"
import Loading from "./loading"

const UserAgent = "Mozilla/5.0"

interface Props {
  project: Project
  page: PageView
}

interface State {
  status: LoadStatus
  screenshot?: CbtScreenshot
  screenshotVersion?: CbtScreenshotVersion
}

export default class HomeRight extends React.Component<Props, State> {
  state: State = { status: LoadStatus.Loading }

  componentWillMount(): void {
    this.fetchCbtScreenshot(this.props.project, this.props.page)
  }

  componentWillReceiveProps(nextProps: Readonly<Props>): void {
    if (this.props.page !== nextProps.page) {
      this.setState({ status: LoadStatus.Loading })
      this.fetchCbtScreenshot(nextProps.project, nextProps.page)
    }
  }

  render(): React.ReactElement {
    switch (this.state.status) {
      case LoadStatus.Loading:
        return <Loading />
      case LoadStatus.Error:
        return <Error />
    }

    if (this.props.page) {
      if (this.state.screenshotVersion) {
        var { show_results_public_url: resultUrl } = this.state.screenshotVersion
        resultUrl += "?size=small&type=fullpage"
        return <webview src={resultUrl} style={{ width: "100%", height: "100%" }} useragent={UserAgent} />
      } else {
        return (
          <Box className="screen-center">
            <Typography variant="h5">This page has no screenshot.</Typography>
          </Box>
        )
      }
    } else {
      return (
        <Box className="screen-center">
          <Typography variant="h5">Place select a page on the left side.</Typography>
        </Box>
      )
    }
  }

  fetchCbtScreenshot(project: Project, page: PageView): void {
    if (page == null || !page.resultId) {
      this.setState({ status: LoadStatus.Loaded, screenshot: null, screenshotVersion: null })
      return
    }

    if (page.screenshot) {
      this.setState({
        status: LoadStatus.Loaded,
        screenshot: page.screenshot,
        screenshotVersion: page.screenshot.versions[page.screenshot.versions.length - 1]
      })
      return
    }

    cbtApiService
      .getScreenshot(project, page)
      .then(screenshot => {
        page.screenshot = screenshot
        this.setState({
          status: LoadStatus.Loaded,
          screenshot,
          screenshotVersion: screenshot.versions[screenshot.versions.length - 1]
        })
      })
      .catch(error => {
        this.setState({ status: LoadStatus.Error })
        console.error("Fetch CBT Page Failed", error)
      })
  }
}
