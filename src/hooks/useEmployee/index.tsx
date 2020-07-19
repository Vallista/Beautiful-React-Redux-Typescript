import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../store'

import Employee from '../../store/modules/employee'

function useEmployee() {
  const dispatch = useDispatch()
  const employeeState = useSelector((store: RootState) => store.employee.employees)

  const fetchEmployees = () => {
    dispatch(Employee.actions.fetch.request(''))
  }

  return {
    employeeState,
    fetchEmployees
  }
}

export default useEmployee