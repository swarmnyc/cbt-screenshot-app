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
  mobileMode: boolean
  onResultUrlFetched: (url: string) => void
}

interface State {
  status: LoadStatus
  screenshot?: CbtScreenshot
  screenshotVersion?: CbtScreenshotVersion
}

export default class HomeRight extends React.Component<Props, State> {
  state: State = { status: LoadStatus.Loading }

  componentWillMount(): void {
    this.fetchCbtScreenshot(this.props.project, this.props.page, this.props.mobileMode)
  }

  componentWillReceiveProps(nextProps: Readonly<Props>): void {
    if (this.props.page !== nextProps.page || this.props.mobileMode !== nextProps.mobileMode) {
      this.setState({ status: LoadStatus.Loading })
      this.fetchCbtScreenshot(nextProps.project, nextProps.page, nextProps.mobileMode)
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
      if (this.props.page.screenshot) {
        var { show_results_web_url: resultUrl } = this.state.screenshotVersion
        resultUrl += "?size=small&type=fullpage"
        return (
          <webview
            ref={this.onWebViewRef}
            src={resultUrl}
            style={{ width: "100%", height: "100%" }}
            useragent={UserAgent}
          />
        )
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

  private fetchCbtScreenshot = (project: Project, page: PageView, mobileMode: boolean): void => {
    if (!page) {
      this.setState({ status: LoadStatus.Loaded, screenshot: null, screenshotVersion: null }, this.onVersionChanged)
      return
    }

    var resultId = mobileMode ? page.mobileResultId : page.desktopResultId

    if (!resultId) {
      this.setState({ status: LoadStatus.Loaded, screenshot: null, screenshotVersion: null }, this.onVersionChanged)
      return
    }

    if (page.screenshot && page.screenshot.screenshot_test_id.toString() === resultId) {
      this.setState(
        {
          status: LoadStatus.Loaded,
          screenshot: page.screenshot,
          screenshotVersion: page.screenshot.versions[page.screenshot.versions.length - 1]
        },
        this.onVersionChanged
      )
      return
    }

    cbtApiService
      .getScreenshot(project, resultId)
      .then(screenshot => {
        page.screenshot = screenshot

        this.setState(
          {
            status: LoadStatus.Loaded,
            screenshot,
            screenshotVersion: screenshot.versions[screenshot.versions.length - 1]
          },
          this.onVersionChanged
        )
      })
      .catch(error => {
        this.setState({ status: LoadStatus.Error })
        console.error("Fetch CBT Page Failed", error)
      })
  }

  private onWebViewRef = (ref: HTMLWebViewElement) => {
    if (ref) {
      ref.addEventListener("dom-ready", () => {
        console.log("dom-ready", ref.getURL())

        var project = this.props.project

        if (ref.getURL().includes("/login")) {
          // for login page
          ref.executeJavaScript(`
          $("#inputEmail").val("${project.authName}")
          $("#inputEmail").trigger("change")
          $("#inputPassword").val("${project.authPassword}")
          $("#inputPassword").trigger("change")
          $("#login-btn").click()
          `)
        } else {
          // for result page

          ref.executeJavaScript(`
          var check = setInterval(()=>{
            if ($(".sidenav:visible, .sidenav-expanded, .has-notice-bar").size() > 0) {
              $(".app-navbar").hide()
              $(".sidenav").hide()
              $(".wrapper").css("padding-top", "0px")
              $(".has-notice-bar").removeClass("has-notice-bar")
              $(".has-sidenav").removeClass("has-sidenav")
              $(".sidenav-expanded").removeClass("sidenav-expanded")
            }
          }, 1000)
  
          $(window).scroll(function() {
            if ($(".will-stick").size() > 0) {
              if ($(".will-stick").hasClass("sticky")){
                $(".will-stick").hide()
              }else{
                $(".will-stick").show()
              }
            }
          });
          `)
        }
      })
    }
  }

  private onVersionChanged = () => {
    if (this.state.screenshotVersion) {
      this.props.onResultUrlFetched(this.state.screenshotVersion.show_results_web_url)
    } else {
      this.props.onResultUrlFetched(null)
    }
  }
}
