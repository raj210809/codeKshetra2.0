import React from 'react'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'

interface StatsCardProps {
  description: string;
  amount: string | number;
}

const StatsCard: React.FC<StatsCardProps> = ({ description, amount }) => {
  return (
    <Card x-chunk="">
      <CardHeader className="pb-2">
        <CardDescription className="font-semibold text-sm">{description}</CardDescription>
        <CardTitle className="text-4xl">{typeof amount === 'number' ? amount.toLocaleString() : amount}</CardTitle>
      </CardHeader>
    
      <CardFooter>
        {/* <Progress value={12} aria-label="12% increase" /> */}
      </CardFooter>
    </Card>
  )
}

export default StatsCard