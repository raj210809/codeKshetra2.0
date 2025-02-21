import { NextResponse } from 'next/server';
import { supabaseClient } from '@/lib/supabaseClient';

export async function POST(request: Request) {


  try {
    const body = await request.json();
    const { requestId, streamId } = body;

    if (!requestId || !streamId) {
      return NextResponse.json(
        { success: false, error: 'Request ID and Stream ID are required' },
        { status: 400 }
      );
    }
    console.log(requestId)
    console.log(streamId)

    

    const { data, error } = await supabaseClient
      .from('testnet_invoices')
      .update({ stream_id: streamId })
      .eq('request_id', requestId)
      .select();

    if (error) throw error;

    if (data && data.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No invoice found with the given Request ID' },
        { status: 404 }
      );
    }

    

    return NextResponse.json({ success: true, data: data[0] }, { status: 200 });
  } catch (error) {
    console.error('Detailed error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update invoice with stream ID' },
      { status: 500 }
    );
  }
}