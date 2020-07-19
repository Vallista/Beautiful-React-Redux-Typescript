import { applyMiddleware, createStore } from 'redux'
import createSagaMiddleware from 'redux-saga'

import modules from './modules'

const sagaMiddleware = createSagaMiddleware()
const store = createStore(modules.rootReducer, applyMiddleware(sagaMiddleware))

export default store

sagaMiddleware.run(modules.rootSagas)

export type RootState = ReturnType<typeof modules.rootReducer>