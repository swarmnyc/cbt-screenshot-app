export declare type ObjectId = any

/** Client to Main channels */
export enum C2MChannel {
  BulkEditPages = "BulkEditPages",
  CreatePage = "CreatePage",
  CreateProject = "CreateProject",
  DeletePage = "DeletePage",
  DeleteProject = "DeleteProject",
  Initialize = "Initialize",
  UpdatePageProperty = "UpdatePageProperty",
  UpdateProjectProperty = "UpdateProjectProperty"
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
  authPassword: string
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
  desktopResultId?: string
  mobileResultId?: string
}

export interface Task {
  _id: ObjectId | string
  projectId: ObjectId | string
  pageId: ObjectId | string
  state: TaskState
  type: TaskType
  createdAt: Date
  executedAt?: Date
  finishedAt?: Date
}

export interface InitializeResult {
  projects?: Project[]
  pages?: Page[]
}

export enum TaskState {
  Pending = "Pending",
  Executing = "Executing",
  Executed = "Executed",
  Canceled = "Canceled",
  Error = "Error"
}

export enum TaskType {
  Desktop = "Desktop",
  Mobile = "Mobile"
}

export type ActionFunc = () => void
