class WatchMissingNodeModulesPlugin {
  constructor(nodeModulesPath) {
    this.nodeModulesPath = nodeModulesPath
  }

  apply(compiler) {
    compiler.hooks.emit.tap('WatchMissingNodeModulesPlugin', compilation => {
      const missingDependencies = Array.from(compilation.missingDependencies)

      const isNodeModule = missingDependencies.some(file =>
        file.includes(this.nodeModulesPath),
      )

      if (isNodeModule) {
        compilation.contextDependencies.add(this.nodeModulesPath)
      }
    })
  }
}

module.exports = WatchMissingNodeModulesPlugin
