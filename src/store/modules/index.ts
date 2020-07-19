import { combineReducers } from 'redux'
import { ForkEffect } from 'redux-saga/effects'

import employee from './employee'
import activity from './activity'

const combineSagas = (param: { [key: string]: ForkEffect<never>[] }) => function* () {
  const targetSagas = Object.values(param).flat()

  for (let i = 0; i < targetSagas.length; i++) {
    yield targetSagas[i]
  }
}

export default {
  rootReducer: combineReducers({ employee: employee.reducer, activity: activity.reducer }),
  rootSagas: combineSagas({ activity: activity.saga, employee: employee.saga })
}