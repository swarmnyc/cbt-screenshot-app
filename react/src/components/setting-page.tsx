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
  Typography,
  Checkbox
} from "@material-ui/core"
import { Delete } from "@material-ui/icons"
import { ObjectId } from "bson"
import { Page, Project } from "cbt-screenshot-common"
import Noty from "noty"
import React from "react"
import dataCache from "services/data-cache"
import ipcClient from "services/ipc-client"
import { showErrorMessage } from "utils/error-display"
import SearchBox from "./search-box"

interface SelectablePage extends Page {
  isSelected?: boolean
}

interface Props {
  project: Project
}

interface State {
  pages?: SelectablePage[]
  selectedPages: number
  isPartialSelected?: boolean
  isAllSelected?: boolean
  bulkEditMode?: boolean
}

export default class SettingPage extends React.Component<Props, State> {
  bulkEditCsv: string
  newPage: Page
  searchStr: string

  constructor(props: Props) {
    super(props)

    this.state = {
      pages: this.getPages(true),
      selectedPages: 0,
      isPartialSelected: false,
      isAllSelected: false
    }
  }

  render(): React.ReactElement {
    var { bulkEditMode } = this.state

    return (
      <>
        <Box className="mx-3 mt-4 tb-2" style={{ display: "flex", alignItems: "center" }}>
          <Typography variant="h5" className="flex-grow">
            Pages
          </Typography>

          {!bulkEditMode && (
            <>
              <SearchBox onChanged={this.search} value={this.searchStr} />
              <Button
                variant="outlined"
                className="ml-2"
                onClick={() => {
                  this.setState({ bulkEditMode: true })
                }}
              >
                Bulk Edit
              </Button>
            </>
          )}
        </Box>
        <Paper className="m-2 p-2">{bulkEditMode ? this.renderBulkEditMode() : this.renderNormalMode()}</Paper>
      </>
    )
  }

  renderNormalMode(): React.ReactElement {
    var { pages, selectedPages, isPartialSelected, isAllSelected } = this.state

    return (
      <>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox indeterminate={isPartialSelected} checked={isAllSelected} onChange={this.handleSelectAll} />
              </TableCell>
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
            {pages.map((page, index) => {
              return (
                <TableRow key={page._id}>
                  <TableCell padding="checkbox">
                    {page !== this.newPage && (
                      <Checkbox
                        key={page._id + "-select-" + (page.isSelected ? "1" : "0")}
                        checked={page.isSelected}
                        onChange={() => this.handleSelect(page)}
                      />
                    )}
                  </TableCell>
                  <TableCell align="right">{page === this.newPage ? "new" : index + 1}</TableCell>
                  <TableCell align="left">
                    <input
                      id={"page-" + page._id + "-path"}
                      className="borderless w-100"
                      type="text"
                      defaultValue={page.path}
                      onBlur={this.changePageProp}
                    />
                  </TableCell>
                  <TableCell align="left">
                    <input
                      id={"page-" + page._id + "-name"}
                      className="borderless w-100"
                      type="text"
                      defaultValue={page.name}
                      onBlur={this.changePageProp}
                    />
                  </TableCell>
                  <TableCell align="left">
                    <input
                      id={"page-" + page._id + "-folder"}
                      className="borderless w-100"
                      type="text"
                      defaultValue={page.folder}
                      onBlur={this.changePageProp}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <input
                      id={"page-" + page._id + "-desktopResultId"}
                      className="borderless w-100 text-right"
                      type="text"
                      defaultValue={page.desktopResultId}
                      onBlur={this.changePageProp}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <input
                      id={"page-" + page._id + "-mobileResultId"}
                      className="borderless w-100 text-right"
                      type="text"
                      defaultValue={page.mobileResultId}
                      onBlur={this.changePageProp}
                    />
                  </TableCell>
                  <TableCell align="right">
                    {page !== this.newPage && (
                      <IconButton id={"page-" + page._id + "-delete"} size="small" onClick={this.deletePage}>
                        <Delete />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
        <Box className="mt-3">
          <Button variant="contained" color="primary" onClick={this.takeScreenShots} disabled={selectedPages === 0}>
            Take Screenshots ({selectedPages} pages)
          </Button>
        </Box>
      </>
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
          <Button variant="contained" color="primary" className="mr-2" onClick={this.save}>
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

  private search = (search: string) => {
    this.searchStr = search.toLowerCase()

    this.setState({ pages: this.getPages(false), isAllSelected: false, isPartialSelected: false })
  }

  private save = () => {
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

  private takeScreenShots = () => {
    var pageIds = this.state.pages.filter(p => p !== this.newPage && p.isSelected).map(p => p._id)

    ipcClient
      .newTasks(this.props.project, pageIds)
      .then(() => {
        new Noty({
          theme: "nest",
          type: "success",
          layout: "topRight",
          timeout: 2000,
          text: `Tasks Created`
        }).show()

        this.setState({
          pages: this.getPages(false),
          selectedPages: 0,
          isPartialSelected: false,
          isAllSelected: false
        })
      })
      .catch(showErrorMessage)
  }

  private changePageProp = (event: React.ChangeEvent<HTMLInputElement>) => {
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

  private deletePage = (event: React.MouseEvent<HTMLButtonElement>) => {
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

  private getPages = (newPage: boolean): SelectablePage[] => {
    var pages: SelectablePage[] = dataCache.projectPageMap.get(this.props.project._id)

    pages.forEach(p => {
      p.isSelected = false
    })

    if (this.searchStr) {
      pages = pages.filter(p => {
        var target = `${p.path}|${p.name}`.toLowerCase()
        return target.includes(this.searchStr)
      })
    }

    if (newPage) {
      this.newPage = { _id: new ObjectId().toHexString(), projectId: this.props.project._id }
    }

    return pages.concat([this.newPage])
  }

  private handleSelectAll = () => {
    var pages = this.state.pages
    var numSelected = pages.filter(page => page.isSelected).length
    var isSelected = numSelected === 0

    pages.forEach(page => {
      page.isSelected = isSelected
    })

    this.setState({
      pages,
      selectedPages: isSelected ? pages.length : 0,
      isPartialSelected: false,
      isAllSelected: isSelected
    })
  }

  private handleSelect = (page: SelectablePage) => {
    page.isSelected = !page.isSelected

    var numSelected = this.state.pages.filter(d => d.isSelected).length
    var rowCount = this.state.pages.length

    this.setState({
      selectedPages: numSelected,
      isPartialSelected: numSelected > 0 && numSelected < rowCount,
      isAllSelected: numSelected === rowCount
    })
  }
}
