// Native
const EventEmitter = require('events')

class Queue {
  constructor(worker) {
    this.worker = worker
    this.running = false
    this.queue = []
    this.finishEvents = new EventEmitter()
  }

  has(value) {
    this.queue.includes(value)
  }

  async add(value, start) {
    if (start) {
      this.queue.unshift(value)
    } else {
      this.queue.push(value)
    }

    this.execute()
    return await this.wait(value)
  }

  async wait(value) {
    return await new Promise(resolve => {
      this.finishEvents.once(value, resolve)
    })
  }

  async execute() {
    if (!this.running) {
      this.running = true

      let current = null
      // eslint-disable-next-line
      while ((current = this.queue.shift())) {
        const result = await this.worker(current)
        this.finishEvents.emit(current, result)
      }

      this.running = false
    }
  }
}

module.exports = Queue
