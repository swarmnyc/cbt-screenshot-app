export declare type ObjectId = any

/** Client to Main channels */
export enum C2MChannel {
  CreatePage = "CreatePage",
  CreateProject = "CreateProject",
  DeletePage = "DeletePage",
  DeleteProject = "DeleteProject",
  Initialize = "Initialize",
  UpdatePageProperty = "UpdatePageProperty",
  UpdateProjectProperty = "UpdateProjectProperty",
}

/** Main to Client channels */
export enum M2CChannel {
  ChangeConnection = "ChangeConnection",
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
  projectId?: ObjectId | string
  name?: string
  path?: string
  folder?: string
  resultId?: number // TODO: remove it
  desktopResultId?: string
  mobileResultId?: string
}

export interface InitializeResult {
  projects?: Project[]
  pages?: Page[]
}

export type ActionFunc = () => void
