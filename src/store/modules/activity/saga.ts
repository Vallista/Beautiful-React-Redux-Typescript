import { takeEvery, call, put } from 'redux-saga/effects'

import { fetchActivities } from '../../../apis/modules/activity'
import { FETCH_ACTIVITIES } from './reducer'

function* fetch() {
  try {
    const activities = yield call(fetchActivities)
    yield put({ type: FETCH_ACTIVITIES.SUCCESS, payload: { activities: activities } })
  } catch (e) {
    yield put({ type: FETCH_ACTIVITIES.FAILURE, payload: { message: e.message } })
  }
}

export default [
  takeEvery(FETCH_ACTIVITIES.REQUEST, fetch)
]