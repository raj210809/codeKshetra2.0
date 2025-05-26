import { NextResponse } from 'next/server';
import { requestClient } from '@/lib/requestNetworkClient';
import { requestClientSepolia } from '@/lib/requestNetworkClientSepolia';
import { IInvoiceData, IInvoiceDataGig } from '@/types/interfaces';
import { createAuthenticatedSupabaseClient } from '@/lib/createAuthenticatedSupabaseClient';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request) {

    const session = await getServerSession(authOptions);

    //@ts-ignore
    if(!session || !session.user?.address){
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    try {
        const supabase = createAuthenticatedSupabaseClient(session);

        const { data, error } = await supabase
            .from('testnet_invoices')
            .select('*')
            //@ts-ignore
            .eq('payee_evm_address', session.user.address)
            .not('gig_id', 'is', null);

        if (error) throw error;

        const invoicesData = await Promise.all(data.map(async (invoice) => {



            // ! TODO: add the client and freelancer name
            return {
                id: invoice.gig_id,
                createdDate: invoice.created_at,
                clientName: invoice.payer_evm_address,
                clientEmail: invoice.payer_email,
                freelancerName: invoice.payee_evm_address,
                freelancerEmail: invoice.payee_email,
                progress: 50, // You might want to calculate this based on the current date and due date
                amountStreaming: invoice.expected_amount,
                endDate: invoice.due_date,
                status: 'streaming', // You might want to determine this based on the current state
                requestId: invoice.request_id,
                streamId: invoice.stream_id,
                chainId: invoice.chain_id
            };
        }));

        return NextResponse.json(invoicesData);

    } catch (error) {
        console.error('Error fetching invoices:', error);
        return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 });
    }
}