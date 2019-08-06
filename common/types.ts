declare type ObjectId = any

export enum ConnChannels {
  Initialize = "Initialize",
  InitializeCallback = "InitializeCallback",
  OpenSettings = "OpenSettings"
}

export interface Project {
  id: string
  name: string
  config: Config
  pages: Page[]
}

export interface Project {
  _id: ObjectId
  name: string
  domain: string
  authName: string
  authKey: string
  desktopBrowsers: string[]
  mobileBrowsers: string[]
}

export interface Config {
  username: string
  password: string
  browsers: string[]
}

export interface Page {
  name: string
  url: string
  resultUrl?: string
  resultId?: number
  resultVersionId?: number
}
