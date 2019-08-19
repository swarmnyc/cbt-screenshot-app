import { Menu, MenuItem, BrowserWindow, MenuItemConstructorOptions, remote, dialog, app } from "electron"
import { M2CChannel } from "cbt-screenshot-common"

var isMac = process.platform == "darwin"

const template: (MenuItemConstructorOptions | MenuItem)[] = [
  {
    label: "File",
    submenu: [
      {
        label: "Open Settings",
        click(_: MenuItem, currentWindow: BrowserWindow) {
          currentWindow.webContents.send(M2CChannel.OpenSettings)
        }
      },
      {
        label: "Open Tasks",
        click(_: MenuItem, currentWindow: BrowserWindow) {
          currentWindow.webContents.send(M2CChannel.OpenTasks)
        }
      },
      { type: "separator" },
      {
        label: "Change Connection",
        click(_: MenuItem, currentWindow: BrowserWindow) {
          currentWindow.webContents.send(M2CChannel.ChangeConnection)
        }
      },
      { type: "separator" },
      isMac ? { role: "close" } : { role: "quit" }
    ]
  },
  {
    label: "Edit",
    submenu: [
      { role: "undo" },
      { role: "redo" },
      { type: "separator" },
      { role: "cut" },
      { role: "copy" },
      { role: "paste" },
      { role: "delete" },
      { role: "selectall" }
    ]
  },
  {
    label: "View",
    submenu: [{ role: "reload" }, { role: "forcereload" }]
  },
  {
    label: "Help",
    submenu: [
      { role: "toggledevtools" },
      { type: "separator" },
      {
        label: "About",
        click() {
          dialog.showMessageBox({
            title: `About`,
            message: `CBT Screenshot App (v${app.getVersion()})`,
            detail: `Created by SWARM`
          })
        }
      }
    ]
  }
]

export function createMenu() {
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}
