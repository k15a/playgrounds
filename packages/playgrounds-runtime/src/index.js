// Packages
import { h, render } from 'preact'
import { Provider } from 'preact-redux'
import { constantCase } from 'change-case'

// Files
import App from './App'
import store from './store'

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.body,
)

const installProgressEventSource = new EventSource(
  '/__playgrounds__/install-progress',
)
installProgressEventSource.onmessage = function handleMessage(event) {
  if (event.data !== '❤️') {
    const { type, ...rest } = JSON.parse(event.data)
    store.dispatch({
      type: `installProgress/${constantCase(type)}`,
      ...rest,
    })
  }
}

const runtime = {
  get hasError() {
    const state = store.getState()
    return state.compileErrors.length !== 0 || state.runtimeErrors.length !== 0
  },
  reportCompileErrors(errors) {
    store.dispatch({
      type: 'compileErrors/REPORT_COMPILE_ERRORS',
      errors,
    })
  },
}

window.runtime = runtime
