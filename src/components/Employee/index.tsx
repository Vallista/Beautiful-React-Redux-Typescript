import React from 'react'
import { IEmployee } from '../../apis/modules/employee'

interface IProps extends IEmployee { }

const Employee: React.FC<IProps> = ({ employee_name, employee_salary, employee_age, profile_image }: IEmployee) => (
  <div>
    <span>{employee_name}</span>
    <span>{employee_salary}</span>
    <span>{employee_age}</span>
    <span>{profile_image}</span>
  </div>
)


export default Employee