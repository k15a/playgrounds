class WatchMissingNodeModulesPlugin {
  constructor(nodeModulesPath) {
    this.nodeModulesPath = nodeModulesPath
  }

  apply(compiler) {
    compiler.plugin('emit', (compilation, callback) => {
      const isNodeModule = compilation.missingDependencies.some(
        file => file.indexOf(this.nodeModulesPath) !== -1,
      )

      if (isNodeModule) {
        compilation.contextDependencies.push(this.nodeModulesPath)
      }

      return callback()
    })
  }
}

module.exports = WatchMissingNodeModulesPlugin
