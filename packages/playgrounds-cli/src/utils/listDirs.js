// Native
const path = require('path')

// Packages
const fs = require('fs-extra')

async function listDirs(source) {
  const files = await fs.readdir(source)
  return files.filter(file =>
    fs.lstatSync(path.join(source, file)).isDirectory(),
  )
}

module.exports = listDirs
