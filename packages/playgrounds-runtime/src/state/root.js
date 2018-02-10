// Packages
import { combineReducers } from 'redux'

// Files
import compileErrors from './compileErrors'
import installProgress from './installProgress'

const rootReducer = combineReducers({
  compileErrors,
  installProgress,
})

export default rootReducer
