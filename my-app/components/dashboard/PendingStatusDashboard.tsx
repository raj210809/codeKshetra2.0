import React from 'react'


type PendingStatusDashboard = {
  isDueDateDestructive: boolean;
}

const PendingStatusDashboard = ({
  isDueDateDestructive
}: PendingStatusDashboard) => {


    const className = isDueDateDestructive ? 'font-medium text-red-400' : 'font-medium text-yellow-300'
    const textMessage = isDueDateDestructive ? 'Expired' : 'Pending'

  return (
    <p className={className}>{textMessage}</p>
  )
}

export default PendingStatusDashboard