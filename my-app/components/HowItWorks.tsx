import React from 'react'
import { AnimatedBeamMultipleOutputDemo } from './example/animated-beam-multiple-outputs'

const HowItWorks = () => {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
    <div className="container px-4 md:px-6 grid lg:grid-cols-1 gap-12">
      <div className="space-y-4">
        <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">How it works</div>
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Onchain transactions, real time payments</h2>
        <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
          We use Sablier & Request Network as the foundation of the our application, 2 battle tested infrastructure pieces that allows us to deliver you the best real-time invoicing experience available on the market
        </p>
      </div>
      <AnimatedBeamMultipleOutputDemo />
    </div>
  </section>
  )
}

export default HowItWorks