import {
  ActionType,
  createReducer,
  createAsyncAction
} from 'typesafe-actions'
import { IEmployee } from '../../../apis/modules/employee';

const FETCH_EMPLOYEES = {
  REQUEST: 'EMPLOYEES_FETCH_REQUEST',
  SUCCESS: 'EMPLOYEES_FETCH_SUCCESS',
  FAILURE: 'EMPLOYEES_FETCH_FAILURE'
}

interface IRequest {

}

interface IResponse {
  employees: IEmployee[]
}

interface IError {
  message: string
}

export const fetchEmployees =
  createAsyncAction(FETCH_EMPLOYEES.REQUEST, FETCH_EMPLOYEES.SUCCESS, FETCH_EMPLOYEES.FAILURE)<IRequest, IResponse, IError>()

const actions = {
  fetchEmployees
}

type Actions = ActionType<typeof actions>
type State = { employees: IEmployee[], message: string }

const initialState: State = { employees: [], message: '' }

const reducer = createReducer<State, Actions>(initialState)
  .handleAction(fetchEmployees.success, (state, action) => {
    return { ...state, employees: action.payload.employees }
  })
  .handleAction(fetchEmployees.failure, (state, action) => {
    return { ...state, message: action.payload.message }
  })
  .handleAction(fetchEmployees.request, (state) => {
    return { ...state }
  })

export default reducer