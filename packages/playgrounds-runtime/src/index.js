import { h, render } from 'preact'
import { Provider } from 'preact-redux'
import { constantCase } from 'change-case'

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

// const runtime = {
//   compileError(error) {
//     console.log('runtime', error)
//   },
// }
//
// window.runtime = runtime
