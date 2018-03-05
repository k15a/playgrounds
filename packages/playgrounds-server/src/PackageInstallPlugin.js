class PackageInstallPlugin {
  constructor(installer) {
    this.compiler = null
    this.resolving = new Set()
    this.installer = installer
  }

  apply(compiler) {
    this.compiler = compiler

    compiler.hooks.afterResolvers.tap(
      'PackageInstallPlugin',
      afterResolversCompiler => {
        afterResolversCompiler.resolverFactory.hooks.resolver.tap(
          'normal',
          'PackageInstallPlugin',
          resolver => {
            resolver.hooks.module.tapPromise(
              'PackageInstallPlugin',
              this.resolveModule.bind(this),
            )
          },
        )
      },
    )
  }

  async install(request) {
    const dependency = await this.installer.check(request)

    if (dependency) {
      await this.installer.install(dependency)
    }
  }

  async resolve(result) {
    return await new Promise((resolve, reject) => {
      this.compiler.resolverFactory
        .get('normal', this.compiler.options.resolver)
        .resolve(
          result.context,
          result.path,
          result.request,
          {},
          (error, filepath) => (error ? reject(error) : resolve(filepath)),
        )
    })
  }

  async resolveModule(result) {
    // Only install direct dependencies
    if (/node_modules/.test(result.path)) {
      return null
    }

    // Only handle a module once to avoid recursion when we use this.resolve
    if (this.resolving.has(result.request)) {
      return null
    }

    this.resolving.add(result.request)

    try {
      await this.resolve(result)
    } catch (error) {
      const matches = /Can't resolve '([@./-\w]+)' in/.exec(error)
      if (matches) {
        await this.install(matches[1])
      }
    }

    this.resolving.delete(result.request)
  }
}

module.exports = PackageInstallPlugin
