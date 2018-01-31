// Native
const path = require('path')

// Files
const listDirs = require('./listDirs')
const paths = require('./paths')

async function getProjects() {
  const projects = await listDirs(paths.projects)
  return projects.map(projectId => {
    const pkg = require(path.join(paths.projects, projectId, 'package.json'))
    return pkg.meta
  })
}

module.exports = getProjects
