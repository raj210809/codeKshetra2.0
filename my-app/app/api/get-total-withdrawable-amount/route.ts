import { NextResponse } from 'next/server';
import { createAuthenticatedSupabaseClient } from '@/lib/createAuthenticatedSupabaseClient';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request) {

   const session = await getServerSession(authOptions);

    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');
  
    if (!address) {
      return NextResponse.json({ error: 'Address is required' }, { status: 400 });
    }

      //@ts-ignore
  if(!session || !session.user?.address){
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }
    
    try {

      const supabase = createAuthenticatedSupabaseClient(session);
      const { data, error } = await supabase
        .from('testnet_invoices')
        .select('stream_id, chain_id')
        .eq('payee_evm_address', address)
        .not('stream_id', 'is', null);
  
      if (error) throw error;
  
      const streams = data.map(({ stream_id, chain_id }) => ({ stream_id, chain_id }));
  
      return NextResponse.json(streams);
    } catch (error) {
      console.error('Error fetching user streams:', error);
      return NextResponse.json({ error: 'Failed to fetch user streams' }, { status: 500 });
    }
}