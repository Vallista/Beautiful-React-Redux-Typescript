import fetch from 'node-fetch'
import { IEmployee } from '../../store/modules/employee/reducer'

export interface IRequest { }

export interface IResponse {
  status: string
  data: IEmployee[]
}

export interface IError {
  message: string
}

const fetchEmployees = (): Promise<IResponse> => {
  return fetch('http://dummy.restapiexample.com/api/v1/employees')
    .then(res => {
      if (!res.ok) {
        throw new Error(res.statusText)
      }
      return res.json() as Promise<IResponse>
    })
}

export default {
  fetchEmployees
}