import { AllElectron } from "electron"

declare global {
  interface Window {
    electron: AllElectron
  }

  interface HTMLWebViewElement {
    executeJavaScript(code: string): void
    getURL(): string
  }
}
