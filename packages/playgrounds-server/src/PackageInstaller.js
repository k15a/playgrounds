// Native
const util = require('util')
const EventEmitter = require('events')

// Packages
const execa = require('execa')
const resolve = util.promisify(require('resolve'))

// Files
const Queue = require('./Queue')

const useYarn = (() => {
  try {
    execa.sync('yarnpkg', ['--version'], {
      stdio: 'ignore',
    })
    return true
  } catch (error) {
    return false
  }
})()

const peerRegex = useYarn
  ? /has unmet peer dependency "(.+)@(.+)"/
  : /requires a peer of (.+)@(.+) but none is installed/

class PackageInstaller {
  constructor(projectDir) {
    this.projectDir = projectDir
    this.installing = new Map()
    this.events = new EventEmitter()
    this.queue = new Queue(this.worker.bind(this))
  }

  watch(listener) {
    this.events.on('data', listener)
    return () => {
      this.events.removeListener('data', listener)
    }
  }

  extractPeerDependencies(output) {
    return output
      .split('\n')
      .map(line => peerRegex.exec(line))
      .filter(Boolean)
      .map(([, dependency, version]) => {
        if (version.includes(' ')) {
          return dependency
        }

        return [dependency, version].join('@')
      })
  }

  async worker(dependency) {
    this.events.emit('data', {
      type: 'start',
      dependency,
    })

    const command = useYarn
      ? ['yarnpkg', ['add', dependency]]
      : ['npm', ['install', dependency]]

    const output = execa(...command, {
      cwd: this.projectDir,
    })

    if (useYarn) {
      const processMessage = data => {
        const messages = data
          .toString()
          .split('\n')
          .filter(Boolean)

        for (const message of messages) {
          // Yarn steps
          const match = /\[\d\/\d] (.+)/.exec(message)
          if (match) {
            this.events.emit('data', {
              type: 'step',
              step: match[1],
            })
          }
        }
      }

      output.stdout.on('data', processMessage)
      output.stderr.on('data', processMessage)
    }

    const { stderr } = await output

    this.events.emit('data', {
      type: 'done',
      dependency,
    })

    const peerDependencies = this.extractPeerDependencies(stderr)
    for (const peerDependency of peerDependencies) {
      await this.worker(peerDependency)
    }
  }

  async install(dependency) {
    if (this.queue.has(dependency)) {
      return await this.queue.wait(dependency)
    }

    return await this.queue.add(dependency)
  }

  async check(request) {
    const namespaced = request.charAt(0) === '@'
    const dependency = request
      .split('/')
      .slice(0, namespaced ? 2 : 1)
      .join('/')

    // Ignore relative modules, which aren't installed by yarn
    if (!/^\w[a-z\-0-9.]+$/.test(dependency) && !namespaced) {
      return null
    }

    // Ignore modules which can be resolved using require.resolve()'s algorithm
    try {
      await resolve(dependency, {
        basedir: this.projectDir,
      })
      return null
    } catch (error) {
      // Module is not resolveable
      return dependency
    }
  }
}

module.exports = PackageInstaller
