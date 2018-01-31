// Native
const util = require('util')
const EventEmitter = require('events')

// Packages
const execa = require('execa')
const resolve = util.promisify(require('resolve'))

// Files
const Queue = require('./Queue')

class YarnInstaller {
  constructor(projectDir) {
    this.projectDir = projectDir
    this.installing = new Map()
    this.events = new EventEmitter()
    this.queue = new Queue(this.worker.bind(this))
  }

  watch(listener) {
    this.events.on('step', listener)
    return () => {
      this.events.removeListener('step', listener)
    }
  }

  extractPeerDependencies(output) {
    return output
      .split('\n')
      .map(message => {
        try {
          return JSON.parse(message)
        } catch (error) {
          return {}
        }
      })
      .filter(message => message.type === 'warning')
      .map(message =>
        /has unmet peer dependency "(.+)@(.+)"/.exec(message.data),
      )
      .filter(Boolean)
      .map(([, dependency, version]) => {
        if (version.includes(' ')) {
          return dependency
        }

        return [dependency, version].join('@')
      })
  }

  async worker(dependency) {
    this.events.emit('step', {
      type: 'start',
      dependency,
    })

    const output = execa('yarn', ['add', '--json', dependency], {
      cwd: this.projectDir,
    })

    const processMessage = data => {
      const messages = data
        .toString()
        .split('\n')
        .filter(Boolean)
      for (const message of messages) {
        try {
          const parsed = JSON.parse(message)
          this.events.emit('step', {
            ...parsed,
            dependency,
          })
        } catch (error) {
          // noop
        }
      }
    }

    output.stdout.on('data', processMessage)
    output.stderr.on('data', processMessage)

    const { stderr } = await output

    this.events.emit('step', {
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

module.exports = YarnInstaller
