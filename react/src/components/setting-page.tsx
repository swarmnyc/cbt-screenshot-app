import {
  Box,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from "@material-ui/core"
import { Delete } from "@material-ui/icons"
import { Page, Project } from "cbt-screenshot-common"
import React from "react"
import dataCache from "services/data-cache"
import ipcClient from "services/ipc-client"

interface Props {
  project: Project
}

interface State {
  pages?: Page[]
  inBulkEditMode?: boolean
}

export default class SettingPage extends React.Component<Props, State> {
  allPages: Page[]

  constructor(props: Props) {
    super(props)

    this.allPages = dataCache.projectPageMap.get(props.project._id)

    this.state = {
      pages: this.allPages.concat([{ _id: "new" }])
    }
  }

  render(): React.ReactElement {
    return (
      <>
        <Box className="mx-3 mt-4 tb-2" style={{ display: "flex", alignItems: "center" }}>
          <Typography className="flex-grow">Pages</Typography>
          <Button>Bulk Edit</Button>
        </Box>

        <Paper className="m-2 p-2">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell align="right" style={{ width: "67px" }}>
                  NO.
                </TableCell>
                <TableCell align="left">Path</TableCell>
                <TableCell align="left">Name</TableCell>
                <TableCell align="left">Folder</TableCell>
                <TableCell align="right" style={{ width: "150px" }}>
                  Desktop RId
                </TableCell>
                <TableCell align="right" style={{ width: "150px" }}>
                  Mobile RId
                </TableCell>
                <TableCell style={{ width: "50px" }}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.pages.map((page, index) => {
                return (
                  <TableRow key={page._id}>
                    <TableCell align="right">{page._id === "new" ? "new" : index + 1}</TableCell>
                    <TableCell align="left">
                      <input
                        id={"page-" + page._id + "-path"}
                        className="borderless w-100"
                        type="text"
                        defaultValue={page.path}
                        onBlur={this.onPagePropChanged}
                      />
                    </TableCell>
                    <TableCell align="left">
                      <input
                        id={"page-" + page._id + "-name"}
                        className="borderless w-100"
                        type="text"
                        defaultValue={page.name}
                        onBlur={this.onPagePropChanged}
                      />
                    </TableCell>
                    <TableCell align="left">
                      <input
                        id={"page-" + page._id + "-folder"}
                        className="borderless w-100"
                        type="text"
                        defaultValue={page.folder}
                        onBlur={this.onPagePropChanged}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <input
                        id={"page-" + page._id + "-desktopResultId"}
                        className="borderless w-100 text-right"
                        type="text"
                        defaultValue={page.desktopResultId}
                        onBlur={this.onPagePropChanged}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <input
                        id={"page-" + page._id + "-mobileResultId"}
                        className="borderless w-100 text-right"
                        type="text"
                        defaultValue={page.mobileResultId}
                        onBlur={this.onPagePropChanged}
                      />
                    </TableCell>
                    <TableCell align="right">
                      {page._id !== "new" && (
                        <IconButton size="small">
                          <Delete />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </Paper>
      </>
    )
  }

  private onPagePropChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    var arr = event.target.id.split("-")
    var pageId = arr[1]
    var prop = arr[2] as keyof Page
    var value = event.target.value.trim()

    if (event.target.defaultValue !== value) {
      if (pageId === "new") {
        ipcClient.createPage({
          [prop]: value,
          projectId: this.props.project._id
        } as Page)
      } else {
        ipcClient.updatePageProperty(dataCache.pageMap.get(pageId), prop, value)
      }
    }
  }
}
