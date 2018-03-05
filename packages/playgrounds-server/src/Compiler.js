const EventEmitter = require('events')

// Packages
const webpack = require('webpack')
const debug = require('debug')('@playgrounds/server::Compiler')

class Compiler {
  constructor(fs, config) {
    debug('Creating compiler')
    this.webpackStats = null
    this.timeout = null
    this.events = new EventEmitter()

    this.events.on('newListener', name => {
      debug(`Adding event listener to "${name}"`)
      if (name === 'watch') {
        this.stopCloseTimer()
      }
    })
    this.events.on('removeListener', name => {
      debug(`Removing event listener from "${name}"`)
      if (name === 'watch') {
        this.resetCloseTimer()
      }
    })

    this.compiler = webpack(config)
    debug('Setting webpack output file system')
    this.compiler.outputFileSystem = fs

    debug('Registering "invalid" webpack event')
    this.compiler.hooks.invalid.tap(
      'Compiler',
      this.invalidateBundle.bind(this),
    )
    debug('Registering "watch-run" webpack event')
    this.compiler.hooks.watchRun.tap(
      'Compiler',
      this.invalidateBundle.bind(this),
    )

    debug('Starting to watch for changes')
    this.watching = this.compiler.watch({}, this.handleWatch.bind(this))

    this.startCloseTimer()
  }

  startCloseTimer() {
    if (this.events.listenerCount('watch') === 0) {
      debug('Starting close timer')
      this.timeout = setTimeout(this.close.bind(this), 10000)
    }
  }

  stopCloseTimer() {
    if (this.timeout !== null) {
      debug('Stopping close timer')
      clearTimeout(this.timeout)
    }
  }

  resetCloseTimer() {
    debug('Resetting close timer')
    this.stopCloseTimer()
    this.startCloseTimer()
  }

  handleWatch(error, stats) {
    debug('Webpack watch event')
    if (error) {
      throw error
    }

    this.webpackStats = stats
    this.events.emit('watch', stats)
  }

  invalidateBundle() {
    debug('Invalidate the bundle')
    this.webpackStats = null
  }

  getStats(callback) {
    debug(`Getting webpack stats with "${callback.name}"`)
    if (this.webpackStats) {
      debug('Using cached stats')
      this.resetCloseTimer()
      return callback(this.webpackStats)
    }

    debug('Waiting for new stats')
    return this.events.once('watch', callback)
  }

  watchStats(listener) {
    debug(`Starting to watch webpack stats with "${listener.name}"`)
    this.events.on('watch', listener)

    if (this.webpackStats) {
      debug('Sending cached stats')
      listener(this.webpackStats)
    }

    return () => {
      debug(`Stopping to watch webpack stats with "${listener.name}"`)
      this.events.removeListener('watch', listener)
    }
  }

  close() {
    debug('Closing the webpack compiler')
    // To be sure we are not closing a compiler with open listeners.
    // This should never happen and therefore would be a bug.
    if (this.events.listenerCount('watch') !== 0) {
      throw new Error(`Can't close compiler with open listeners.`)
    }

    this.watching.close(() => {
      this.events.emit('close')
      debug('Compiler closed')
    })
  }

  onClose(listener) {
    debug(`Start to watch close event with "${listener.name}"`)
    this.events.once('close', listener)

    return () => {
      debug(`Stopping to watch close event with "${listener.name}"`)
      this.events.removeListener('close', listener)
    }
  }
}

module.exports = Compiler
