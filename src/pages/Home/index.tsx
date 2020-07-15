import React, { useEffect } from 'react'

import useEmployee from '../../hooks/useEmployee'

import Employee from '../../components/Employee'

const Home: React.FC = () => {
  const { employeeState, fetchEmployees } = useEmployee()

  useEffect(() => {
    fetchEmployees()
  }, [])

  return <div>
    Home!
    {employeeState.map((employee, index) => <Employee {...employee} key={index} />)}
  </div>
}

export default Home