import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createAuthenticatedSupabaseClient } from '@/lib/createAuthenticatedSupabaseClient';

interface Invoice {
  created_at: string;
  payer_evm_address: string;
  payee_evm_address: string;
  expected_amount: number;
  request_id: string;
  chain_id: number;
  stream_id: number;
  status: string;
  due_date: string;
}

interface FormattedInvoice {
  created_at: string;
  payer_evm_address: string;
  payee_evm_address: string;
  expected_amount: string;
  request_id: string;
  chain_id: number;
  stream_id: number;
  status: string;
  due_date: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const payee_address = searchParams.get('payee_address');

  const session = await getServerSession(authOptions);

  if (!payee_address) {
    return NextResponse.json({ error: 'Payee address is required' }, { status: 400 });
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
      .select('created_at, payer_evm_address, payee_evm_address, expected_amount, request_id, chain_id, stream_id, due_date')
      .eq('payee_evm_address', payee_address)
      .order('created_at', { ascending: false });

    const supabaseEndTime = performance.now();
    const supabaseTimeTaken = supabaseEndTime - supabaseStartTime;

    console.log(`Supabase query took ${supabaseTimeTaken.toFixed(2)} milliseconds`);

    if (error) throw error;

    const formattedData: FormattedInvoice[] = (data as Invoice[]).map(invoice => ({
      created_at: new Date(invoice.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      payer_evm_address: invoice.payer_evm_address,
      payee_evm_address: invoice.payee_evm_address,
      expected_amount: `${invoice.expected_amount}`,
      request_id: invoice.request_id,
      chain_id: invoice.chain_id,
      stream_id: invoice.stream_id,
      status: invoice.status,
      due_date: new Date(invoice.due_date).toISOString(), // Keep it as ISO string
    }));

    console.log(formattedData);

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json({ error: 'Failed to fetch invoices', details: (error as Error).message }, { status: 500 });
  }
}