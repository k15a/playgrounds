// Packages
import { h } from 'preact'
import { connect } from 'preact-redux'

// Files
import CompileErrors from './components/CompileErrors'
import InstallProgress from './components/InstallProgress'

const App = ({ compileErrors, installProgress }) =>
  installProgress.isInstalling ? (
    <InstallProgress />
  ) : compileErrors.length !== 0 ? (
    <CompileErrors />
  ) : null

const mapStateToProps = ({ compileErrors, installProgress }) => ({
  compileErrors,
  installProgress,
})

export default connect(mapStateToProps)(App)
