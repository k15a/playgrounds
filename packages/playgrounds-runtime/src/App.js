import { h } from 'preact'
import { connect, Provider } from 'preact-redux'

import store from './store'
import Iframe from './components/Iframe'
import InstallProgress from './components/InstallProgress'

const App = ({ installProgress }) =>
  installProgress ? (
    <Iframe
      title="Playgrounds Overlay"
      style={{
        position: 'absolute',
        top: '0',
        left: '0',
        height: '100%',
        width: '100%',
        border: 'none',
        backgroundColor: 'white',
      }}
    >
      <Provider store={store}>
        <div
          style={{
            fontFamily: 'sans-serif',
          }}
        >
          <InstallProgress />
        </div>
      </Provider>
    </Iframe>
  ) : null

const mapStateToProps = ({ installProgress }) => ({
  installProgress: installProgress.isInstalling,
})

export default connect(mapStateToProps)(App)
