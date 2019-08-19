export declare type ObjectId = any

/** Client to Main channels */
export enum C2MChannel {
  Initialize = "Initialize",

  CreateProject = "CreateProject",
  DeleteProject = "DeleteProject",
  UpdateProjectProperty = "UpdateProjectProperty",

  BulkEditPages = "BulkEditPages",
  CreatePage = "CreatePage",
  DeletePage = "DeletePage",
  UpdatePageProperty = "UpdatePageProperty",

  ArchiveErrorTask = "ArchiveErrorTask",
  GetTasks = "GetTasks",
  NewTasks = "NewTasks",
  CancelTask = "CancelTask",
}

/** Main to Client channels */
export enum M2CChannel {
  ChangeConnection = "ChangeConnection",
  OpenSettings = "OpenSettings",
  OpenTasks = "OpenTasks"
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

export interface AwsConfig {
  awsKey?: string
  awsKeySecret?: string
  awsRegion?: string
}

export interface Project extends AwsConfig {
  _id?: ObjectId | string
  name?: string
  domain?: string
  authName?: string
  authPassword?: string
  authKey?: string
  desktopBrowsers?: string[]
  mobileBrowsers?: string[]
}

export interface Page {
  _id?: ObjectId | string
  projectId?: ObjectId | string
  name?: string
  path?: string
  folder?: string
  desktopResultId?: string
  mobileResultId?: string
}

export interface Task {
  _id?: ObjectId | string
  projectId?: ObjectId | string
  pageId?: ObjectId | string
  state?: TaskState
  type?: TaskType
  createdAt?: Date
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
  Error = "Error",
  ErrorArchived = "ErrorArchived"
}

export enum TaskType {
  Desktop = "Desktop",
  Mobile = "Mobile"
}

export type ActionFunc = () => void
