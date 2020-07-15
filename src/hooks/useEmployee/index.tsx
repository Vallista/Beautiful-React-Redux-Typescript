import { useSelector, useDispatch } from 'react-redux'
import * as actions from '../../store/reducers'
import { RootState } from '../../store'

function useEmployee() {
  const dispatch = useDispatch()
  const employeeState = useSelector((store: RootState) => store.employees)

  const fetchEmployees = () => {
    dispatch(actions.fetchEmployees.request(''))
  }

  return {
    employeeState,
    fetchEmployees
  }
}

export default useEmployee