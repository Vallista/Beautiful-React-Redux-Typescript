import React from 'react'

interface IProps {
  ID: number,
  Title: string
  DueDate: string
  Completed: boolean
}

const Activity: React.FC<IProps> = ({ ID, Title, DueDate, Completed }) => {
  return <div>
    <span>{ID}</span>
    <span>{Title}</span>
    <span>{DueDate}</span>
    <span>{Completed}</span>
  </div>
}

export default Activity