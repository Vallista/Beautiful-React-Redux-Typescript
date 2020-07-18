import { combineReducers } from 'redux'
import employee from './employee'
import { ForkEffect } from 'redux-saga/effects'

const combineSagas = (param: { [key: string]: () => Generator<ForkEffect<never>, void, unknown> }) => function* () {
  const targetSagas = Object.values(param)

  for (let i = 0; i < targetSagas.length; i++) {
    yield targetSagas[i]()
  }
}

export default {
  rootReducer: combineReducers({ employee: employee.reducer }),
  rootSagas: combineSagas({ employee: employee.saga })
}