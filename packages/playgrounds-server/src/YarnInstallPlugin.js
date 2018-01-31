class YarnInstallPlugin {
  constructor(installer) {
    this.compiler = null
    this.resolving = new Set()
    this.installer = installer
  }

  apply(compiler) {
    this.compiler = compiler

    compiler.plugin('after-resolvers', afterResolversCompiler => {
      afterResolversCompiler.resolvers.normal.plugin(
        'module',
        this.resolveModule.bind(this),
      )
    })
  }

  async install(request) {
    const dependency = await this.installer.check(request)

    if (dependency) {
      await this.installer.install(dependency)
    }
  }

  async resolve(result) {
    return await new Promise((resolve, reject) => {
      this.compiler.resolvers.normal.resolve(
        result.context,
        result.path,
        result.request,
        (error, filepath) => (error ? reject(error) : resolve(filepath)),
      )
    })
  }

  async resolveModule(result, next) {
    // Only install direct dependencies
    if (/node_modules/.test(result.path)) {
      return next()
    }

    // Only handle a module once to avoid recursion when we use this.resolve
    if (this.resolving.has(result.request)) {
      return next()
    }

    this.resolving.add(result.request)

    try {
      await this.resolve(result)
    } catch (error) {
      const matches = /Can't resolve '([@./-\w]+)' in/.exec(error)
      await this.install(matches ? matches[1] : null)
    }

    this.resolving.delete(result.request)

    return next()
  }
}

module.exports = YarnInstallPlugin
