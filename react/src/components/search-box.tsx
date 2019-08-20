import React, { Component, ChangeEvent } from "react"
import SearchIcon from "@material-ui/icons/Search"
import CancelIcon from "@material-ui/icons/Clear"
import InputBase from "@material-ui/core/InputBase"
import { debounce } from "debounce"
import { IconButton } from "@material-ui/core"

interface Props {
  className?: string
  value?: string
  onChanged(search: string): void
}

interface State {
  value: string
}

export default class SearchBox extends Component<Props, State> {
  debounceOnChanged: (search: string) => void

  constructor(props: Props) {
    super(props)

    this.debounceOnChanged = debounce(this.props.onChanged, 1000)
    this.state = { value: this.props.value || "" }
  }

  render() {
    var { value } = this.state
    return (
      <div key="search-box" className={"search-box " + this.props.className || ""}>
        <div className="search-box-search-icon">
          <SearchIcon color="inherit" />
        </div>
        <InputBase
          placeholder="Search…"
          classes={{
            root: "search-box-input-root",
            input: "search-box-input"
          }}
          onChange={this.onChanged}
          value={value}
        />
        {value && (
          <IconButton className="search-box-cancel-icon" onClick={this.cancel}>
            <CancelIcon color="inherit" />
          </IconButton>
        )}
      </div>
    )
  }

  private onChanged = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({ value: event.target.value })
    this.debounceOnChanged(event.target.value)
  }

  private cancel = () => {
    this.setState({ value: "" })
    this.debounceOnChanged("")
  }
}
