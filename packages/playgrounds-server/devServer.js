// Native
const path = require('path')

// Files
const server = require('./src/server')

const projectDir = path.join(__dirname, 'development')
const sourceDir = path.join(projectDir, 'src')

server({
  projectDir,
  sourceDir,
}).then(port => {
  console.log(`Server listening at http://localhost:${port}`)
})
