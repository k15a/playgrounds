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
const YarnInstallPlugin = require('./YarnInstallPlugin')
const WatchMissingNodeModulesPlugin = require('./WatchMissingNodeModulesPlugin')

function WebpackMiddleware({ projectDir, sourceDir, installer }) {
  debug('Creating webpack middleware')
  const compilers = new Map()

  debug('Creating file system')
  const memoryFS = new MemoryFS()

  function getCompiler(req, filePath) {
    if (compilers.has(req.path)) {
      debug(`Compiler for "${req.path}" already exists`)
      return compilers.get(req.path)
    }

    debug(`Creating compiler for "${req.path}"`)
    const compiler = new Compiler(memoryFS, {
      entry: [path.join(__dirname, 'hotClient.js'), filePath],
      output: {
        path: path.dirname(req.path),
        filename: path.basename(req.path),
      },
      module: {
        rules: [
          {
            test: /\.css$/,
            use: [
              require.resolve('style-loader'),
              require.resolve('css-loader'),
            ],
          },
          {
            test: /\.(js|ts|tsx)/,
            include: sourceDir,
            use: require.resolve('@playgrounds/babel-loader'),
          },
        ],
      },
      plugins: [
        new YarnInstallPlugin(installer),
        new WatchMissingNodeModulesPlugin(
          path.join(projectDir, 'node_modules'),
        ),

        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
          'process.env.HOT_PATH': JSON.stringify(`${req.path}?hot=true`),
        }),
      ],
    })

    compiler.onClose(() => {
      debug(`Removing compiler for "${req.path}"`)
      compilers.delete(req.path)
    })

    compilers.set(req.path, compiler)
    return compiler
  }

  return async function handler(req, res, next) {
    const filePath = path.join(sourceDir, req.path)

    debug(`Handling "${req.path}"`)
    if (req.method !== 'GET') {
      debug(`"${req.path}" is not a GET request`)
      return next()
    }

    if (/\.hot-update/.test(req.path)) {
      try {
        return sendFile(memoryFS, req, res)
      } catch (error) {
        // continue
      }
    }

    if (/\.(js|css)$/.test(req.path)) {
      if (!await fileExists(filePath)) {
        debug(`"${filePath}" does not exist`)
        return next()
      }

      debug(`"${filePath}" exists`)

      const compiler = getCompiler(req, filePath)

      if (req.query.hot) {
        return handleHotRequest(compiler, memoryFS, req, res)
      }

      return compiler.getStats(() => {
        try {
          return sendFile(memoryFS, req, res)
        } catch (error) {
          debug(`Webpack result "${req.path}" is not a file`)
          return next()
        }
      })
    }

    debug(`Cannot handle "${req.path}"`)
    return next()
  }
}

function handleHotRequest(compiler, memoryFS, req, res) {
  debug(`Sending hot updates to "${req.path}"`)

  res.set('Content-Type', 'text/event-stream')
  res.set('Cache-Control', 'no-cache')
  res.set('Connection', 'keep-alive')

  res.write('\n')

  const unsubscribe = compiler.watchStats(webpackStats => {
    const stats = webpackStats.toJson({
      errorDetails: false,
    })

    debug(`Sending updates "${stats.hash}" to ${req.path}`)

    const payload = JSON.stringify({
      type: 'HOT_UPDATE',
      time: stats.time,
      hash: stats.hash,
      warnings: stats.warnings || [],
      errors: stats.errors || [],
      modules: createModuleMap(stats.modules),
    })

    res.write(`data: ${payload}\n\n`)
  })

  const heartbeat = setInterval(() => {
    debug(`Sending heartbeat to "${req.path}"`)
    res.write('data: ❤️\n\n')
  }, 10000)

  req.on('close', () => {
    debug(`Stopping hot updates to "${req.path}"`)
    unsubscribe()
    clearInterval(heartbeat)
  })
}

function sendFile(memoryFS, req, res) {
  if (memoryFS.statSync(req.path).isFile()) {
    const file = memoryFS.readFileSync(req.path, 'utf-8')

    res.set('Content-Type', mime.getType(req.path))
    res.set('Content-Length', file.length)

    return res.send(file)
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
