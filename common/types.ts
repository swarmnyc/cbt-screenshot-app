export declare type ObjectId = any

export enum ConnChannels {
  Initialize = "Initialize",
  InitializeCallback = "InitializeCallback",
  OpenSettings = "OpenSettings"
}

export enum LoadStatus {
  Loading,
  Loaded,
  Error
}

export enum InitStatus {
  initializing,
  initialized,
  error
}

export interface Project {
  _id: ObjectId | string
  name: string
  domain: string
  authName: string
  authKey: string
  desktopBrowsers: string[]
  mobileBrowsers: string[]
}

export interface Page {
  _id: ObjectId | string
  projectId: ObjectId | string
  name: string
  path: string
  folder?: string
  resultId?: number
}

export interface InitializeResult {
  projects?: Project[]
  pages?: Page[]
  error?: unknown
}
