// Packages
import { createStore } from 'redux'

// Files
import rootReducer from './state/root'

const store = createStore(rootReducer)

export default store
