const { Menu, isMac } = require("electron")

const template = [
  {
    label: "File",
    submenu: [
      {
        label: "Settings",
        click(menuItem, currentWindow) {
          currentWindow.webContents.send("goToSettings")
        }
      },
      { type: "separator" },
      isMac ? { role: "close" } : { role: "quit" }
    ]
  },
  {
    label: "View",
    submenu: [{ role: "reload" }, { role: "forcereload" }, { role: "toggledevtools" }]
  }
]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)
