import { combineReducers } from 'redux'
import { combineSagas } from '../lib'

import employee from './employee'
import activity from './activity'

export default {
  rootReducer: combineReducers({ employee: employee.reducer, activity: activity.reducer }),
  rootSagas: combineSagas({ activity: activity.saga, employee: employee.saga })
}