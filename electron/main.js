const { app } = require('electron')
const createWindow = require('./win')

app.on('ready', () => {
  logVersions()
  createWindow()
})

function logVersions() {
  const log = console.log

  log('-------------------------------------')
  log('Node version: ', process.versions.node)
  log('Electron version: ', process.versions.electron)
  log('Chrome version: ', process.versions.chrome)
  log('-------------------------------------')
}
