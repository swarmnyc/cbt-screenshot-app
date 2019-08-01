export interface Project {
  id: string
  name: string
  config: Config
  pages: Page[]
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
