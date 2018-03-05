// Native
const path = require('path')

// Files
const server = require('./src/server')

const projectDir = path.join(__dirname, 'development')
const sourceDir = path.join(projectDir, 'src')

function handleError(error) {
  console.log(error)
  process.exit(1)
}

process.on('unhandledRejection', handleError)
process.on('uncaughtException', handleError)

server({
  projectDir,
  sourceDir,
}).then(port => {
  console.log(`Server listening at http://localhost:${port}`)
})
