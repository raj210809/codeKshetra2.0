import React from 'react'
import { NeonGradientCard } from '../magicui/neon-gradient-card'
import { Button } from '../ui/button'
import Link from 'next/link'
import { DialogContent, DialogHeader } from '../ui/dialog'
import { DialogTitle } from '@radix-ui/react-dialog'


type StreamCreatedSuccessProps = {
  requestId: string
}

const StreamCreatedSuccess = ({
  requestId
}:
StreamCreatedSuccessProps
) => {
  return (
    <DialogContent className="sm:max-w-[425px]">
    <DialogHeader>
    <DialogTitle></DialogTitle>
    </DialogHeader>
    <NeonGradientCard className="max-w-sm items-center justify-center text-center">
      <span className="pointer-events-none z-10 h-full whitespace-pre-wrap bg-gradient-to-br from-[#77d36f] from-35% to-[#00ff37] bg-clip-text text-center text-6xl font-bold leading-none tracking-tighter text-transparent dark:drop-shadow-[0_2px_4px_rgba(111,211,161,0.4)]">
        Stream Started
      </span>

      <div className="flex justify-center mt-6 z-10">
        <Link href={`/invoice/${requestId}`}>
          <Button size={"lg"}>Go to invoice</Button>
        </Link>
      </div>
    </NeonGradientCard>

    </DialogContent>

  )
}

export default StreamCreatedSuccess