import { IRequest, IResponse, IError } from '../../../apis/modules/employee'
import { createAsyncAction, createActionEntity, createCustomReducer } from '../../lib'

export interface IEmployee {
  id: string
  employee_name: string
  employee_salary: string
  employee_age: string
  profile_image: string
}

const FETCH = createAsyncAction('employee/FETCH')
export const fetch = createActionEntity<IRequest, IResponse, IError>(FETCH)

const actions = { fetch }
const state = { employees: [] as IEmployee[], message: '' }

const reducer = createCustomReducer(state, actions)
  .handleAction(fetch.success, (state, action) => {
    return { ...state, employees: action.payload.data }
  })
  .handleAction(fetch.failure, (state, action) => {
    return { ...state, message: action.payload.message }
  })

export default reducer