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
  TextField,
  Typography
} from "@material-ui/core"
import { Delete } from "@material-ui/icons"
import { ObjectId } from "bson"
import { Page, Project } from "cbt-screenshot-common"
import Noty from "noty"
import React from "react"
import dataCache from "services/data-cache"
import ipcClient from "services/ipc-client"
import { showErrorMessage } from "utils/error-display"

interface Props {
  project: Project
}

interface State {
  pages?: Page[]
  bulkEditMode?: boolean
}

export default class SettingPage extends React.Component<Props, State> {
  bulkEditCsv: string
  newPage: Page
  query: string

  constructor(props: Props) {
    super(props)

    this.state = {
      pages: this.getPages(true)
    }
  }

  render(): React.ReactElement {
    var { bulkEditMode } = this.state

    return (
      <>
        <Box className="mx-3 mt-4 tb-2" style={{ display: "flex", alignItems: "center" }}>
          <Typography className="flex-grow">Pages</Typography>

          {!bulkEditMode && (
            <Button
              onClick={() => {
                this.setState({ bulkEditMode: true })
              }}
            >
              Bulk Edit
            </Button>
          )}
        </Box>
        <Paper className="m-2 p-2">{bulkEditMode ? this.renderBulkEditMode() : this.renderNormalMode()}</Paper>
      </>
    )
  }

  renderNormalMode(): React.ReactElement {
    return (
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
                <TableCell align="right">{page === this.newPage ? "new" : index + 1}</TableCell>
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
                  {page !== this.newPage && (
                    <IconButton id={"page-" + page._id + "-delete"} size="small" onClick={this.onDeletePage}>
                      <Delete />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    )
  }

  renderBulkEditMode(): React.ReactElement {
    var { pages } = this.state
    var data = ""
    pages.forEach(p => {
      if (p === this.newPage) return

      data += `${p.path}, ${p.name || ""}, ${p.folder || ""}, ${p.desktopResultId || ""}, ${p.mobileResultId || ""}\n`
    })

    return (
      <>
        <TextField
          multiline
          fullWidth
          rows={20}
          variant="outlined"
          defaultValue={data}
          onBlur={e => (this.bulkEditCsv = e.target.value)}
        />

        <Typography variant="body2" className="my-3">
          This is csv format a line is a page, a page has 5 properties [0]=path, [1]=name, [2]=folder, [3]=Desktop
          ResultId, [4]=Mobile ResultId and use comma as the separator. <br />
          When saving, the action won't delete any pages, if the path of each lines match the path in database, it
          executes update, otherwise, it executes insert
        </Typography>

        <Box>
          <Button variant="contained" color="primary" className="mr-2" onClick={this.onSave}>
            Save
          </Button>

          <Button
            variant="contained"
            onClick={() => {
              this.setState({ bulkEditMode: false })
            }}
          >
            Cancel
          </Button>
        </Box>
      </>
    )
  }

  private onSave = () => {
    ipcClient
      .bulkPageEdit(this.props.project, this.bulkEditCsv)
      .then(result => {
        new Noty({
          theme: "nest",
          type: "success",
          layout: "topRight",
          timeout: 2000,
          text: `Saved(insert: ${result[0]}, update: ${result[1]})`
        }).show()

        this.setState({ bulkEditMode: false, pages: this.getPages(false) })
      })
      .catch(showErrorMessage)
  }

  private onPagePropChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    var arr = event.target.id.split("-")
    var pageId = arr[1]
    var prop = arr[2] as keyof Page
    var value = event.target.value.trim()

    if (event.target.defaultValue !== value) {
      if (pageId === this.newPage._id) {
        this.newPage[prop] = value
        ipcClient.createPage(this.newPage).then(() => {
          this.setState({ pages: this.getPages(true) })
        })
      } else {
        ipcClient.updatePageProperty(dataCache.pageMap.get(pageId), prop, value)
      }
    }
  }

  private onDeletePage = (event: React.MouseEvent<HTMLButtonElement>) => {
    var arr = event.currentTarget.id.split("-")
    var pageId = arr[1]
    ipcClient.deletePage(dataCache.pageMap.get(pageId)).then(() => {
      new Noty({
        theme: "nest",
        type: "success",
        layout: "topRight",
        timeout: 2000,
        text: "Deleted"
      }).show()

      this.setState({ pages: this.getPages(false) })
    })
  }

  private getPages(newPage: boolean): Page[] {
    var pages = dataCache.projectPageMap.get(this.props.project._id)

    if (this.query) {
      pages = pages.filter(p => p.path.includes(this.query.toLowerCase()))
    }

    if (newPage) {
      this.newPage = { _id: new ObjectId().toHexString(), projectId: this.props.project._id }
    }

    return pages.concat([this.newPage])
  }
}
