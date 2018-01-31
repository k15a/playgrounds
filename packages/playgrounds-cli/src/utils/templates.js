// Packages
const fs = require('fs-extra')

// Files
const listDirs = require('./listDirs')
const paths = require('./paths')

async function getDefault() {
  return await listDirs(paths.defaultTemplates)
}

async function getCustom() {
  await fs.ensureDir(paths.customTemplates)
  return await listDirs(paths.customTemplates)
}

module.exports = {
  getDefault,
  getCustom,
}
