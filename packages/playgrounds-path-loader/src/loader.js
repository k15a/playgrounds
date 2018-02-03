// Native
const path = require('path')

// Packages
const loaderUtils = require('loader-utils')

function loader() {
  const options = loaderUtils.getOptions(this)
  const importPath = path.relative(options.sourceDir, this.resourcePath)
  return `export default ${JSON.stringify(importPath)}`
}

module.exports = loader
