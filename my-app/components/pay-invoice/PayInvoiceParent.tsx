import React from 'react'
import DisplayInvoice from './DisplayInvoice'

type PayInvoiceParentType = {
    requestId: string
}

const PayInvoiceParent = ({
    requestId
}: PayInvoiceParentType) => {
  return (
    <div className='h-screen grid grid-cols-1 justify-items-center items-center'>

            <DisplayInvoice requestId={requestId as string} />
         
    </div>
  )
}

export default PayInvoiceParent