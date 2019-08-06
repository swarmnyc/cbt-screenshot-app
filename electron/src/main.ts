import { app } from "electron"
import { createWindow } from "./window"
import "./menu"

app.on("ready", () => {
  createWindow()
})
