import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createAuthenticatedSupabaseClient } from '@/lib/createAuthenticatedSupabaseClient';

export async function POST(request: Request) {

  const session = await getServerSession(authOptions);

    //@ts-ignore
    if(!session || !session.user?.address){
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

  try {
    const body = await request.json();
    const {
      requestId,
      payeeDetails,
      payerDetails,
      payerEVMAddress,
      payeeEVMAddress,
      expectedAmount,
      chain,
      dueDate,
      gateway,
      gigId
    } = body;
    
    console.log('``DUE DATE```')
    console.log(dueDate)

    // Insert invoice into Supabase
    const supabase = createAuthenticatedSupabaseClient(session);
    // Convert Unix timestamp to JavaScript Date object
    const dueDateObject = new Date(dueDate * 1000);
    
    // Format the date as an ISO string for PostgreSQL timestamptz
    const formattedDueDate = dueDateObject.toISOString();
    const { data, error } = await supabase
      .from('testnet_invoices')
      .insert({
        request_id: requestId,
        payee_name: payeeDetails.name || '',
        payee_email: payeeDetails.email || '',
        payee_address: payeeDetails.address || '',
        payee_city: payeeDetails.city || '',
        payee_state: payeeDetails.state || '',
        payee_zip: payeeDetails.zip || '',
        payee_country: payeeDetails.country || '',
        payer_name: payerDetails.name || '',
        payer_email: payerDetails.email || '',
        payer_address: payerDetails.address || '',
        payer_city: payerDetails.city || '',
        payer_state: payerDetails.state || '',
        payer_zip: payerDetails.zip || '',
        payer_country: payerDetails.country || '',
        payer_evm_address: payerEVMAddress,
        payee_evm_address: payeeEVMAddress,
        expected_amount: Number(expectedAmount),
        due_date: formattedDueDate,
        chain_id: Number(chain),
        gateway: gateway,
        gig_id: gigId
      });

    if (error) throw error;

    // Send email after successfully creating the invoice
    const apiRouteEmail = 'http://localhost:3000'
    const emailResponse = await fetch(`${apiRouteEmail}/api/send-invoice-created-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: payerDetails.name.split(' ')[0],
        seller: payeeDetails.name,
        amount: expectedAmount,
        dueDate,
        receiverEmail: payerDetails.email,
        link: `https://app.streambill.xyz/pay-invoice/${requestId}`
      }),
    });

    if (!emailResponse.ok) {
      console.error('Failed to send invoice email');
      // Decide how to handle email sending failure
      // You might want to log this or retry later
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/post-invoice:', error);
    return NextResponse.json({ success: false, error: 'Failed to create invoice' }, { status: 500 });
  }
}