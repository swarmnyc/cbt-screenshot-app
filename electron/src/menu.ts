import { Menu, MenuItem, BrowserWindow, MenuItemConstructorOptions } from "electron"
import { ConnChannels } from "cbt-screenshot-common"

var isMac = process.platform == "darwin"

const template: (MenuItemConstructorOptions | MenuItem)[] = [
  {
    label: "File",
    submenu: [
      {
        label: "Change Connection",
        click(menuItem: MenuItem, currentWindow: BrowserWindow) {
          currentWindow.webContents.send(ConnChannels.ChangeConnection)
        }
      },
      {
        label: "Settings",
        click(menuItem: MenuItem, currentWindow: BrowserWindow) {
          currentWindow.webContents.send(ConnChannels.OpenSettings)
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
    submenu: [{ role: "reload" }, { role: "forcereload" }, { role: "toggledevtools" }]
  }
]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)
