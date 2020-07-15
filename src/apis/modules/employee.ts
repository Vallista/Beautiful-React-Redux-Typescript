import fetch, { } from 'node-fetch'

export interface IEmployee {
  id: string
  employee_name: string
  employee_salary: string
  employee_age: string
  profile_image: string
}

export const fetchEmployees = (): Promise<IEmployee> => {
  return fetch('http://dummy.restapiexample.com/api/v1/employees')
    .then(res => {
      if (!res.ok) {
        throw new Error(res.statusText)
      }
      return res.json() as Promise<IEmployee>
    })
}
