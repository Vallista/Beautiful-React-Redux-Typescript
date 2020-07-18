import { applyMiddleware, createStore } from 'redux'
import createSagaMiddleware from 'redux-saga'

import modules from './modules'
// import sagas from './sagas'
// import reducers from './reducers'

const sagaMiddleware = createSagaMiddleware()

export type RootState = ReturnType<typeof modules.rootReducer>

const store = createStore(modules.rootReducer, applyMiddleware(sagaMiddleware))

sagaMiddleware.run(modules.rootSagas)

export default store
