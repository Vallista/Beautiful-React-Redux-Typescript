import React from 'react'

interface IProps {
  id: string
  employee_name: string
  employee_salary: string
  employee_age: string
  profile_image: string
}

const Employee: React.FC<IProps> = ({ employee_name, employee_salary, employee_age, profile_image }: IProps) => (
  <div>
    <span>{employee_name}</span>
    <span>{employee_salary}</span>
    <span>{employee_age}</span>
    <span>{profile_image}</span>
  </div>
)


export default Employee