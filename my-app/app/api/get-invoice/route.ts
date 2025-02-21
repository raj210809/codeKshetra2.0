import { NextResponse } from 'next/server';
import { requestClient } from '@/lib/requestNetworkClient';
import { requestClientSepolia } from '@/lib/requestNetworkClientSepolia';
import { IInvoiceData } from '@/types/interfaces';
import { createAuthenticatedSupabaseClient } from '@/lib/createAuthenticatedSupabaseClient';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request) {

    const session = await getServerSession(authOptions);

    const { searchParams } = new URL(request.url);
    const requestId = searchParams.get('request_id');


    if (!requestId) {
      return NextResponse.json({ error: 'requestId is required' }, { status: 400 });
    }
    //@ts-ignore
    if(!session || !session.user?.address){
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
  
    try {
        const supabaseStartTime = performance.now();
        const supabase = createAuthenticatedSupabaseClient(session);

        const { data, error } = await supabase
            .from('testnet_invoices')
            .select('*')
            .eq('request_id', requestId)
            .single();

        const supabaseEndTime = performance.now();
        const supabaseTimeTaken = supabaseEndTime - supabaseStartTime;

        console.log(`Supabase query took ${supabaseTimeTaken.toFixed(2)} milliseconds`);

      if (error) throw error;
   
       const requestStartTime = performance.now();

      // Choose the appropriate client based on the gateway
      const client = data.gateway === 'sepolia' ? requestClientSepolia : requestClient;
      console.log(`Used gateway: ${data.gateway}`);
      const requestnetwork = await client.fromRequestId(requestId);
      const requestData = requestnetwork.getData();

        const requestNetworkEndTime = performance.now();

        const requestNetworkTimeTaken = requestNetworkEndTime - requestStartTime;

        console.log(`Request ipfs query took ${requestNetworkTimeTaken.toFixed(2)} milliseconds`);


 
      const invoiceData: IInvoiceData = {
        partiesDetails : {
            seller: {
                name: data.payee_name,
                email: data.payee_email,
                address: data.payee_address,
                city: data.payee_city,
                state: data.payee_state,
                zip: data.payee_zip,
                country: data.payee_country
              },
              client: {
                name: data.payer_name,
                email: data.payer_email,
                address: data.payer_address,
                city: data.payer_city,
                state: data.payer_state,
                zip: data.payer_zip,
                country: data.payer_country
              }
        },
        paymentDetails: {
            payeeAddress: requestData.payee?.value as string,
            payerAddress: requestData.payer?.value as string,
            // ! REPLACE THIS WITH ACTUAL CHAIN
            chain: data.chain_id,
            currency: requestData.currencyInfo.value,
            streamType: "linear",
            dueDate: requestData.contentData.dueDate,
            totalAmount: requestData.expectedAmount,
            invoiceItems: requestData.contentData.invoiceItems,
            stream_id:data.stream_id,
            chain_id:data.chain_id
        }
      }
      
      console.log(invoiceData)

      return NextResponse.json(invoiceData);

  
    //   return NextResponse.json(data);
    } catch (error) {
      console.error('Error fetching user details:', error);
      return NextResponse.json({ error: 'Failed to fetch user details' }, { status: 500 });
    }
  }