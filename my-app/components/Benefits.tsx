import React from 'react'
import { WithRealTimeInvoicing } from './animated-lists/WithRealTimeInvoicing'

const Benefits = () => {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
    <div className="container px-4 md:px-6 grid lg:grid-cols-2 gap-12">
      <div className="space-y-4">
        <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Benefits</div>
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Reminders? Waiting for invoices? Not anymore.</h2>
        <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
          With streaming invoices you get paid in real time, the status of the transfers being reflected in the document itself.
        </p>
      </div>
      <div className='grid grid-cols-1 space-x-0'>
        {/* <div>
          <p className='max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed font-semibold text-gray-600'>❌ Without Real Time Invoicing</p>
      <WithoutRealTimeInvoicing />
      </div> */}
      <div>

      <WithRealTimeInvoicing />
      </div>

      </div>
    </div>
  </section>
  )
}

export default Benefits