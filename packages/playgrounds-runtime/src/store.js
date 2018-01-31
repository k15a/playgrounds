import { createStore } from 'redux'

import rootReducer from './state/root'

const store = createStore(rootReducer)

export default store
