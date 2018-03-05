// Native
const path = require('path')

// Packages
const fs = require('fs-extra')
const MemoryFS = require('memory-fs')
const webpack = require('webpack')
const mime = require('mime')
const debug = require('debug')('@playgrounds/server::WebpackMiddleware')

// Files
const Compiler = require('./Compiler')
const PackageInstallPlugin = require('./PackageInstallPlugin')
const WatchMissingNodeModulesPlugin = require('./WatchMissingNodeModulesPlugin')

function WebpackMiddleware({ projectDir, sourceDir, installer }) {
  debug('Creating webpack middleware')
  const compilers = new Map()

  debug('Creating file system')
  const memoryFS = new MemoryFS()

  function getCompiler(request, filePath) {
    if (compilers.has(request.path)) {
      debug(`Compiler for "${request.path}" already exists`)
      return compilers.get(request.path)
    }

    debug(`Creating compiler for "${request.path}"`)
    const compiler = new Compiler(memoryFS, {
      mode: 'development',
      context: sourceDir,
      entry: [path.join(__dirname, 'hotClient.js'), filePath],
      output: {
        path: path.dirname(request.path),
        filename: path.basename(request.path),
        devtoolModuleFilenameTemplate: info =>
          path
            .relative(sourceDir, info.absoluteResourcePath)
            .replace(/\\/g, '/'),
      },
      module: {
        rules: [
          {
            oneOf: [
              {
                test: /\.css$/,
                use: [
                  require.resolve('style-loader'),
                  require.resolve('css-loader'),
                ],
              },

              {
                test: /\.(js|ts|tsx)$/,
                include: sourceDir,
                loader: require.resolve('@playgrounds/babel-loader'),
                options: {
                  sourceDir,
                },
              },

              {
                exclude: [/\.js$/, /\.html$/, /\.json$/],
                loader: require.resolve('@playgrounds/path-loader'),
                options: {
                  sourceDir,
                },
              },
            ],
          },
        ],
      },
      plugins: [
        new PackageInstallPlugin(installer),
        new WatchMissingNodeModulesPlugin(
          path.join(projectDir, 'node_modules'),
        ),

        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
          'process.env.HOT_PATH': JSON.stringify(`${request.path}?hot=true`),
        }),
      ],
    })

    compiler.onClose(() => {
      debug(`Removing compiler for "${request.path}"`)
      compilers.delete(request.path)
    })

    compilers.set(request.path, compiler)
    return compiler
  }

  return async function handler(request, response, next) {
    const filePath = path.join(sourceDir, request.path)

    debug(`Handling "${request.path}"`)
    if (request.method !== 'GET') {
      debug(`"${request.path}" is not a GET request`)
      return next()
    }

    if (/\.hot-update/.test(request.path)) {
      try {
        return sendFile(memoryFS, request, response)
      } catch (error) {
        // continue
      }
    }

    if (/\.(js|css)$/.test(request.path)) {
      if (!await fileExists(filePath)) {
        debug(`"${filePath}" does not exist`)
        return next()
      }

      debug(`"${filePath}" exists`)

      const compiler = getCompiler(request, filePath)

      if (request.query.hot) {
        return handleHotRequest({
          sourceDir,
          compiler,
          request,
          response,
        })
      }

      return compiler.getStats(() => {
        try {
          return sendFile(memoryFS, request, response)
        } catch (error) {
          debug(`Webpack result "${request.path}" is not a file`)
          return next()
        }
      })
    }

    debug(`Cannot handle "${request.path}"`)
    return next()
  }
}

function handleHotRequest({ sourceDir, compiler, request, response }) {
  debug(`Sending hot updates to "${request.path}"`)

  response.set('Content-Type', 'text/event-stream')
  response.set('Cache-Control', 'no-cache')
  response.set('Connection', 'keep-alive')

  response.write('\n')

  const unsubscribe = compiler.watchStats(webpackStats => {
    const stats = webpackStats.toJson({
      context: sourceDir,
      errorDetails: false,
    })

    debug(`Sending updates "${stats.hash}" to ${request.path}`)

    const payload = JSON.stringify({
      type: 'HOT_UPDATE',
      time: stats.time,
      hash: stats.hash,
      warnings: stats.warnings || [],
      errors: stats.errors || [],
      modules: createModuleMap(stats.modules),
    })

    response.write(`data: ${payload}\n\n`)
  })

  const heartbeat = setInterval(() => {
    debug(`Sending heartbeat to "${request.path}"`)
    response.write('data: ❤️\n\n')
  }, 10000)

  request.on('close', () => {
    debug(`Stopping hot updates to "${request.path}"`)
    unsubscribe()
    clearInterval(heartbeat)
  })
}

function sendFile(memoryFS, request, response) {
  if (memoryFS.statSync(request.path).isFile()) {
    const file = memoryFS.readFileSync(request.path, 'utf-8')

    response.set('Content-Type', mime.getType(request.path))
    response.set('Content-Length', file.length)

    return response.send(file)
  }

  throw new Error('Not a file.')
}

async function fileExists(filePath) {
  if (await fs.exists(filePath)) {
    const stats = await fs.lstat(filePath)
    return stats.isFile()
  }

  return false
}

function createModuleMap(modules) {
  const result = {}

  for (const { id, name } of modules) {
    result[id] = name
  }

  return result
}

module.exports = WebpackMiddleware
