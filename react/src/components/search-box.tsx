import React, { Component, ChangeEvent } from "react"
import SearchIcon from "@material-ui/icons/Search"
import InputBase from "@material-ui/core/InputBase"
import { debounce } from "debounce"

interface Props {
  value?: string
  onChanged(search: string): void
}

export default class SearchBox extends Component<Props> {
  debounceOnChanged: (search: string) => void

  constructor(props: Props) {
    super(props)

    this.debounceOnChanged = debounce(this.props.onChanged, 1000)
  }

  render() {
    return (
      <div className="search-box">
        <div className="search-box-icon">
          <SearchIcon color="inherit" />
        </div>
        <InputBase
          placeholder="Search…"
          classes={{
            root: "search-box-input-root",
            input: "search-box-input"
          }}
          onChange={this.onChanged}
          defaultValue={this.props.value}
        />
      </div>
    )
  }

  private onChanged = (event: ChangeEvent<HTMLInputElement>) => {
    this.debounceOnChanged(event.target.value)
  }
}
