import { takeEvery } from 'redux-saga/effects'

import API from '../../../apis/modules/employee'
import { createAsyncSaga } from '../../lib'
import { fetch } from './reducer'

const asyncFetchSaga = createAsyncSaga(fetch, API.fetchEmployees)

export default [
  takeEvery(fetch.request, asyncFetchSaga)
]