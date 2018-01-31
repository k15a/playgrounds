// Packages
const fs = require('fs-extra')

// Files
const stringify = require('./stringify')
const paths = require('./paths')

async function read() {
  const configExists = await fs.pathExists(paths.config)

  if (configExists) {
    return require(paths.config)
  }

  return {}
}

async function write(data) {
  await fs.ensureDir(paths.playgrounds)
  await fs.writeFile(paths.config, stringify(data))
  return data
}

async function update(updates) {
  const config = await read()
  return await write({
    ...config,
    ...updates,
  })
}

async function get(key) {
  const config = await read()
  return config[key]
}

async function set(key, value) {
  await update({
    [key]: value,
  })
  return value
}

module.exports = {
  read,
  write,
  update,
  get,
  set,
}
