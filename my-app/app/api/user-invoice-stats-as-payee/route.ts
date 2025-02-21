// app/api/user-invoice-stats/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createAuthenticatedSupabaseClient } from '@/lib/createAuthenticatedSupabaseClient';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const user_address = searchParams.get('user_address');

  if (!user_address) {
    return NextResponse.json({ error: 'User address is required' }, { status: 400 });
  }

  const session = await getServerSession(authOptions);



  try {
    const supabase = createAuthenticatedSupabaseClient(session);

    const { data, error } = await supabase
      .from('testnet_invoices')
      .select('expected_amount')
      .eq('payee_evm_address', user_address);

    if (error) throw error;

    const totalExpectedAmount = (data as { expected_amount: string }[]).reduce((total, invoice) => {
      return total + parseFloat(invoice.expected_amount);
    }, 0);

    const totalInvoices = data.length;

    return NextResponse.json({ 
      totalExpectedAmount: totalExpectedAmount.toFixed(2),
      totalInvoices
    });
  } catch (error) {
    console.error('Error fetching invoice stats:', error);
    return NextResponse.json({ error: 'Failed to fetch invoice stats' }, { status: 500 });
  }
}