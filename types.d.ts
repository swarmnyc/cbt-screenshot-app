import { AllElectron } from "electron"

declare global {
  interface Window {
    electron: AllElectron
  }
}
