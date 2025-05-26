import { authOptions } from '@/lib/auth';
import { createAuthenticatedSupabaseClient } from '@/lib/createAuthenticatedSupabaseClient';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    //@ts-ignore
    if (!session || !session.user?.address) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
  
    try {
      const body = await request.json();
      const { title, description, price, chain_id, delivery_time, mainnet_accept } = body;
  
      const supabase = createAuthenticatedSupabaseClient(session);
  
      // Validate required fields
      if (!title || price == null || !chain_id || !delivery_time ) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
      }
  
      // Insert the new gig
      const { data, error } = await supabase
        .from('gigs')
        .insert({
          //@ts-ignore
          creator_address: session.user.address,
          title,
          description,
          price,
          chain_id,
          delivery_time,
          mainnet_accept: mainnet_accept ?? false, // Use the provided value or default to false

        })
        .select();
  
      if (error) {
        console.error('Supabase error:', error);
        return NextResponse.json({ error: 'Failed to create gig' }, { status: 500 });
      }
  
      return NextResponse.json({ message: 'Gig created successfully', data });
    } catch (error) {
      console.error('Error creating gig:', error);
      return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
    }
  }