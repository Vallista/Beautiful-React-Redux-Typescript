import { takeEvery, call, put } from 'redux-saga/effects'

import { fetchEmployees } from '../../../apis/modules/employee'
import { FETCH_EMPLOYEES } from './reducer'

function* fetch() {
  try {
    const employees = yield call(fetchEmployees)
    yield put({ type: FETCH_EMPLOYEES.SUCCESS, payload: { employees: employees.data } })
  } catch (e) {
    yield put({ type: FETCH_EMPLOYEES.FAILURE, payload: { message: e.message } })
  }
}

export default [
  takeEvery(FETCH_EMPLOYEES.REQUEST, fetch)
]