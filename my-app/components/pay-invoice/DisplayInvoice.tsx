import React, { useEffect, useState } from 'react'
import Spinner from '../helpers/Spinner';
import InvoiceContent from '../invoice/InvoiceContent';
import PaymentDialog from './PaymentDialog';
import { useAccount } from 'wagmi';
import { useToast } from '../ui/use-toast';

// New type definition
type InvoiceData = {
    partiesDetails: {
        seller: {
            name: string;
            email: string;
            address: string;
            city: string;
            state: string;
            zip: string;
            country: string;
        };
        client: {
            name: string;
            email: string;
            address: string;
            city: string;
            state: string;
            zip: string;
            country: string;
        };
    };
    paymentDetails: {
        payeeAddress: string;
        payerAddress: string;
        chain: string;
        currency: string;
        streamType: string;
        dueDate: number;
        totalAmount: string;
        invoiceItems: Array<{
            name: string;
            quantity: number;
            price: number;
        }>;
        chain_id: number;
    };
};

type InvoiceProps = {
    requestId: string
}

const DisplayInvoice = ({
    requestId
}: InvoiceProps) => {
    const [invoiceData, setInvoiceData] = useState<InvoiceData | undefined>();
    const {address} = useAccount();

    async function getInvoiceData(requestId: string): Promise<InvoiceData> {
        const res = await fetch(`/api/get-invoice?request_id=${requestId}`, { cache: 'no-store' });
        if (!res.ok) {
            throw new Error('Failed to fetch invoice data');
        }
        return res.json();
    }

    const {toast} = useToast();

    useEffect(() => {
        async function fetchInvoiceData() {
            if (requestId) {
                try {
                    const data = await getInvoiceData(requestId as string);
                    setInvoiceData(data)
                    console.log('Invoice Data:', data);
                } catch (error) {
                    toast({
                        title: 'Error fetching invoice data in Display Invoice',
                        variant: 'destructive'
                      })
                    console.error('Error fetching invoice data:', error);
                }
            }
        }

        fetchInvoiceData();
    }, [requestId]);

    return (
        <div className='grid grid-cols-1 lg:grid-cols-1 items-center justify-items-center mt-8'>
            {invoiceData ?

                <InvoiceContent
                    invoiceData={invoiceData}
                />

                :
                <Spinner className='w-24 h-24' />
            }

            {invoiceData && invoiceData.paymentDetails.payerAddress === address ?

                <div className='mt-4'>
                    <PaymentDialog
                        totalAmount={invoiceData.paymentDetails.totalAmount}
                        requestId={requestId}
                        payeeAddress={invoiceData.paymentDetails.payeeAddress}
                        dueDate={invoiceData.paymentDetails.dueDate}
                        chain_id={invoiceData.paymentDetails.chain_id}
                        payerAddress={invoiceData.paymentDetails.payerAddress}
                        payerName={invoiceData.partiesDetails.client.name}
                        payeeName={invoiceData.partiesDetails.seller.name}
                        receiverEmail={invoiceData.partiesDetails.seller.email}
                        link={`https://app.streambill.xyz/invoice/${requestId}`}

                    />
                </div>

                :
       null
            }

            {
               invoiceData && invoiceData.paymentDetails.payerAddress !== address && <p>You are not the payer of this invoice</p>
            }

        </div>
    )
}

export default DisplayInvoice