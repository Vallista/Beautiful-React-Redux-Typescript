import React, { useEffect } from 'react'

import useEmployee from '../../hooks/useEmployee'
import useActivity from '../../hooks/useActivity'

import Employee from '../../components/Employee'
import Activity from '../../components/Activity'

const Home: React.FC = () => {
  const { employeeState, fetchEmployees } = useEmployee()
  const { activities, fetchActivities } = useActivity()

  useEffect(() => {
    fetchEmployees()
    fetchActivities()
  }, [])

  return <div>
    Home!
    {employeeState.map((employee, index) => <Employee {...employee} key={index} />)}
    <hr />
    {activities.map((activity, index) => <Activity {...activity} key={index} />)}
  </div>
}

export default Home