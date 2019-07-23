const url = require('url')
const { BrowserWindow } = require('electron')

let mainWindow = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    show: false
  })

  mainWindow.loadURL(
    process.env.NODE_ENV === 'development'
      ? url.format('http://localhost:3000')
      : url.format({
          pathname: __dirname + '/../build/index.html',
          protocol: 'file:'
        })
  )

  if (process.env.NODE_ENV === 'development') {
    

    mainWindow.webContents.openDevTools()
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })
}

module.exports = createWindow
