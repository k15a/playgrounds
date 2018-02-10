var eventSource = new EventSource(process.env.HOT_PATH)
eventSource.onmessage = function handleMessage(event) {
  if (event.data === '❤️') {
    return null
  }

  return processMessage(JSON.parse(event.data))
}

function processMessage(message) {
  if (message.errors.length > 0) {
    if (window.runtime) {
      window.runtime.reportCompileErrors(message.errors)
    } else {
      for (const error of message.errors) {
        console.error(error)
      }
    }
  } else {
    if (message.warnings.length > 0) {
      for (const warning of message.warnings) {
        console.warn(warning)
      }
    }

    processUpdate(message.hash, message.modules)
  }
}

function updateAvailable(hash) {
  // eslint-disable-next-line
  return hash !== __webpack_hash__
}

function processUpdate(hash) {
  if (updateAvailable(hash) && module.hot.status() === 'idle') {
    module.hot.check(true).catch(function handleError() {
      var status = module.hot.status()
      if (status === 'fail' || status === 'abort') {
        window.location.reload()
      }
    })
  }
}
