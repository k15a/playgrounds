// Native
const os = require('os')
const path = require('path')

const playgrounds = path.join(os.homedir(), '.playgrounds')
const projects = path.join(playgrounds, 'projects')
const config = path.join(playgrounds, 'config.json')
const defaultTemplates = path.join(__dirname, '../../templates')
const customTemplates = path.join(playgrounds, 'templates')

module.exports = {
  playgrounds,
  projects,
  config,
  defaultTemplates,
  customTemplates,
}
