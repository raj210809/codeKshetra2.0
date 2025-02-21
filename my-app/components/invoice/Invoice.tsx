import React, { useEffect, useState } from 'react'
import { IInvoiceData } from '@/types/interfaces';
import ActionButtons from './ActionButtons';
import NotPaidInvoice from './NotPaidInvoice';
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from '../ui/use-toast';

type InvoiceProps = {
  requestId: string
}

const Invoice = ({
  requestId
}: InvoiceProps) => {
  const [invoiceData, setInvoiceData] = useState<IInvoiceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const {toast} = useToast();

  async function getInvoiceData(requestId: string) {
    const res = await fetch(`/api/get-invoice?request_id=${requestId}`, { cache: 'no-store' });
    if (!res.ok) {
      throw new Error('Failed to fetch invoice data');
    }
    return res.json();
  }

  useEffect(() => {
    async function fetchInvoiceData() {
      if (requestId) {
        try {
          setIsLoading(true);
          const data = await getInvoiceData(requestId as string);
          setInvoiceData(data)
          console.log('Invoice Data:', data);
        } catch (error) {
          console.error('Error fetching invoice data:', error);
          toast({
            title: 'Error fetching invoice data in Invoice',
            variant: 'destructive'
          })
        } finally {
          setIsLoading(false);
        }
      }
    }

    fetchInvoiceData();
  }, [requestId]);

  return (
    <div className='flex items-center justify-center min-h-screen w-full p-4'>
      <div className='w-full max-w-md'>
        {isLoading ? (
          <div className='space-y-4'>
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : invoiceData ? (
          <div className='grid grid-cols-1 lg:grid-cols-1 items-center justify-items-center w-full'>
            {invoiceData.paymentDetails.stream_id ? (
              <ActionButtons requestId={requestId} streamId={invoiceData.paymentDetails.stream_id} chain_id={invoiceData.paymentDetails.chain_id} invoiceData={invoiceData} />

            ) : (
              <div className='w-full'>
                <NotPaidInvoice requestId={requestId} invoiceData={invoiceData} />
              </div>
            )}
       
          </div>
        ) : (
          <div>No invoice data available.</div>
        )}
      </div>
    </div>
  )
}

export default Invoice