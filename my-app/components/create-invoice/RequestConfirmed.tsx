import React from 'react'
import { NeonGradientCard } from '../magicui/neon-gradient-card'
import { Button } from '../ui/button'
import Link from 'next/link'


type RequestConfirmedProps = {
  requestId: string
}

const RequestConfirmed = ({
  requestId
}:
  RequestConfirmedProps
) => {
  return (
    <NeonGradientCard className="max-w-sm items-center justify-center text-center">

      <span className="pointer-events-none z-10 h-full whitespace-pre-wrap bg-gradient-to-br from-[#77d36f] from-35% to-[#00ff37] bg-clip-text text-center text-6xl font-bold leading-none tracking-tighter text-transparent dark:drop-shadow-[0_2px_4px_rgba(111,211,161,0.4)]">
        Request Confirmed
      </span>

      <div className="flex justify-center mt-6  z-10">
        <Link href={`/invoice/${requestId}`}>
          <Button size={"lg"}>Go to invoice</Button>
        </Link>
      </div>

    </NeonGradientCard>
  )
}

export default RequestConfirmed