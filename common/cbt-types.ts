import { Page } from "./types"

export interface PageView extends Page {
  screenshot?: CbtScreenshot
}

export interface CbtScreenshot {
  screenshot_test_id: number
  url: string
  created_date: Date
  version_count: number
  versions: CbtScreenshotVersion[]
}

export interface CbtScreenshotVersion {
  tunnel_id: number
  version_id: number
  start_date: Date
  version_hash: string
  description: string
  tags: string[]
  result_count: CbtScreenshotVersionResultCount
  active: boolean
  show_results_web_url: string
  show_results_public_url: string
  show_comparisons_web_url: string
  show_comparisons_public_url: string
  download_results_zip_url: string
  download_results_zip_public_url: string
  results: CbtScreenshotVersionResult[]
  lighthouse_html: string
  lighthouse_json: string
}

export interface CbtScreenshotVersionResultCount {
  total: number
  running: number
  successful: number
  failed: number
  cancelled: number
}

export interface CbtScreenshotVersionResult {
  finish_date: Date
  wss_vnc_url: string
  flagged: number
  flagged_reason: null
  flagged_details: null
  result_hash: string
  captured_dom: boolean
  applitools_session_id: null
  applitools_access_token: null
  description: null
  tags: any[]
  state: string
  successful: boolean
  resolution: CbtResolution
  result_id: number
  initialized_date: Date
  start_date: Date
  os: CbtOS
  browser: CbtBrowser
  images: CbtAnnotations
  thumbs: CbtAnnotations
  launch_live_test_url: string
  page_source: string
  dom_source: string
  show_result_web_url: string
  show_result_public_url: string
  annotations: CbtAnnotations
}

export interface CbtAnnotations {
  windowed: null | string
  fullpage: null | string
  chromeless: null | string
  hash?: string
}

export interface CbtBrowser {
  name: string
  type: string
  version: string
  api_name: string
  icon_class: string
  requested_api_name: string
}

export interface CbtOS {
  name: string
  type: string
  version: string
  api_name: string
  device: string
  device_type: null | string
  icon_class: string
  configuration_sort_order: number
  requested_api_name: string
}

export interface CbtResolution {
  width: number
  height: number
  desktop_width: number
  desktop_height: number
  name: string
  requested_name: string
}
